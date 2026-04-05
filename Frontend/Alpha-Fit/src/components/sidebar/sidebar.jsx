import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LuTrendingUp,
  LuCamera,
  LuFlame,
  LuGamepad2,
  LuDumbbell,
  LuListTodo,
  LuLogOut,
} from "react-icons/lu";
import UserMenu from "./UserMenu";
import { UserContext } from "../../context/userContext";

const Sidebar = ({
  user,
  activePage,
  onPageChange,
  onOpenProfile,
  onOpenUpdate,
  onOpenDelete,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { cleanUser } = useContext(UserContext);

  const menuItems = [
    { id: "dashboard", label: "DASHBOARD", icon: LuTrendingUp },
    { id: "pose-detection", label: "VISION TRACKING", icon: LuCamera },
    { id: "nutrition", label: "FUEL ANALYSIS", icon: LuFlame },
    { id: "challenges", label: "ELITE CHALLENGES", icon: LuGamepad2 },
    { id: "workouts", label: "COMBAT ROUTINES", icon: LuDumbbell },
    { id: "workouts-analytics", label: "STRENGTH INTEL", icon: LuTrendingUp },
    { id: "progress", label: "NEURAL PROGRESS", icon: LuListTodo },
  ];

  // Logic to safely extract name and initials
  const displayName = user?.name || "CADET UNKNOWN";
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "C";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleLogout = () => {
    cleanUser();
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col p-6 relative overflow-hidden font-sans z-50">
      
      {/* Header Profile Section */}
      <div className="relative mb-12" ref={menuRef}>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="flex items-center gap-4 w-full p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all group shadow-sm text-left"
        >
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-blue-100 border border-blue-200 text-blue-600 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-black italic">
                  {initials}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
          </div>

          <div className="overflow-hidden">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest truncate italic">
              {displayName}
            </h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">
              UNIT STATUS: ACTIVE
            </p>
          </div>
        </button>

        {showMenu && (
          <div className="absolute left-0 w-full mt-2 z-50">
            <UserMenu
              user={user}
              onClose={() => setShowMenu(false)}
              onOpenProfile={() => { setShowMenu(false); onOpenProfile(); }}
              onOpenUpdate={() => { setShowMenu(false); onOpenUpdate(); }}
              onOpenDelete={() => { setShowMenu(false); onOpenDelete(); }}
            />
          </div>
        )}
      </div>

      {/* Navigation Modules */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide pb-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">Main Console</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all relative group ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-gray-500 hover:text-gray-900 border border-transparent hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"}`} />
              <span className={`text-xs font-bold tracking-wider transition-all ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                {item.label}
              </span>
              {isActive && (
                 <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / System Exit */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent transition-all group"
        >
          <LuLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold tracking-wider uppercase">Terminate Link</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;