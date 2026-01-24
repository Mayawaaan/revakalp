import Product from "../../models/product.model.js";
import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    getPublicIdFromUrl,
} from "../../lib/utils.js";
import fs from "fs/promises";
import mongoose from "mongoose";

/* ===================== HELPERS ===================== */

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
            category,
            subCategory,
            type,
            gender,
            state,
            sizes,
            stock,
            bestseller,
            print,
            exclusivity,
        } = req.body;

        const parsedSizes = normalizeSizes(sizes);

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !subCategory ||
            !type ||
            !gender ||
            !state ||
            !parsedSizes?.length ||
            !stock
        ) {
            return res.status(400).json({ message: "All fields are required" });
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

        const newProduct = new Product({
            code,
            name,
            description,
            price,
            image: imageUrls,
            category,
            subCategory,
            type,
            gender,
            state,
            sizes: parsedSizes,
            stock,
            date: Date.now(),
            bestseller,
            print,
            exclusivity,
        });

        await newProduct.save();
        res.status(201).json(newProduct);

    } catch (error) {
        for (const imageUrl of imageUrls) {
            const publicId = getPublicIdFromUrl(imageUrl);
            if (publicId) await deleteImageFromCloudinary(publicId);
        }
        console.error("Error in createProduct:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/* ===================== READ ===================== */

export const getAllProductsAdmin = async (req, res) => {
    try {
        const { id } = req.query;
        const filter = {};

        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid product id" });
            }
            filter._id = new mongoose.Types.ObjectId(id);
        }

        const products = await Product.find(filter).lean();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getAllProductsAdmin:", error);
        res.status(500).json({ message: "Internal Server Error" });
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
            category,
            subCategory,
            type,
            gender,
            state,
            sizes,
            stock,
            bestseller,
            print,
            exclusivity,
            existingImages,
        } = req.body;

        const parsedSizes = normalizeSizes(sizes);

        const updateFields = {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price }),
            ...(category !== undefined && { category }),
            ...(subCategory !== undefined && { subCategory }),
            ...(type !== undefined && { type }),
            ...(gender !== undefined && { gender }),
            ...(state !== undefined && { state }),
            ...(parsedSizes !== undefined && { sizes: parsedSizes }),
            ...(stock !== undefined && { stock }),
            ...(bestseller !== undefined && { bestseller }),
            ...(print !== undefined && { print }),
            ...(exclusivity !== undefined && { exclusivity }),
        };
        // console.log("Update Fields:", updateFields);
        
        let finalImageUrls = existingImages
            ? Array.isArray(existingImages)
                ? existingImages
                : [existingImages]
                : [];
                console.log("Final Image URLs before upload:", finalImageUrls);
        const imagesToDelete = productToUpdate.image.filter(
            (url) => !finalImageUrls.includes(url)
        );
        // console.log("Images to delete:", imagesToDelete);

        for (const imageUrl of imagesToDelete) {
            const publicId = getPublicIdFromUrl(imageUrl);
            if (publicId) await deleteImageFromCloudinary(publicId);
        }
        // console.log("Final Image URLs after upload:", finalImageUrls);


        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const newImageUrl = await uploadImageToCloudinary(file);
                finalImageUrls.push(newImageUrl);
                await fs.unlink(file.path);
            }
        }
        console.log("Final Image URLs after adding new uploads:", finalImageUrls);
        if (finalImageUrls.length > 0) {
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
        console.error("Error in updateProduct:", error);
        res.status(500).json({ message: "Internal Server Error" });
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

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
