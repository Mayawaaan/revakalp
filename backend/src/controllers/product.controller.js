import Product from "../models/product.model.js";
import { uploadImageToCloudinary } from "../lib/utils.js";
import fs from "fs";

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
      _id,
      stock,
    } = req.query;

    const filter = {};

    if (_id) filter._id = _id;
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (type) filter.type = type;
    if (bestseller) filter.bestseller = bestseller === "true";
    if (gender) filter.gender = gender;
    if (state) filter.state = state;
    if (print) filter.print = print;
    if (exclusivity) filter.exclusivity = exclusivity;

    if (stock) {
      if (stock === "in") {
        filter.stock = { $gt: 0 };
      } else if (stock === "out") {
        filter.stock = { $lte: 0 };
      }
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      stock,
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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Product images are required" });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const imageUrl = await uploadImageToCloudinary(file);
      imageUrls.push(imageUrl);
      fs.unlinkSync(file.path);
    }

    let parsedSizes;
    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
    } catch (error) {
      return res.status(400).json({
        message: "Invalid sizes format. Expected a JSON array.",
      });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = state
      ? `${state.substring(0, 2).toUpperCase()}${randomNum}`
      : `GEN${randomNum}`;

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
      date,
      bestseller,
      print,
      exclusivity,
      stock: stock || 0,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

