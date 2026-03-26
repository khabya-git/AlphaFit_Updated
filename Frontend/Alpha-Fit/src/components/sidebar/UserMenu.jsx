import React from "react";
import { LuUser, LuTrash2 } from "react-icons/lu";

// We remove the local modal state and imports because the Dashboard handles the pages now
const UserMenu = ({ onOpenProfile, onOpenUpdate, onOpenDelete, onClose }) => {
  return (
    <div className="absolute left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-100 shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* 1. PROFILE: Triggers Dashboard setActivePage("profile") */}
      <button
        onClick={() => {
          onOpenProfile(); // Crucial: Calls Dashboard's handleShowProfile
          onClose();       // Closes the sidebar dropdown
        }}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b border-gray-100"
      >
        <LuUser className="text-blue-500" size={16} /> View Profile
      </button>

      {/* 2. DELETE: Triggers Dashboard setShowDeleteModal(true) */}
      <button
        onClick={() => {
          onOpenDelete();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
      >
        <LuTrash2 size={16} /> Delete Account
      </button>
    </div>
  );
};

export default UserMenu;