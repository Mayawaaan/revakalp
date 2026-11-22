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
        <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">Assets</p>
        <h1 className="text-3xl font-serif text-[#38131E]">Image Management</h1>
        <p className="text-[#5C4E52] text-sm mt-1">Upload images to Cloudinary and reuse them across products and pages</p>
      </div>

      {/* Upload Card */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl p-6 max-w-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#38131E]/12">
          <div className="w-9 h-9 bg-[#38131E]/8 rounded-xl flex items-center justify-center border border-[#D4AF63]/35">
            <Image size={17} className="text-[#38131E]" />
          </div>
          <h2 className="font-serif text-lg text-[#38131E]">Upload Image</h2>
        </div>

        <div className="space-y-5">
          {/* Drop zone / file input */}
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#38131E]/25 rounded-2xl cursor-pointer hover:border-[#D4AF63] hover:bg-[#F7F1E5]/60 transition-all duration-200">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-auto rounded-xl object-contain p-2" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#5C4E52]">
                <Upload size={24} className="text-[#38131E]" />
                <p className="text-sm">Click to select an image</p>
                <p className="text-xs text-[#7A6A6E]">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="inline-flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-6 py-2.5 text-sm rounded-full shadow-sm border border-[#D4AF63]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><Upload size={15} /> Upload Image</>}
          </button>
        </div>
      </div>

      {/* Result */}
      {imageUrl && (
        <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl p-6 max-w-3xl shadow-sm space-y-5">
          <h3 className="font-serif text-lg text-[#38131E]">Uploaded Image</h3>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="border border-[#38131E]/15 rounded-xl p-2 bg-[#F7F1E5]/60">
              <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded-xl" />
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">Image URL</p>
              <div className="flex items-center gap-2">
                <input
                  value={imageUrl} readOnly
                  className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A1718] bg-[#F7F1E5]/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-[#38131E]/20 rounded-xl hover:bg-[#F7F1E5] transition text-[#38131E]"
                >
                  {copied ? <Check size={15} className="text-emerald-700" /> : <Copy size={15} />}
                </button>
              </div>
              <p className="text-xs text-[#7A6A6E]">Use this URL in product images, banners, or content sections.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManagement;
