import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { Image, Upload, Copy, Check, Loader2 } from "lucide-react";
import useStore from "../../store/store";

const ImageManagement = () => {
  const { showToast } = useStore();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) { showToast("Please select an image first", "error"); return; }
    setLoading(true); setImageUrl(""); setCopied(false);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        formData
      );
      setImageUrl(res.data.secure_url);
      showToast("Image uploaded successfully", "success");
    } catch { showToast("Image upload failed", "error"); }
    finally { setLoading(false); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">Assets</p>
        <h1 className="text-3xl font-serif text-pink-900">Image Management</h1>
        <p className="text-pink-600 text-sm mt-1">Upload images to Cloudinary and reuse them across products and pages</p>
      </div>

      {/* Upload Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl p-6 max-w-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100">
          <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center">
            <Image size={17} className="text-[#c9487c]" />
          </div>
          <h2 className="font-serif text-lg text-pink-900">Upload Image</h2>
        </div>

        <div className="space-y-5">
          {/* Drop zone / file input */}
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-pink-200 rounded-2xl cursor-pointer hover:border-[#c9487c] hover:bg-pink-50/50 transition-all duration-200">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-auto rounded-xl object-contain p-2" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-pink-400">
                <Upload size={24} />
                <p className="text-sm">Click to select an image</p>
                <p className="text-xs text-pink-300">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-6 py-2.5 text-sm rounded-full shadow-lg shadow-pink-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><Upload size={15} /> Upload Image</>}
          </button>
        </div>
      </div>

      {/* Result */}
      {imageUrl && (
        <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl p-6 max-w-3xl shadow-sm space-y-5">
          <h3 className="font-serif text-lg text-pink-900">Uploaded Image</h3>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="border border-pink-100 rounded-xl p-2 bg-pink-50/50">
              <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded-xl" />
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-pink-500 font-semibold">Image URL</p>
              <div className="flex items-center gap-2">
                <input
                  value={imageUrl} readOnly
                  className="w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm text-pink-800 bg-pink-50/80 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-pink-200 rounded-xl hover:bg-pink-50 transition text-pink-500"
                >
                  {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                </button>
              </div>
              <p className="text-xs text-pink-400">Use this URL in product images, banners, or content sections.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManagement;
