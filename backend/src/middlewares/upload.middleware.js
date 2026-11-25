import multer from "multer";
import path from "path";

export const MAX_IMAGE_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB per image
export const MAX_IMAGE_FILES = 10;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)
      ? ext
      : ".jpg";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error(
      "Unsupported image format. Upload JPG, PNG, WEBP, or AVIF."
    );
    err.statusCode = 400;
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_IMAGE_FILE_SIZE_BYTES,
    fieldSize: 2 * 1024 * 1024,
    files: MAX_IMAGE_FILES,
  },
});

export default upload;
