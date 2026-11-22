import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  Edit,
  Save,
  X,
  Shield,
  Mail,
  User,
  Lock,
  Download,
  Trash2,
} from "lucide-react";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import axios from "../../utils/axiosInstance";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";

const MyProfile = () => {
  const { user, logout, showToast } = useStore();
  const { handleUpdateProfile } = useAuth();
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) setFullName(user.fullName || "");
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePic(file);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await handleUpdateProfile({ fullName, profilePic });
      setProfilePic(null);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.fullName || "");
    setProfilePic(null);
    setIsEditing(false);
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const { data } = await axios.get("/api/auth/my-data");
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "revakalp-my-data.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast?.("Your personal data export has been downloaded", "success");
    } catch (error) {
      showToast?.(
        error?.response?.data?.message || "Unable to export personal data",
        "error"
      );
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      showToast?.("Please enter your password to confirm deletion", "error");
      return;
    }
    setDeleting(true);
    try {
      await axios.delete("/api/auth/delete-account", {
        data: { password: deletePassword },
      });
      logout();
      showToast?.("Your account and personal data have been deleted", "success");
      navigate("/");
    } catch (error) {
      showToast?.(
        error?.response?.data?.message || "Failed to delete account",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[75vh] bg-[#F7F1E5] flex items-center justify-center px-4 py-12">
        <div className="rk-surface-card p-10 text-center max-w-md w-full space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#38131E]/10 flex items-center justify-center mx-auto text-[#38131E]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl text-[#38131E]">Sign In Required</h1>
          <p className="text-sm text-[#1A1718]/70">
            Please sign in to view and manage your profile.
          </p>
          <EditorialButton to="/login">Go to Sign In</EditorialButton>
        </div>
      </div>
    );
  }

  const avatarSrc = profilePic
    ? URL.createObjectURL(profilePic)
    : user.profilePic || null;

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <PageHero
        label="Account"
        title="My Profile"
        subtitle="Manage your personal information and account preferences."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 pb-16 relative z-10 space-y-8">
        <div className="rk-surface-card overflow-hidden">
          <div className="bg-[#38131E]/5 px-6 sm:px-10 py-10 flex flex-col items-center gap-4 border-b border-[#38131E]/10">
            <button
              type="button"
              disabled={!isEditing}
              onClick={() => isEditing && fileInputRef.current?.click()}
              aria-label={isEditing ? "Upload new profile picture" : "Profile picture"}
              className={`relative w-24 h-24 rounded-full overflow-hidden border-4 border-white ring-2 ring-[#D4AF63]/60 ${
                isEditing ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#38131E] text-[#F1D889] flex items-center justify-center font-serif text-3xl">
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              {isEditing && (
                <span className="absolute inset-0 bg-[#1A1718]/50 flex items-center justify-center text-white">
                  <Upload size={20} />
                </span>
              )}
            </button>

            <div className="text-center">
              {isEditing ? (
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-label="Full Name"
                  className="font-serif text-2xl text-[#38131E] bg-white border-b-2 border-[#38131E] px-3 py-1 text-center focus:outline-none rounded-t-lg"
                />
              ) : (
                <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
                  {user.fullName}
                </h2>
              )}
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold mt-1">
                Revakalp Member
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[2px] bg-[#EFE6D5]/65 border border-[#38131E]/12">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold mb-1.5">
                  <User size={14} /> Full Name
                </p>
                <p className="text-sm font-medium text-[#38131E]">{user.fullName}</p>
              </div>
              <div className="p-4 rounded-[2px] bg-[#EFE6D5]/65 border border-[#38131E]/12">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold mb-1.5">
                  <Mail size={14} /> Email Address
                </p>
                <p className="text-sm font-medium text-[#38131E] break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {isEditing ? (
                <>
                  <EditorialButton
                    variant="primary"
                    disabled={saving}
                    onClick={handleUpdate}
                  >
                    <Save size={15} /> {saving ? "Saving…" : "Save Changes"}
                  </EditorialButton>
                  <EditorialButton variant="secondary" onClick={handleCancel}>
                    <X size={15} /> Cancel
                  </EditorialButton>
                </>
              ) : (
                <EditorialButton variant="secondary" onClick={() => setIsEditing(true)}>
                  <Edit size={15} /> Edit Profile
                </EditorialButton>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#1A1718]/65">
              <Shield size={14} className="text-[#38131E]" />
              <span>Your information is securely stored and used solely for order fulfillment.</span>
            </div>
          </div>
        </div>

        {/* DPDPA 2023 Data Principal Controls */}
        <div className="rk-surface-card p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/65 font-semibold">
              Your Privacy Controls
            </p>
            <h2 className="font-serif text-2xl text-[#38131E]">
              Privacy &amp; Data Rights (DPDPA 2023)
            </h2>
            <p className="text-sm text-[#1A1718]/75 leading-relaxed">
              Download a copy of the personal data held in your account, or permanently erase
              your account and saved items. Order totals needed for Indian GST tax records
              are retained with personal contact details redacted.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <EditorialButton
              variant="secondary"
              disabled={exporting}
              onClick={handleExportData}
            >
              <Download size={15} />
              <span>{exporting ? "Preparing…" : "Download My Data"}</span>
            </EditorialButton>

            <button
              type="button"
              onClick={() => setDeleteOpen((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-[2px] border border-red-700/35 text-red-800 hover:bg-red-50 text-xs uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Delete Account</span>
            </button>
          </div>

          {deleteOpen && (
            <form
              onSubmit={handleDeleteAccount}
              className="p-5 rounded-[2px] bg-[#FBF7EE] border border-red-700/30 space-y-4"
            >
              <p className="text-xs text-[#1A1718]/80 leading-relaxed">
                This permanently deletes your profile, wishlist, bag, and reviews. Enter
                your current password to confirm.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter current password"
                  aria-label="Confirm password to delete account"
                  required
                  className="flex-1 min-h-[42px] px-3.5 py-2 rounded-[2px] border border-[#38131E]/25 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-1 focus:ring-[#D4AF63]"
                />
                <button
                  type="submit"
                  disabled={deleting}
                  className="min-h-[42px] px-5 py-2 rounded-[2px] bg-red-800 text-white hover:bg-red-900 text-xs uppercase tracking-[0.16em] font-semibold transition-colors cursor-pointer"
                >
                  {deleting ? "Deleting…" : "Confirm Deletion"}
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-[#38131E]/10 flex flex-wrap gap-5 text-xs text-[#38131E]">
            <Link to="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            <Link to="/grievance-redressal" className="underline">
              Grievance Redressal Officer
            </Link>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default MyProfile;
