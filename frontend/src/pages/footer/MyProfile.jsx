import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import { Upload, Edit, Save, X } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
};

const MyProfile = () => {
  const { user } = useStore();
  const { handleUpdateProfile } = useAuth();

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) setFullName(user.fullName);
  }, [user]);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setProfilePic(file); // ✅ File object
};

  const handleUpdate = async () => {
    await handleUpdateProfile({ fullName, profilePic });
    setProfilePic(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setProfilePic(null);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] flex items-center justify-center px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 text-center max-w-md">
          <h1 className="font-serif text-3xl text-pink-900 mb-4">
            My Profile
          </h1>
          <p className="text-pink-700">
            You are not logged in. Please sign in to view your profile.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-40 left-32 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-40 right-32 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30" />

      <motion.div
        className="relative max-w-4xl mx-auto px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={fadeUp}>
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Account
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            My Profile
          </h1>
          <p className="mt-6 text-pink-700 max-w-xl mx-auto">
            Manage your personal information securely and effortlessly.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-12"
          variants={fadeUp}
        >
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div
              className={`relative w-28 h-28 rounded-full overflow-hidden shadow-inner ${
                isEditing ? "cursor-pointer group" : ""
              }`}
              onClick={() => isEditing && fileInputRef.current.click()}
            >
              {profilePic || user.profilePic ? (
                <img
                  src={profilePic || user.profilePic}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-pink-200 flex items-center justify-center text-3xl font-serif text-pink-900">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Upload className="text-white" size={22} />
                </div>
              )}
            </div>

            <div className="mt-6">
              {isEditing ? (
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="font-serif text-2xl text-pink-900 bg-transparent border-b-2 border-pink-300 focus:outline-none focus:border-pink-500 text-center"
                />
              ) : (
                <h2 className="font-serif text-2xl text-pink-900">
                  {user.fullName}
                </h2>
              )}
            </div>

            <p className="text-pink-700 text-sm mt-1">Revakalp Member</p>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-pink-800">
            <div>
              <p className="text-xs uppercase tracking-wider text-pink-600 mb-1">
                Full Name
              </p>
              <p className="font-medium">{user.fullName}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-pink-600 mb-1">
                Email Address
              </p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8 border-t border-pink-200 flex justify-center gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-pink-100 text-pink-800 px-6 py-2 rounded-full hover:bg-pink-200 transition"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Note */}
          <div className="text-center pt-4">
            <p className="text-sm text-pink-700">
              Your information is securely stored and never shared without your
              consent.
            </p>
          </div>
        </motion.div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </motion.div>
    </section>
  );
};

export default MyProfile;
