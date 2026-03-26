import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "../../utils/axiosInstance";

import { LuMenu } from "react-icons/lu";

// Layout & Navigation
import Sidebar from "../../components/sidebar/sidebar";

// Mission-Critical Widgets
import MotivationBanner from "../../components/dashboard/MotivationBanner";
import StreakCard from "../../components/dashboard/StreakCard";
import WaterCard from "../../components/dashboard/WaterCard";
import NutritionCard from "../../components/dashboard/NutritionCard";
import WorkoutCard from "../../components/dashboard/WorkoutCard";

// Sub-Modules
import NutritionPage from "../user/NutritionPage";
import ProfilePage from "../../components/modals/ProfileModal";
import PoseDetectionPage from "../user/PoseDetectionPage";
import NewWorkoutPage from "../user/WorkoutPage";
import ProgressPage from "../user/ProgressPage";
import GamifiedPage from "../user/GamifiedPage";

// System Modals
import UpdateModal from "../../components/modals/UpdateModal";
import DeleteModal from "../../components/modals/DeleteModal";
import WorkoutDashboard from "./WorkoutDash";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [workoutData, setWorkoutData] = useState(null);

  useEffect(() => {
    if (activePage === "dashboard") {
      const fetchDashboard = async () => {
        try {
          const res = await axios.get("/dashboard");
          setDashboardData(res.data.data);
        } catch (error) {
          console.error("Dashboard Load Error:", error);
        }
      };

      fetchDashboard();
    }
  }, [activePage]);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await axios.get("/workout/summary");
        setWorkoutData(res.data.data);
      } catch (error) {
        console.error("Workout Summary Load Error:", error);
      }
    };

    if (activePage === "workouts-analytics") {
      fetchWorkout();
    }
  }, [activePage]);

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };
  const handleShowProfile = () => {
    setActivePage("profile");
    setIsSidebarOpen(false);
  };
  const handleBackToDashboard = () => setActivePage("dashboard");

  // Reset today's nutrition log and refetch dashboard
  const handleNutritionReset = async () => {
    try {
      await axios.delete("/dashboard/nutrition/today");
      // Optimistically clear UI then re-fetch
      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              nutrition: {
                ...prev.nutrition,
                todayCalories: 0,
                todayProtein: 0,
                todayCarbs: 0,
                todayFat: 0,
              },
            }
          : prev
      );
      // Full refetch to sync with server
      const res = await axios.get("/dashboard");
      setDashboardData(res.data.data);
    } catch (error) {
      console.error("Nutrition reset failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-600 font-semibold animate-pulse tracking-wide">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const renderPageContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* 01. MOTIVATION DIRECTIVE */}
            <MotivationBanner />

            {/* 02. PRIMARY DIAGNOSTIC GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
              <div className="flex flex-col h-full">
                <StreakCard todayWorkoutPercent={user?.todayProgress || 0} />
              </div>
              <div className="flex flex-col h-full">
                <NutritionCard nutrition={dashboardData?.nutrition} onReset={handleNutritionReset} />
              </div>
            </div>

            {/* 03. SECONDARY STATS */}
            <div className="grid grid-cols-1 gap-6">
              <WaterCard />
            </div>

            {/* 04. MISSION BRIEFING */}
            <WorkoutCard onNavigate={handlePageChange} />
          </div>
        );

      case "profile":
        return (
          <ProfilePage
            user={user}
            onBack={handleBackToDashboard}
            onOpenUpdate={() => setShowUpdateModal(true)}
          />
        );

      case "pose-detection":
        return <PoseDetectionPage />;

      case "nutrition":
        return <NutritionPage />;

      case "challenges":
        return <GamifiedPage />;

      case "workouts-analytics":
        return <WorkoutDashboard workout={workoutData} />;

      case "workouts":
        return <NewWorkoutPage />;

      case "progress":
        return <ProgressPage />;

      default:
        return (
          <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-center rounded-xl bg-white shadow-xs">
            <h2 className="text-xl font-bold text-gray-800">
              Page Not Found
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              The requested module could not be loaded.
            </p>
          </div>
        );
    }
  };

  const pageTitles = {
    "dashboard": "Overview",
    "profile": "My Profile",
    "pose-detection": "AI Trainer",
    "nutrition": "Nutrition",
    "challenges": "Challenges",
    "workouts-analytics": "Workout Analytics",
    "workouts": "New Workout",
    "progress": "Progress & Trends"
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-50 shrink-0 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
        <Sidebar
          user={user}
          activePage={activePage}
          onPageChange={handlePageChange}
          onOpenProfile={handleShowProfile}
          onOpenUpdate={() => setShowUpdateModal(true)}
          onOpenDelete={() => setShowDeleteModal(true)}
        />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide bg-gray-50 w-full">
        <div className="p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto min-h-full flex flex-col">
          
          {/* MOBILE HEADER (Visible only on small screens) */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">AlphaFit</h1>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <LuMenu size={24} />
            </button>
          </div>

          {/* SIMPLIFIED CLEAN HEADER */}
          <div className="flex justify-between items-end mb-8 lg:mb-10 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                {pageTitles[activePage] || "Dashboard"}
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-2">
                Welcome back, {user?.name || "User"}! Let's hit your goals today.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Current Time
              </p>
              <p className="text-sm font-bold text-gray-700 mt-1">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex-1">{renderPageContent()}</div>

          {/* FOOTER */}
          <footer className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center text-gray-400 text-xs font-medium">
            <span>
              AlphaFit v1.0.4
            </span>
            <span>
              Secure connection established
            </span>
          </footer>
        </div>
      </main>

      {/* MODALS */}
      {showUpdateModal && (
        <UpdateModal user={user} onClose={() => setShowUpdateModal(false)} />
      )}
      {showDeleteModal && (
        <DeleteModal user={user} onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}
