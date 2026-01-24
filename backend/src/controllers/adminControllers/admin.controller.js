import Admin from "../../models/admin.model.js";
import { uploadImageToCloudinary } from "../../lib/utils.js";
import fs from "fs";

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Admin image is required" });
    }

    const imageUrl = await uploadImageToCloudinary(req.file);
    fs.unlinkSync(req.file.path); // Delete local file

    const newAdmin = new Admin({
      name,
      email,
      password,
      image: imageUrl,
    });

    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error in createAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, existingImage } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = password;

    let imageUrl = existingImage;

    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file);
      fs.unlinkSync(req.file.path); // Delete local file
    }

    updateFields.image = imageUrl;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error in updateAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllAdmins = async (req, res) => {
    try {
      const admins = await Admin.find({});
      res.status(200).json(admins);
    } catch (error) {
      console.error("Error in getAllAdmins:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  