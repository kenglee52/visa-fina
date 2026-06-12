import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DownloadButtons from "../componet/navbar_main/DownloadButtons";
import translations from "../data/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languageOptions = [
  { value: "lao", label: "LA", flag: "/lao.png" },
  { value: "thai", label: "TH", flag: "/thai.png" },
  { value: "english", label: "EN", flag: "/Eng.png" },
  { value: "chinese", label: "中文", flag: "/china.png" },
];

const Main_layout = () => {
  const [language, setLanguage] = useState("lao");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainNavItems = [
    { to: "/about", label: translations[language].about },
    { to: "/news", label: translations[language].news },
    { to: "/contact", label: translations[language].contact },
    { to: "/careers", label: translations[language].careers },
    { to: "/partners", label: translations[language].partners },
  ];

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen font-noto-sans-lao bg-blue-50">
      {/* Top Navigation Bar */}
      <nav role="navigation" className="bg-white text-blue-900 shadow-xl  relative z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex-shrink-0 mr-4">
            <img
              src="/fina-logo-color.png"
              alt="FINA Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Main Navigation Links (Visible on larger screens) */}
          <div className="hidden lg:flex items-center space-x-6">
            {mainNavItems.map((navItem) => (
              <NavLink
                key={navItem.to}
                to={navItem.to}
                end
                role="tab"
                className={({ isActive }) =>
                  `text-base font-  px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-blue-900 hover:text-orange-500 hover:bg-blue-100"
                  }`
                }
                aria-label={navItem.label}
              >
                {navItem.label}
              </NavLink>
            ))}
          </div>

          {/* Right section: Language Dropdown, Download Buttons, and Hamburger Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
            {/* Language Dropdown */}
            <div className="w-20 sm:w-20">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-white text-blue-900 border-none rounded-lg focus:ring-2 focus:ring-orange-500 py-1 px-2 text-xs sm:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg">
                  {languageOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="flex items-center gap-2 text-blue-900 hover:bg-orange-100 focus:bg-orange-100"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={option.flag}
                          alt={option.label}
                          className="w-5 h-auto"
                        />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Download Buttons - Hidden on smaller screens */}
            {/* <div className="hidden sm:block">
              <DownloadButtons />
            </div> */}

            {/* Hamburger Menu Button - Hidden on large screens */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-blue-900 hover:text-orange-500 focus:outline-none z-50"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMenu}
            aria-label="Close menu"
          ></div>
        )}

        {/* Mobile Menu Panel */}
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-64 sm:w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Dedicated Close Button inside the menu */}
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-blue-900 hover:text-orange-500 focus:outline-none z-60 p-2 rounded-full hover:bg-blue-100"
            aria-label="Close mobile menu"
          >
            <X size={28} />
          </button>
          <div className="flex flex-col p-4 pt-16 h-full">
            {/* Mobile Navigation Links */}
            {mainNavItems.map((navItem) => (
              <NavLink
                key={navItem.to}
                to={navItem.to}
                onClick={toggleMenu}
                role="tab"
                className={({ isActive }) =>
                  `text-xl font-bold px-4 py-3 my-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-blue-900 hover:text-orange-500 hover:bg-blue-100"
                  }`
                }
                aria-label={navItem.label}
              >
                {navItem.label}
              </NavLink>
            ))}
            {/* Mobile Download Buttons */}
            <div className="mt-4 mx-auto">
              <DownloadButtons />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Main_layout;