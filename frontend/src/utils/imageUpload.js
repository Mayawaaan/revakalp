export const MAX_IMAGE_SIZE_MB = 15;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_UPLOAD_COUNT = 10;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;

// Compress images larger than 3.5 MB down to keep Cloudinary uploads fast & under free-tier 10 MB cap
const AUTO_OPTIMIZE_THRESHOLD_BYTES = 3.5 * 1024 * 1024;
const CLOUD_SAFE_TARGET_BYTES = 8.5 * 1024 * 1024;
const MAX_DIMENSION_PX = 2400;

function formatSizeMb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function isSupportedImageFile(file) {
  if (!file) return false;
  if (file.type && ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return true;
  }
  return Boolean(file.name && ALLOWED_EXTENSIONS.test(file.name));
}

function loadBitmap(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not decode image"));
    };
    img.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function optimizeLargeImage(file) {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    file.size <= AUTO_OPTIMIZE_THRESHOLD_BYTES
  ) {
    return { file, optimized: false };
  }

  try {
    const img = await loadBitmap(file);
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    if (!width || !height) return { file, optimized: false };

    const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { file, optimized: false };

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const outputMime =
      file.type === "image/png" || file.type === "image/webp" || file.type === "image/avif"
        ? "image/webp"
        : "image/jpeg";
    const outputExt = outputMime === "image/webp" ? ".webp" : ".jpg";

    let blob = await canvasToBlob(canvas, outputMime, 0.9);
    if (blob && blob.size > CLOUD_SAFE_TARGET_BYTES) {
      const fallbackBlob = await canvasToBlob(canvas, outputMime, 0.82);
      if (fallbackBlob && fallbackBlob.size < blob.size) {
        blob = fallbackBlob;
      }
    }

    if (!blob || blob.size >= file.size) {
      return { file, optimized: false };
    }

    const baseName = (file.name || "image").replace(/\.[^.]+$/, "");
    const optimizedFile = new File([blob], `${baseName}${outputExt}`, {
      type: outputMime,
      lastModified: Date.now(),
    });
    return { file: optimizedFile, optimized: true };
  } catch {
    return { file, optimized: false };
  }
}

export async function prepareImageForUpload(file) {
  if (!file) return { file: null, optimized: false };

  if (!isSupportedImageFile(file)) {
    throw new Error(
      `"${file.name}" is not a supported format. Upload JPG, PNG, WEBP, or AVIF.`
    );
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      `"${file.name}" is ${formatSizeMb(file.size)} MB, which exceeds the ${MAX_IMAGE_SIZE_MB} MB upload limit.`
    );
  }

  return optimizeLargeImage(file);
}

export async function prepareImagesForUpload(
  fileList,
  maxFiles = MAX_UPLOAD_COUNT
) {
  const incoming = Array.from(fileList || []).filter(Boolean);
  if (incoming.length === 0) {
    return { files: [], optimizedCount: 0 };
  }

  if (incoming.length > maxFiles) {
    throw new Error(
      `Too many images selected (${incoming.length}). Maximum allowed is ${maxFiles} images per upload.`
    );
  }

  const results = await Promise.all(
    incoming.map((file) => prepareImageForUpload(file))
  );

  return {
    files: results.map((r) => r.file).filter(Boolean),
    optimizedCount: results.filter((r) => r.optimized).length,
  };
}
