import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import pulogo from '../assets/puimages/pulogo.jpeg';

const Abovenavbar = () => {
  return (
    <nav className="bg-[#1CA29C] text-white py-2 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        
        {/* Left Section: Logo + Text */}
        <div className="flex items-center space-x-3">
          <img
            src={pulogo} // <-- replace with your logo image path
            alt="Panjab University Logo"
            className="w-12 h-12 rounded-full bg-white p-1"
          />
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Panjab University Hostel
            </h1>
            <p className="text-sm">
              Sector 14 Chandigarh • Established in 1947
            </p>
          </div>
        </div>

        {/* Right Section: Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            <FaFacebook size={28} className="text-white" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            <FaInstagram size={28} className="text-white" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            <FaYoutube size={28} className="text-white" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Abovenavbar;   