import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = () => {
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

  return (
    <div
      className={`w-full md:w-[15%]  ${navbarHeightClass} flex flex-col justify-between transition-all duration-300`}
      style={{ backgroundColor: 'rgba(197, 197, 198, 1)' }}
    >
      <Link to="/">
        {/* GEOnex Logo */}
        <div className="pt-10 pl-10">
          <span className="text-3xl font-semi-bold text-black">GEO</span>
          <span className="text-xl font-semi-bold text-black">nex</span>
        </div>
      </Link>
      

      {/* Navigation Frame */}
      <div className="flex flex-col gap-3 md:gap-4 pt-4 md:pt-20 text-[13px] md:text-[15px]">
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-10 py-2 rounded transition ${
              isActive ? "bg-white shadow-md font-semibold" : "hover:bg-gray-300"
            }`
          }
          to="/"
        >
          <img className='w-5 h-5' src={assets.home} alt="Home" />
          <p className='block'>Home</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-10 py-2 rounded transition ${
              isActive ? "bg-white shadow-md font-semibold" : "hover:bg-gray-300"
            }`
          }
          to="/devices"
        >
          <img className='w-5 h-5' src={assets.devices} alt="Devices" />
          <p className='block'>Devices</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-10 py-2 rounded transition ${
              isActive ? "bg-white shadow-md font-semibold" : "hover:bg-gray-300"
            }`
          }
          to="/projects"
        >
          <img className='w-5 h-5' src={assets.projects} alt="Projects" />
          <p className='block'>Projects</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 px-10 py-2 rounded transition ${
              isActive ? "bg-white shadow-md font-semibold" : "hover:bg-gray-300"
            }`
          }
          to="/settings"
        >
          <img className='w-5 h-5' src={assets.settings} alt="Settings" />
          <p className='block'>Settings</p>
        </NavLink>
      </div>

      {/* Logout Button */}
      <button className="text-red-500 px-4 py-2 mb-2 mx-auto rounded-md hover:bg-red-500 hover:text-white transition">
        Log out
      </button>
      
    </div>
  );
};

export default Navbar;
