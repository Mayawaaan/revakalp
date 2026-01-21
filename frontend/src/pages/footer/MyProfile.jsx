import React, { useState, useRef } from "react";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import { Upload } from "lucide-react";

const MyProfile = () => {
  const { user } = useStore();
  const { handleUpdateProfilePic } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demonstration, we'll use a local URL.
      // In a real app, you'd upload this to a service and get a URL.
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (profilePic) {
      // In a real app, you would upload the file to a service like Cloudinary
      // and get a URL to send to the backend.
      // For this example, we'll just send the base64 string.
      await handleUpdateProfilePic(profilePic);
      setProfilePic(null);
    }
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
      {/* Soft background glow */}
      <div className="absolute -top-40 left-32 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-32 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Account
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            My Profile
          </h1>
          <p className="mt-6 text-pink-700 max-w-xl mx-auto leading-relaxed">
            Manage your personal information and keep your Revakalp experience
            seamless and secure.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-10">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full bg-pink-200 flex items-center justify-center text-3xl font-serif text-pink-900 shadow-inner">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.fullName?.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="font-serif text-2xl text-pink-900 mt-6">
              {user.fullName}
            </h2>
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
          {/* Update Profile Picture */}
          <div className="flex flex-col items-center gap-4 pt-8 border-t border-pink-200">
            <p className="text-sm text-pink-700">
              Update your profile picture
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full hover:bg-pink-200 transition"
            >
              <Upload size={16} />
              Choose Image
            </button>
            {profilePic && (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={profilePic}
                  alt="preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  onClick={handleUpdate}
                  className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-pink-200 pt-8 text-center">
            <p className="text-sm text-pink-700">
              Your information is securely stored and never shared without your
              consent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
