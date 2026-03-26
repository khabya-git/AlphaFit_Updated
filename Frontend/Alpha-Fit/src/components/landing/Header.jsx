import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DumbbellIcon } from "./icons";

const navLinks = [
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-100 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-xs" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-linear-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md group-hover:shadow-lg transition-transform group-hover:scale-105">
            <DumbbellIcon className="w-5 h-5" />
          </div>
          <span className={`text-2xl font-extrabold tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900'} transition-colors`}>AlphaFit</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.title} href={link.href} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
              {link.title}
            </a>
          ))}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition">Log In</Link>
          <Link to="/signup" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Join Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-800 focus:outline-[none] p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 py-6 flex flex-col gap-4 absolute w-full left-0 top-full shadow-xl">
          {navLinks.map(link => (
            <a key={link.title} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-gray-800 py-2 border-b border-gray-100">
              {link.title}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-gray-700 text-center py-3 border border-gray-200 rounded-xl bg-gray-50">Log In</Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white text-center py-3 rounded-xl text-base font-bold shadow-md">Join Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}