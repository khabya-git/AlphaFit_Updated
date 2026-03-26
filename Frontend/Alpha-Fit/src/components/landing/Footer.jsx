import { DumbbellIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6 text-gray-800">
          <DumbbellIcon className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold">
            AlphaFit
          </span>
        </div>

        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} AlphaFit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}