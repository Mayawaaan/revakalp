import Type from "../../models/type.model.js";
import { uploadImageToCloudinary } from "../../lib/utils.js";
import fs from "fs";

/* =========================
   SLUG NORMALIZER (INLINE)
========================= */
const normalizeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* =========================
   CREATE TYPE
========================= */
export const createType = async (req, res) => {
  try {
    const { name, slug, category } = req.body;

    if (!name || !slug || !category) {
      return res.status(400).json({
        message: "name, slug and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Type image is required",
      });
    }

    const finalSlug = normalizeSlug(slug);

    const exists = await Type.findOne({ slug: finalSlug });
    if (exists) {
      return res.status(409).json({
        message: "Slug already exists",
      });
    }

    const imageUrl = await uploadImageToCloudinary(req.file);
    fs.unlinkSync(req.file.path);

    const newType = await Type.create({
      name,
      slug: finalSlug,
      category,
      image: imageUrl,
    });

    res.status(201).json(newType);
  } catch (error) {
    console.error("Error in createType:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   UPDATE TYPE
========================= */
export const updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, category, existingImage } = req.body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (category) updateFields.category = category;

    if (slug) {
      const finalSlug = normalizeSlug(slug);

      const exists = await Type.findOne({
        slug: finalSlug,
        _id: { $ne: id },
      });

      if (exists) {
        return res.status(409).json({
          message: "Slug already exists",
        });
      }

      updateFields.slug = finalSlug;
    }

    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file);
      fs.unlinkSync(req.file.path);
      updateFields.image = imageUrl;
    } else if (existingImage) {
      updateFields.image = existingImage;
    }

    const updatedType = await Type.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedType) {
      return res.status(404).json({
        message: "Type not found",
      });
    }

    res.status(200).json(updatedType);
  } catch (error) {
    console.error("Error in updateType:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   DELETE TYPE
========================= */
export const deleteType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedType = await Type.findByIdAndDelete(id);

    if (!deletedType) {
      return res.status(404).json({
        message: "Type not found",
      });
    }

    res.status(200).json({
      message: "Type deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteType:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   GET ALL TYPES
========================= */
export const getAllTypes = async (req, res) => {
  try {
    const types = await Type.find().sort({ createdAt: -1 });
    res.status(200).json(types);
  } catch (error) {
    console.error("Error in getAllTypes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
