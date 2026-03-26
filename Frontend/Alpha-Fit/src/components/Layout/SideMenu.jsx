import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";

export default function SideMenu({ activeMenu }) {
  const { user, clearUser, logout } = useContext(UserContext) || {};
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  const role = useMemo(() => user?.role || "user", [user]);

  useEffect(() => {
    setMenu(role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    return () => {};
  }, [role]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      if (typeof logout === "function") logout();
      else if (typeof clearUser === "function") clearUser();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200/50 sticky top-[61px] z-20 h-[calc(100vh-61px)]">
      {/* Profile header */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5 px-4">
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover bg-slate-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-300" />
          )}
        </div>
        {role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3 text-center line-clamp-1">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500 line-clamp-1">
          {user?.email || ""}
        </p>
      </div>

      {/* Menu */}
      <nav className="px-2">
        {(menu || []).map((item, index) => {
          const isActive = activeMenu === item.label;
          return (
            <button
              key={`menu_${index}`}
              type="button"
              className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-2 rounded-md transition-colors ${
                isActive
                  ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-primary"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon className="text-xl" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
