import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

export default function Navbar({ activeMenu }) {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="flex items-center gap-4 py-3 px-4 md:px-6">
        {/* Mobile menu button */}
        <button
          className="lg:hidden text-gray-900 p-1"
          onClick={() => setOpenSideMenu((v) => !v)}
          aria-label={openSideMenu ? "Close menu" : "Open menu"}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>
        {/* Brand */}
        <div className="flex items-center gap-2">
          {/* Optional: place a small logo here */}
          {/* <img src="/alphafit-logo.svg" alt="Alpha Fit" className="h-6 w-6" /> */}
          <h1 className="text-lg font-semibold text-gray-900">Alpha Fit</h1>
        </div>
        {/* Spacer */}
        <div className="flex-1" />
        {/* Right-side actions (optional placeholders) */}
        <div className="flex items-center gap-3">
          {/* Notifications, links, etc. */}
          {/* <button className="text-gray-700 hover:text-gray-900">Tips</button> */}
          {/* Profile avatar placeholder */}
          <div className="h-8 w-8 rounded-full bg-indigo-100 ring-1 ring-indigo-200 overflow-hidden">
            {/* <img src={profileImageUrl} alt="Profile" className="h-full w-full object-cover" /> */}
          </div>
        </div>
      </div>

      {/* Mobile side menu */}
      {openSideMenu && (
        <div className="lg:hidden border-t border-gray-200">
          <SideMenu
            activeMenu={activeMenu}
            onNavigate={() => setOpenSideMenu(false)}
          />
        </div>
      )}
    </header>
  );
}
