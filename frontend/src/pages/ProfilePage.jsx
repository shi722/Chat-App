import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [about, setAbout] = useState(authUser?.about || "");
  useEffect(() => { setAbout(authUser?.about || ""); }, [authUser]);
  const [aboutEdit, setAboutEdit] = useState(false);
  const defaultAbout = "Hey there! I am using ByteTalk.";
  const [name, setName] = useState(authUser?.fullName || "");
  useEffect(() => { setName(authUser?.fullName || ""); }, [authUser]);
  const [nameEdit, setNameEdit] = useState(false);

  // Close on overlay click (but not on content click)
  useEffect(() => {
    const handleClick = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        navigate(-1);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={contentRef} className="relative bg-base-100 rounded-xl shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {nameEdit ? (
                <div className="flex gap-2 items-center">
                  <input
                    className="input input-bordered flex-1"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={50}
                    disabled={isUpdatingProfile}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={isUpdatingProfile || !name.trim()}
                    onClick={async () => {
                      await updateProfile({ fullName: name });
                      setNameEdit(false);
                    }}
                  >Save</button>
                  <button className="btn btn-sm" onClick={() => { setName(authUser?.fullName || ""); setNameEdit(false); }}>Cancel</button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-1">{authUser?.fullName}</p>
                  <button className="btn btn-sm" onClick={() => setNameEdit(true)}>Edit</button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
            {/* About Section */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                About
              </div>
              {aboutEdit ? (
                <div className="flex gap-2 items-center">
                  <input
                    className="input input-bordered flex-1"
                    value={about ?? defaultAbout}
                    onChange={e => setAbout(e.target.value)}
                    maxLength={120}
                    disabled={isUpdatingProfile}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={isUpdatingProfile}
                    onClick={async () => {
                      await updateProfile({ about });
                      setAboutEdit(false);
                    }}
                  >Save</button>
                  <button className="btn btn-sm" onClick={() => { setAbout(authUser?.about || ""); setAboutEdit(false); }}>Cancel</button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-1">{about?.trim() ? about : defaultAbout}</p>
                  <button className="btn btn-sm" onClick={() => setAboutEdit(true)}>Edit</button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
