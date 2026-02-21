import mongoose from "mongoose";
import Collection from "../../models/collection.model.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  getPublicIdFromUrl
} from "../../lib/utils.js";
import fs from "fs/promises";

/* =========================
   CREATE COLLECTION
========================= */
// export const createCollection = async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     if (!name || !description) {
//       return res.status(400).json({
//         message: "name and description are required"
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         message: "Collection image is required"
//       });
//     }

//     const alreadyExists = await Collection.findOne({ name });
//     if (alreadyExists) {
//       return res.status(409).json({
//         message: "Collection already exists"
//       });
//     }

//     const imageUrl = await uploadImageToCloudinary(req.file);
//     await fs.unlink(req.file.path);

//     const collection = await Collection.create({
//       name,
//       description,
//       image: imageUrl
//     });

//     res.status(201).json(collection);
//   } catch (error) {
//     console.error("Error in createCollection:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const createCollection = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    if (!id || !name || !description) {
      return res.status(400).json({
        message: "id, name and description are required"
      });
    }

    const exists = await Collection.findOne({ id });
    if (exists) {
      return res.status(409).json({
        message: "Collection with this id already exists"
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file);
    await fs.unlink(req.file.path);

    const collection = await Collection.create({
      id,
      name,
      description,
      image: imageUrl
    });

    res.status(201).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
/* =========================
   UPDATE COLLECTION
========================= */
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid collection ID"
      });
    }

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({
        message: "Collection not found"
      });
    }

    if (name) collection.name = name;
    if (description) collection.description = description;

    if (req.file) {
      const newImageUrl = await uploadImageToCloudinary(req.file);
      await fs.unlink(req.file.path);

      if (collection.image) {
        const publicId = getPublicIdFromUrl(collection.image);
        await deleteImageFromCloudinary(publicId);
      }

      collection.image = newImageUrl;
    }

    const updatedCollection = await collection.save();
    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error("Error in updateCollection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   DELETE COLLECTION
========================= */
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid collection ID"
      });
    }

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({
        message: "Collection not found"
      });
    }

    if (collection.image) {
      const publicId = getPublicIdFromUrl(collection.image);
      await deleteImageFromCloudinary(publicId);
    }

    await collection.deleteOne();
    res.status(200).json({
      message: "Collection deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteCollection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   GET ALL COLLECTIONS (ADMIN)
========================= */
export const getAllCollectionsAdmin = async (req, res) => {
  try {
    const collections = await Collection.find()
      .sort({ createdAt: -1 });

    res.status(200).json(collections);
  } catch (error) {
    console.error("Error in getAllCollectionsAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
