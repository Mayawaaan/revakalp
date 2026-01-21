import Type from "../models/type.model.js";
import { uploadImageToCloudinary } from "../lib/utils.js";
import fs from "fs";

export const createType = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'name and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Type image is required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file);
    fs.unlinkSync(req.file.path); // Delete local file

    const newType = new Type({
      name,
      image: imageUrl,
      category,
    });

    await newType.save();
    res.status(201).json(newType);
  } catch (error) {
    console.error("Error in createType:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, existingImage } = req.body; // existingImage to retain if not uploading new

    const updateFields = {};
    if (name) updateFields.name = name;
    if (category) updateFields.category = category;

    let imageUrl = existingImage; // Default to existing image if not new upload

    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file);
      fs.unlinkSync(req.file.path); // Delete local file
      updateFields.image = imageUrl;
    }

    const updatedType = await Type.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedType) {
      return res.status(404).json({ message: "Type not found" });
    }

    res.status(200).json(updatedType);
  } catch (error) {
    console.error("Error in updateType:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedType = await Type.findByIdAndDelete(id);

    if (!deletedType) {
      return res.status(404).json({ message: "Type not found" });
    }

    res.status(200).json({ message: "Type deleted successfully" });
  } catch (error) {
    console.error("Error in deleteType:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllTypes = async (req, res) => {
    try {
      const types = await Type.find({});
      res.status(200).json(types);
    } catch (error) {
      console.error("Error in getAllTypes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
