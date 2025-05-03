import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = ({ mobileOpen = false, onClose = () => {} }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When scrolled, the navbar height shrinks (e.g., 80vh), otherwise it fills the viewport.
  const navbarHeightClass = isScrolled ? "min-h-[80vh]" : "min-h-screen";

  // build the logout class once, so we can swap `mt-auto` */
  const logoutBtnClass = [
    isScrolled ? "mt-auto" : "mt-48",
    "font-bold text-red-500 mx-auto px-6 py-2 mb-10 rounded-md border",
    "hover:bg-red-500 hover:text-white transition",
  ].join(" ");

  // fires only on screens < 768 px
  const handleNavClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  /* ── responsive wrapper ───────────────────────────── */
  const wrapperCls = [
    "z-40", // stays above content
    "fixed md:static inset-0 left-0", // overlay on mobile, normal on desktop
    "flex flex-col",
    "w-full md:w-[15%]", // full-width on phones, 15 % on ≥ md
    "overflow-y-auto",
    navbarHeightClass,
    "transform transition-transform duration-300",
    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
  ].join(" ");

  return (
    <div
      className={wrapperCls}
      style={{ backgroundColor: "rgba(197,197,198,1)" }}
    >
      {/* close (“×”) button shown only on phones */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 rounded hover:bg-gray-300"
      >
        ✕
      </button>

      <Link to="/" onClick={handleNavClick}>
        {/* ───── GEOnex Logo ───── */}
        <div className="w-full flex justify-center pt-6 sm:pt-8 md:pt-10 items-end space-x-1 whitespace-nowrap">
          <span className="font-bold text-[48px] md:text-3xl lg:text-5xl leading-none text-black">
            GEO
          </span>
          <span className="font-semibold text-[32px] md:text-xl lg:text-3xl leading-none text-black">
            nex
          </span>
        </div>
      </Link>

      {/* Navigation Frame */}
      <nav className="flex flex-col gap-3 md:gap-4 pt-4 md:pt-20 text-base md:text-base lg:text-lg mt-12 w-full">
        {[
          { to: '/',   icon: assets.home,    label: 'Home'    },
          { to: '/devices', icon: assets.devices, label: 'Devices' },
          { to: '/projects', icon: assets.projects, label: 'Projects' },
          { to: '/settings', icon: assets.settings, label: 'Settings' },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block w-full flex items-center justify-center md:justify-start gap-3 px-4 lg:px-10 py-2 rounded transition ${
                isActive
                  ? 'bg-white shadow-md font-semibold'
                  : 'hover:bg-gray-300'
              }`
            }
          >
            <img src={icon} alt={label} className="w-5 h-5" />
            <p className="truncate">{label}</p>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}

      <button className={logoutBtnClass}>Log out</button>
    </div>
  );
};

export default Navbar;
