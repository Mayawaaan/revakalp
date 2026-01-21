import React, { useState } from "react";
import axios from "axios";
import { Image, Upload, Copy, Check } from "lucide-react";
import useStore from "../../store/store";

const ImageManagement = () => {
  const { showToast } = useStore();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      showToast("Please select an image first", "error");
      return;
    }

    setLoading(true);
    setImageUrl("");
    setCopied(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // replace
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // replace
        formData
      );
      setImageUrl(res.data.secure_url);
      showToast("Image uploaded successfully", "success");
    } catch (error) {
      showToast("Image upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Image Management
        </h1>
        <p className="text-gray-500 mt-1">
          Upload images to Cloudinary and reuse them across products and pages
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white border rounded-xl p-6 max-w-2xl">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Image size={20} className="text-gray-700" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">
            Upload Image
          </h2>
        </div>

        {/* File Input */}
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border
              file:text-sm file:bg-white
              file:text-gray-700 hover:file:bg-gray-50"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            <Upload size={16} />
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {/* Result */}
      {imageUrl && (
        <div className="bg-white border rounded-xl p-6 max-w-3xl space-y-6">

          <h3 className="text-lg font-medium text-gray-900">
            Uploaded Image
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">

            {/* Preview */}
            <div className="border rounded-lg p-2">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-auto rounded-md"
              />
            </div>

            {/* URL */}
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Image URL
              </p>

              <div className="flex items-center gap-2">
                <input
                  value={imageUrl}
                  readOnly
                  className="w-full border rounded-md px-3 py-2 text-sm text-gray-700 bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="border rounded-md px-3 py-2 hover:bg-gray-50"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Use this URL in product images, banners, or content sections.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ImageManagement;
