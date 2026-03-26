import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

export default function DashboardLayout({ children, activeMenu }) {
const { user } = useContext(UserContext);

return (
<div className="min-h-screen bg-white">
<Navbar activeMenu={activeMenu} />
  {!user ? (
    <div className="p-6 text-sm text-gray-600">Loading...</div>
  ) : (
    <div className="flex">
      {/* Side menu hidden below 1080px */}
      <div className="max-[1080px]:hidden">
        <SideMenu activeMenu={activeMenu} />
      </div>

      {/* Main content; grow and scroll if needed */}
      <main className="grow mx-5 my-4">
        {children}
      </main>
    </div>
  )}
</div>
);
}