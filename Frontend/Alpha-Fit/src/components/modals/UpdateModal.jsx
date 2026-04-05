import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { LuSave, LuX, LuUser, LuRuler, LuDumbbell, LuGraduationCap, LuCalendar, LuActivity, LuFlame, LuTarget, LuPencil } from "react-icons/lu";

const UpdateModal = ({ onClose }) => {
  const { user, updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [measurement, setMeasurement] = useState(null);
  
  // Try to load measurements to seed the form if the user document is empty
  useEffect(() => {
    const fetchLatestMeasurement = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/measurements/latest");
        if (response.data) {
          const data = response.data;
          setMeasurement(data);
          // Only override if we don't already have them in the primary formData
          setFormData(prev => ({
            ...prev,
            activityLevel: prev.activityLevel || data.activityLevel || "SEDENTARY",
            goal: prev.goal || data.goal || "MAINTENANCE",
            dietaryPreferences: prev.dietaryPreferences || data.dietaryPreferences || "ANY",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user measurements", err);
      }
    };
    fetchLatestMeasurement();
  }, []);

  // Initialize state with current user data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    gender: user?.gender || measurement?.gender || "Not Specified",
    age: user?.age || measurement?.age || 23,
    college: user?.college || "College Student",
    height: user?.height || measurement?.height || "",
    weight: user?.weight || measurement?.weight || "",
    activityLevel: user?.activityLevel || measurement?.activityLevel || "SEDENTARY",
    goal: user?.goal || measurement?.goal || "MAINTENANCE",
    dietaryPreferences: user?.dietaryPreferences || user?.diet || measurement?.dietaryPreferences || "ANY",
    profileImageUrl: user?.profileImageUrl || "",
  });

  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || "");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData({ ...formData, profileImageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoint handles merging and persisting profile metrics
      const response = await axiosInstance.put("/auth/update-profile", formData);
      
      if (response.data) {
        updateUser(response.data.user || response.data);
        toast.success("Profile updated successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto w-full min-h-screen">
      <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-2xl relative shadow-2xl animate-in zoom-in-95 duration-200 mt-10 mb-10">
        
        {/* Header Section */}
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Edit Profile</h2>
            <p className="text-xs font-bold text-gray-500 mt-1">Update your personal and fitness details</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
            <LuX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm flex items-center justify-center overflow-hidden relative group bg-gray-100 shrink-0">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-gray-400 text-center uppercase tracking-widest px-2">
                  Upload
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <LuPencil className="text-white" size={20} />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Profile Photo</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Recommended size: 256x256px.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            
            {/* Essential Inputs */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-extrabold text-gray-700 uppercase flex items-center gap-1.5">
                <LuUser size={14} className="text-blue-500" /> Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-extrabold text-gray-700 uppercase flex items-center gap-1.5">
                <LuGraduationCap size={14} className="text-blue-500" /> Academic Status
              </label>
              <input
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            {/* Locked Fields */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-400 uppercase flex items-center gap-1.5">
                <LuCalendar size={14} className="text-gray-400" /> Current Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                disabled
                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm"
                title="Age is updated automatically"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-400 uppercase flex items-center gap-1.5">
                <LuUser size={14} className="text-gray-400" /> Gender
              </label>
              <input
                name="gender"
                value={formData.gender}
                disabled
                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm capitalize"
                title="Gender cannot be changed manually"
              />
            </div>

            {/* Editable Biometrics */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700 uppercase flex items-center gap-1.5">
                <LuRuler size={14} className="text-blue-500" /> Height (cm)
              </label>
              <input
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                placeholder="e.g. 175"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700 uppercase flex items-center gap-1.5">
                <LuDumbbell size={14} className="text-blue-500" /> Weight (kg)
              </label>
              <input
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                placeholder="e.g. 70"
              />
            </div>

            {/* Fitness Parameters Dropdowns */}
            <div className="space-y-1.5 md:col-span-2 mt-4">
              <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-2 mb-4">Fitness Parameters</h3>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-extrabold text-gray-700 uppercase flex items-center gap-1.5">
                <LuActivity size={14} className="text-blue-500" /> Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="SEDENTARY">Sedentary (Little or no exercise)</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active (1-3 days/week)</option>
                <option value="MODERATELY_ACTIVE">Moderately Active (3-5 days/week)</option>
                <option value="VERY_ACTIVE">Very Active (6-7 days/week)</option>
                <option value="EXTRA_ACTIVE">Extra Active (Very hard exercise/physical job)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700 uppercase flex items-center gap-1.5">
                <LuTarget size={14} className="text-blue-500" /> Fitness Goal
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="LOSS">Weight Loss</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="GAIN">Muscle Gain</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-gray-700 uppercase flex items-center gap-1.5">
                <LuFlame size={14} className="text-blue-500" /> Diet Type
              </label>
              <select
                name="dietaryPreferences"
                value={formData.dietaryPreferences}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="ANY">Any / Unrestricted</option>
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="VEGAN">Vegan</option>
                <option value="KETO">Keto</option>
                <option value="PALEO">Paleo</option>
              </select>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-700 p-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LuSave size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;