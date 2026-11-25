import Product from "../../models/product.model.js";
import Wishlist from "../../models/wishlist.model.js";
import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    getPublicIdFromUrl,
} from "../../lib/utils.js";
import fs from "fs/promises";
import mongoose from "mongoose";

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cleanupTempUploads = async (files) => {
    if (!Array.isArray(files) || files.length === 0) return;
    await Promise.all(
        files.map((file) =>
            file?.path ? fs.unlink(file.path).catch(() => {}) : Promise.resolve()
        )
    );
};

const normalizeSizes = (sizes) => {
    if (!sizes) return undefined;

    if (Array.isArray(sizes)) {
        return sizes.map(s => s.trim()).filter(Boolean);
    }

    if (typeof sizes === "string") {
        try {
            const parsed = JSON.parse(sizes);
            if (Array.isArray(parsed)) {
                return parsed.map(s => s.trim()).filter(Boolean);
            }
        } catch {
            return sizes.split(",").map(s => s.trim()).filter(Boolean);
        }
    }

    return undefined;
};

const generateUniqueProductCode = async (state) => {
    let code;
    let isUnique = false;
    const stateCode = state.substring(0, 2).toLowerCase();

    while (!isUnique) {
        const randomNum = Math.floor(100 + Math.random() * 900);
        code = `${stateCode}${randomNum}`;
        const existingProduct = await Product.findOne({ code });
        if (!existingProduct) isUnique = true;
    }
    return code;
};

/* ===================== CREATE ===================== */

