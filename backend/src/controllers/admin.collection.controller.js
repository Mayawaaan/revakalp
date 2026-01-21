import Collection from "../models/collection.model.js";
import { uploadImageToCloudinary } from "../lib/utils.js";
import fs from "fs";

export const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'name and description are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Collection image is required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file);
    fs.unlinkSync(req.file.path); // Delete local file

    const newCollection = new Collection({
      name,
      description,
      image: imageUrl,
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    console.error("Error in createCollection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, existingImage } = req.body; // existingImage to retain if not uploading new

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    let imageUrl = existingImage; // Default to existing image if not new upload

    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file);
      fs.unlinkSync(req.file.path); // Delete local file
      updateFields.image = imageUrl;
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error("Error in updateCollection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCollection = await Collection.findByIdAndDelete(id);

    if (!deletedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCollection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllCollectionsAdmin = async (req, res) => {
    try {
      const collections = await Collection.find({});
      res.status(200).json(collections);
    } catch (error) {
      console.error("Error in getAllCollectionsAdmin:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
