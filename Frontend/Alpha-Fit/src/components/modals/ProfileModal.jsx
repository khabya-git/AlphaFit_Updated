import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import {
  LuUser, LuMail, LuGraduationCap, LuCalendar,
  LuRuler, LuDumbbell, LuChevronLeft, LuPencil, LuActivity, LuTarget, LuFlame
} from "react-icons/lu";

// onOpenUpdate is the function passed from UserDashboard to open the UpdateModal
const ProfilePage = ({ onBack, onOpenUpdate }) => {
  const { user } = useContext(UserContext);
  const [measurement, setMeasurement] = useState(null);

  useEffect(() => {
    const fetchLatestMeasurement = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/measurements/latest");
        if (response.data) {
          setMeasurement(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch user measurements", err);
      }
    };
    fetchLatestMeasurement();
  }, [user]);

  // Handle defaults correctly between user schema and measurement schema
  const biometrics = [
    { label: "Height", value: measurement?.height ? `${measurement.height} cm` : (user?.height ? `${user.height} cm` : "-- cm"), icon: <LuRuler size={16} /> },
    { label: "Weight", value: measurement?.weight ? `${measurement.weight} kg` : (user?.weight ? `${user.weight} kg` : "-- kg"), icon: <LuDumbbell size={16} /> },
    { label: "Age", value: measurement?.age ? `${measurement.age}` : (user?.age || "23"), icon: <LuCalendar size={16} /> },
  ];

  const fitnessParams = [
    { label: "Gender", value: measurement?.gender ? measurement.gender.replace(/_/g, " ") : (user?.gender ? user.gender : "--"), icon: <LuUser size={16} /> },
    { label: "Activity Level", value: measurement?.activityLevel ? measurement.activityLevel.replace(/_/g, " ") : (user?.activityLevel || "--"), icon: <LuActivity size={16} /> },
    { label: "Goal", value: measurement?.goal ? measurement.goal.replace(/_/g, " ") : (user?.goal || "--"), icon: <LuTarget size={16} /> },
    { label: "Diet", value: measurement?.dietaryPreferences ? measurement.dietaryPreferences.replace(/_/g, " ") : (user?.dietaryPreferences || user?.diet || "--"), icon: <LuFlame size={16} /> },
  ];

  return (
    <div className="bg-gray-50 w-full min-h-full font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header with Navigation and Update Trigger */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent shadow-sm hover:border-blue-100"
          >
            <LuChevronLeft size={18} /> Back to Dashboard
          </button>

          <button
            onClick={onOpenUpdate}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-sm font-bold text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <LuPencil size={16} /> Edit Profile Data
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="w-full lg:w-1/3 flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="relative group mb-6">
              <div className="w-40 h-40 rounded-full border-4 border-gray-50 shadow-inner flex items-center justify-center overflow-hidden bg-gray-100">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-extrabold text-blue-500">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
              {user?.name || "User Name"}
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Active Member
            </p>
          </div>

          {/* RIGHT COLUMN: DATA TERMINAL */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Essential Info */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-2">Essential Info</p>

              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:border-blue-100 transition-colors">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                  <LuMail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-base font-extrabold text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:border-blue-100 transition-colors">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                  <LuGraduationCap size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academic Status</p>
                  <p className="text-base font-extrabold text-gray-900 capitalize">{user?.college || "College Student"}</p>
                </div>
              </div>
            </div>

            {/* Physical Biometrics */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-2">Biometrics</p>
              {biometrics.map((bio, idx) => (
                <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center justify-between hover:border-blue-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50 p-2 rounded-lg text-gray-500">
                      {bio.icon}
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{bio.label}</p>
                  </div>
                  <p className="text-lg font-extrabold text-gray-900">{bio.value}</p>
                </div>
              ))}
            </div>

            {/* Fitness Parameters */}
            <div className="space-y-4 md:col-span-2 mt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-2">Fitness Parameters</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fitnessParams.map((param, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center justify-between hover:border-blue-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        {param.icon}
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{param.label}</p>
                    </div>
                    <p className="text-sm font-extrabold text-gray-900 uppercase">{param.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            AlphaFit • Profile Settings
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePage;