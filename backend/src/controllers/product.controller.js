import Product from "../models/product.model.js";
import { uploadImageToCloudinary } from "../lib/utils.js";
import fs from "fs";
import mongoose from "mongoose";

// export const getAllProducts = async (req, res) => {
//   try {
//     const { category, subCategory, type, bestseller, gender, state, print, exclusivity, id } = req.query;
//     const filter = {};
// //  console.log('=========================================33333========================================',req.query)
//     if (id) filter._id = id;

//     if (category) filter.category = category;
//     if (subCategory) filter.subCategory = subCategory;
//     if (type) filter.type = type;
//     if (bestseller) filter.bestseller = bestseller === 'true';
//     if (gender) filter.gender = gender;
//     if (state) filter.state = state;
//     if (print) filter.print = print;
//     if (exclusivity) filter.exclusivity = exclusivity;
    

//     const products = await Product.find(filter);
//     console.log('=================================================================================',products)
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error: error.message });
//   }
// };


export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      type,
      bestseller,
      gender,
      state,
      print,
      exclusivity,
      id
    } = req.query;

    const filter = {};

    // 🔹 ID filter
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product id" });
      }
      filter._id = new mongoose.Types.ObjectId(id);
    }

    // 🔹 Dynamic filters
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (type) filter.type = type;
    if (bestseller !== undefined) filter.bestseller = bestseller === "true";
    if (gender) filter.gender = gender;
    if (state) filter.state = state;
    if (print) filter.print = print;
    if (exclusivity) filter.exclusivity = exclusivity;

    // 🔹 Fetch products
    const products = await Product.find(filter).lean(); // lean = plain JSON + _id visible
// console.log('=================================================================================',products)
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {

      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const createProduct = async (req, res) => {
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
      date,
      bestseller,
      print,
      exclusivity,
    } = req.body;

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const imageUrl = await uploadImageToCloudinary(file);
      imageUrls.push(imageUrl);
      fs.unlinkSync(file.path); // Delete local file
    }

    let parsedSizes;
    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
    } catch (error) {
      return res.status(400).json({ message: 'Invalid sizes format. Expected a JSON array.' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image: imageUrls,
      category,
      subCategory,
      type,
      gender,
      state,
      sizes: parsedSizes, // Assuming sizes come as a JSON string
      date,
      bestseller,
      print,
      exclusivity,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
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
      date,
      bestseller,
      print,
      exclusivity,
      existingImages // Array of image URLs that are not being changed
    } = req.body;

    let imageUrls = [];
    if (existingImages) {
      try {
        imageUrls = JSON.parse(existingImages);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid existingImages format. Expected a JSON array of strings.' });
      }
    }

    // Upload new files if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadImageToCloudinary(file);
        imageUrls.push(imageUrl);
        fs.unlinkSync(file.path); // Delete local file
      }
    }

    let parsedSizes;
    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid sizes format. Expected a JSON array.' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
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
        date,
        bestseller,
        print,
        exclusivity,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Optional: Get all products (if not already accessible to admin via existing routes)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProductsAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};