import React, { useState, useRef, useEffect } from "react";
import { Upload, Edit, Save, X, Shield, Mail, User, Lock } from "lucide-react";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";

const MyProfile = () => {
  const { user } = useStore();
  const { handleUpdateProfile } = useAuth();

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 pb-16 relative z-10">
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
              <div className="p-4 rounded-2xl bg-[#F7F1E5]/70 border border-[#38131E]/10">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold mb-1.5">
                  <User size={14} /> Full Name
                </p>
                <p className="text-sm font-medium text-[#38131E]">{user.fullName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F1E5]/70 border border-[#38131E]/10">
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