export const createProduct = async (req, res) => {
    const imageUrls = [];

    try {
        const {
            name,
            description,
            price,
            discount,
            category,
            subCategory,
            type,
            gender,
            state,
            sizes,
            hasSizes: hasSizesRaw,
            stock,
            bestseller,
            print,
            exclusivity,
        } = req.body;

        const hasSizes = hasSizesRaw === 'true' || hasSizesRaw === true;
        const parsedSizes = hasSizes ? normalizeSizes(sizes) : [];
        const numericStock = Number(stock);

        let parsedSpecs;
        if (req.body.specs) {
            try {
                parsedSpecs = typeof req.body.specs === "string"
                    ? JSON.parse(req.body.specs)
                    : req.body.specs;
            } catch {
                parsedSpecs = undefined;
            }
        }

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !subCategory ||
            !type ||
            !gender ||
            !state ||
            (hasSizes && !parsedSizes?.length) ||
            stock === undefined ||
            stock === "" ||
            !Number.isFinite(numericStock) ||
            numericStock < 0
        ) {
            return res.status(400).json({ message: "All required fields must be filled cleanly" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Product images are required" });
        }

        for (const file of req.files) {
            const imageUrl = await uploadImageToCloudinary(file);
            imageUrls.push(imageUrl);
            await fs.unlink(file.path);
        }

        const code = await generateUniqueProductCode(state);

        const discountedPrice = discount
            ? Math.round(Number(price) - (Number(price) * Number(discount)) / 100)
            : undefined;

        const newProduct = new Product({
            code,
            name,
            description,
            price: Number(price),
            discount: discount ? Number(discount) : 0,
            discountedPrice,
            image: imageUrls,
            category,
            subCategory,
            type,
            gender,
            state,
            hasSizes,
            sizes: parsedSizes,
            stock: numericStock,
            date: Date.now(),
            bestseller: bestseller === "true" || bestseller === true,
            print,
            exclusivity: exclusivity === "true" || exclusivity === true,
            ...(parsedSpecs && { specs: parsedSpecs }),
        }); 
        // console.log("Creating product with data:", newProduct);

        await newProduct.save();
        res.status(201).json(newProduct);

    } catch (error) {
        await cleanupTempUploads(req.files);
        for (const imageUrl of imageUrls) {
            const publicId = getPublicIdFromUrl(imageUrl);
            if (publicId) await deleteImageFromCloudinary(publicId).catch(() => {});
        }
        console.error("Error in createProduct:", error);
        const status =
            error?.statusCode === 400 || error?.statusCode === 413
                ? error.statusCode
                : 500;
        res.status(status).json({
            message: status !== 500 ? error.message : error?.message || "Internal Server Error",
        });
    }
};

/* ===================== READ ===================== */

export const getAllProductsAdmin = async (req, res) => {
    try {
        const { id, page, limit, search, category } = req.query;
        const filter = {};

        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid product id" });
            }
            filter._id = new mongoose.Types.ObjectId(id);
        }

        if (category && category !== "All") {
            filter.category = category;
        }

        if (search && String(search).trim()) {
            const regex = new RegExp(escapeRegex(String(search).trim()), "i");
            filter.$or = [
                { name: regex },
                { code: regex },
                { category: regex },
                { subCategory: regex },
                { type: regex },
                { state: regex },
            ];
        }

        const wantsPagination = page !== undefined || limit !== undefined;
        if (!wantsPagination) {
            const products = await Product.find(filter)
                .sort({ date: -1, createdAt: -1 })
                .lean();
            return res.status(200).json(products);
        }

        const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
        const requestedPage = Math.max(1, Number(page) || 1);

        const [total, rawCategories] = await Promise.all([
            Product.countDocuments(filter),
            Product.distinct("category"),
        ]);

        const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;
        const safePage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;
        const skip = (safePage - 1) * safeLimit;

        const products = await Product.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .lean();

        const categories = (rawCategories || []).filter(Boolean).sort();

        return res.status(200).json({
            products,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            categories,
        });
    } catch (error) {
        console.error("Error in getAllProductsAdmin:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAdminProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
        console.log("Fetched product:", product);
    } catch (error) {
        console.error("Error in getAdminProductById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/* ===================== UPDATE ===================== */

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const productToUpdate = await Product.findById(id);
        if (!productToUpdate) {
            return res.status(404).json({ message: "Product not found" });
        }

        const {
            name,
            description,
            price,
            discount,
            category,
            subCategory,
            type,
            gender,
            state,
            sizes,
            hasSizes: hasSizesRaw,
            stock,
            bestseller,
            print,
            exclusivity,
            existingImages,
        } = req.body;

        const hasSizes = hasSizesRaw !== undefined
            ? (hasSizesRaw === 'true' || hasSizesRaw === true)
            : undefined;
        const parsedSizes = hasSizes === false ? [] : normalizeSizes(sizes);

        const updateFields = {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price }),
            ...(category !== undefined && { category }),
            ...(subCategory !== undefined && { subCategory }),
            ...(type !== undefined && { type }),
            ...(gender !== undefined && { gender }),
            ...(state !== undefined && { state }),
            ...(hasSizes !== undefined && { hasSizes }),
            ...(parsedSizes !== undefined && { sizes: parsedSizes }),
            ...(stock !== undefined && { stock }),
            ...(bestseller !== undefined && { bestseller }),
            ...(print !== undefined && { print }),
            ...(exclusivity !== undefined && { exclusivity }),
        };

        if (discount !== undefined) {
            const currentPrice = Number(price !== undefined ? price : productToUpdate.price);
            const numericDiscount = Number(discount) || 0;
            updateFields.discount = numericDiscount;
            updateFields.discountedPrice =
                numericDiscount > 0
                    ? Math.round(currentPrice - (currentPrice * numericDiscount) / 100)
                    : undefined;
        }

        if (req.body.specs !== undefined) {
            try {
                updateFields.specs =
                    typeof req.body.specs === "string"
                        ? JSON.parse(req.body.specs)
                        : req.body.specs;
            } catch {
                // ignore malformed specs
            }
        }

        const hasExistingField = Object.prototype.hasOwnProperty.call(
            req.body,
            "existingImages"
        );
        let finalImageUrls = hasExistingField
            ? Array.isArray(existingImages)
                ? existingImages.filter(Boolean)
                : existingImages
                ? [existingImages]
                : []
            : [...(productToUpdate.image || [])];

        if (hasExistingField) {
            const imagesToDelete = (productToUpdate.image || []).filter(
                (url) => !finalImageUrls.includes(url)
            );
            for (const imageUrl of imagesToDelete) {
                const publicId = getPublicIdFromUrl(imageUrl);
                if (publicId) await deleteImageFromCloudinary(publicId);
            }
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const newImageUrl = await uploadImageToCloudinary(file);
                finalImageUrls.push(newImageUrl);
                await fs.unlink(file.path);
            }
        }
        if (hasExistingField || (req.files && req.files.length > 0)) {
            updateFields.image = finalImageUrls;
        }
        // console.log("Update Fields:", updateFields);
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );
        // console.log("Updated Product:", updatedProduct);
        res.status(200).json(updatedProduct);

    } catch (error) {
        await cleanupTempUploads(req.files);
        console.error("Error in updateProduct:", error);
        const status =
            error?.statusCode === 400 || error?.statusCode === 413
                ? error.statusCode
                : 500;
        res.status(status).json({
            message: status !== 500 ? error.message : error?.message || "Internal Server Error",
        });
    }
};

/* ===================== DELETE ===================== */

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        for (const imageUrl of deletedProduct.image) {
            const publicId = getPublicIdFromUrl(imageUrl);
            if (publicId) await deleteImageFromCloudinary(publicId);
        }

        // Remove the product from all wishlists
        await Wishlist.updateMany(
            { "items.product": id },
            { $pull: { items: { product: id } } }
        );

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/* ===================== DELETE ALL ===================== */

export const deleteAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        
        for (const product of products) {
            for (const imageUrl of product.image) {
                const publicId = getPublicIdFromUrl(imageUrl);
                if (publicId) await deleteImageFromCloudinary(publicId);
            }
        }

        await Product.deleteMany({});

        // Clear all wishlists
        await Wishlist.updateMany({}, { $set: { items: [] } });

        res.status(200).json({ message: "All products deleted successfully" });
    } catch (error) {
        console.error("Error in deleteAllProducts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
