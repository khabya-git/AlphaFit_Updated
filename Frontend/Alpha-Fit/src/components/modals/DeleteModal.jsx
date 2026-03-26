import React from "react";
import { LuTrash } from "react-icons/lu";

const DeleteModal = ({ onClose, navigate }) => {
  const handleDelete = () => {
    localStorage.clear();
    alert("Account deleted successfully!");
    navigate("/signup");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-sm border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <LuTrash size={32} className="text-red-500" />
        </div>

        <h2 className="text-xl font-extrabold mb-3 text-gray-900 tracking-tight">Delete Account?</h2>
        <p className="text-sm font-semibold text-gray-500 mb-8 leading-relaxed">
          Are you sure you want to permanently delete your account? This action cannot be undone and you will lose all tracking history.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-sm"
          >
            Yes, delete account
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
