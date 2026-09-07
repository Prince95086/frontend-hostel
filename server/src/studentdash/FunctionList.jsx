// File: StudentPanelWithFunctions.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaChartLine,
  FaExclamationTriangle,
  FaTasks,
  FaBars,
  FaUtensils,
  FaCoffee,
  FaRupeeSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaCheckCircle,
  FaSignOutAlt,
  FaIdCard,
  FaEnvelope
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";
import axios from "axios";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function StudentPanelWithFunctions() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Function");
  const [functions, setFunctions] = useState([]);
  const [loadingFunctions, setLoadingFunctions] = useState(true);
  const [showFunctions, setShowFunctions] = useState(true);
  const [error, setError] = useState(null);
  
  // Student info states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentId, setStudentId] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- CHECK IF ALREADY LOGGED IN ---------- */
  useEffect(() => {
    const savedStudent = localStorage.getItem("studentInfo") || sessionStorage.getItem("studentInfo");
    const savedId = localStorage.getItem("studentId") || sessionStorage.getItem("studentId");
    const savedRollNo = localStorage.getItem("studentRollNo") || sessionStorage.getItem("studentRollNo");
    
    console.log("Checking login status:", { savedStudent, savedId, savedRollNo });
    
    if (savedStudent) {
      try {
        const studentData = JSON.parse(savedStudent);
        setStudentInfo(studentData);
        
        // Get student ID from various sources (roll number is the ID)
        const id = savedId || savedRollNo || studentData.rollNo || studentData.rollNumber || studentData._id;
        setStudentId(id);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing student info:", e);
      }
    }
  }, []);

  /* ---------- LOAD FUNCTIONS FROM ADMIN ---------- */
  const fetchFunctions = async () => {
    try {
      console.log("Fetching functions from API...");
      const res = await axios.get(`${API_BASE_URL}/api/functions`);
      console.log("API Response:", res.data);
      
      // Filter only approved functions for students
      const approvedFunctions = res.data.filter(func => 
        func.status === "approved" || func.status === "completed"
      );
      console.log("Filtered functions:", approvedFunctions);
      setFunctions(approvedFunctions);
      setError(null);
    } catch (err) {
      console.error("Error fetching functions", err);
      setError("Failed to load functions from server");
      
      // Fallback to localStorage
      const savedFunctions = localStorage.getItem('hostelFunctions');
      if (savedFunctions) {
        try {
          const parsedFunctions = JSON.parse(savedFunctions);
          const approvedFunctions = parsedFunctions.filter(func => 
            func.status === "approved" || func.status === "completed"
          );
          setFunctions(approvedFunctions);
        } catch (error) {
          console.error('Error loading saved functions:', error);
          setError("No functions available. Please check back later.");
        }
      }
    } finally {
      setLoadingFunctions(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  /* ---------- RESPONSIVE ---------- */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- SIDEBAR MENU ---------- */
 const menuItems = [
      { label: "My Account", icon: <FaUserCircle />, path: "/my-account" },
      { label: "Pay Fee", icon: <FaRupeeSign />, path: "/pay-fee" },
      { label: "Mess Fee", icon: <FaUtensils />, path: "/mess-fee" },
      { label: "Canteen Fee", icon: <FaCoffee />, path: "/canteen-fee" },
      { label: "Reports", icon: <FaChartLine />, path: "/admin/reports" },
      { label: "Function", icon: <FaClipboardList />, path: "/admin/total-complaint" },
      { label: "Pending Complain", icon: <FaExclamationTriangle />, path: "/admin/pending-complaint" },
      { label: "Setting", icon: <FaCog />, path: "/student-setting" },
    ];

  const handleMenuClick = (label, path) => {
    setActiveMenu(label);
    
    // Navigate to the path for all menu items
    if (path && path !== "#") {
      navigate(path);
      if (isMobile) setSidebarOpen(false);
    }
  };

  /* ---------- LOGOUT FUNCTION ---------- */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentInfo(null);
    setStudentId("");
    
    // Clear all storage
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("studentId");
    localStorage.removeItem("token");
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentRollNo");
    localStorage.removeItem("student");
    
    sessionStorage.removeItem("studentInfo");
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("studentPhone");
    sessionStorage.removeItem("studentRollNo");
    
    setDropdownOpen(false);
    navigate("/");
  };

  // Auto-close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('aside');
        const menuButton = document.querySelector('.menu-button');
        
        if (sidebar && !sidebar.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  // Function to refresh data
  const refreshFunctions = () => {
    setLoadingFunctions(true);
    fetchFunctions();
  };

  // Set active menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find(item => item.path === currentPath);
    if (currentMenuItem) {
      setActiveMenu(currentMenuItem.label);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-orange-400 text-white flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-5">
          <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide">
            Student Panel
          </h2>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li
                  key={item.label}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200
                    ${activeMenu === item.label ? 'bg-orange-600' : 'hover:bg-orange-500'}
                  `}
                  onClick={() => handleMenuClick(item.label, item.path)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Student Info in Sidebar if logged in - EXACTLY AS SHOWN IN IMAGE */}
        {isLoggedIn && studentInfo && (
          <div className="p-4 border-t border-orange-500">
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-2xl flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate text-white">
                  {studentInfo.name || "Student"}
                </p>
                <p className="text-sm opacity-90 truncate">
                  ID: {studentId}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ---------- HEADER ---------- */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaBars className="text-xl text-gray-700" />
                </button>
              )}
              
              <img
                src={pulogo}
                alt="University Logo"
                className="w-10 h-10 lg:w-14 lg:h-14 object-contain"
              />
              
              <h1 className="text-xl lg:text-3xl font-bold text-gray-800 tracking-wide">
                Teja Singh Boys Hostel 6
              </h1>
            </div>

            {/* ---------- PROFILE ---------- */}
            <div className="relative">
              <div
                className="flex items-center space-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FaUserCircle className="text-gray-700 w-8 h-8 lg:w-10 lg:h-10 hover:text-orange-600 transition-colors" />
                <IoChevronDown className={`text-gray-600 w-4 h-4 lg:w-5 lg:h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg border border-gray-200 w-56 py-2 z-50">
                  {/* Student Info in Dropdown - EXACTLY AS SHOWN IN IMAGE */}
                  {isLoggedIn && studentInfo && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 truncate">
                        {studentInfo.name || "Student"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        ID: {studentId}
                      </p>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors border-b border-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/my-account");
                    }}
                  >
                    <span className="flex items-center space-x-2">
                      <FaUserCircle />
                      <span>Profile</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors border-b border-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/student-setting");
                    }}
                  >
                    <span className="flex items-center space-x-2">
                      <FaCog />
                      <span>Settings</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100"
                    onClick={handleLogout}
                  >
                    <span className="flex items-center space-x-2">
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ---------- PAGE CONTENT ---------- */}
        <section className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
          {/* FUNCTION VIEWER - ALWAYS SHOWN ON ALL PAGES */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaCalendarAlt className="text-orange-500" />
                  📅 Hostel Functions & Events
                </h2>
                <p className="text-gray-600 mt-1">Upcoming events in your hostel</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={refreshFunctions}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                  disabled={loadingFunctions}
                >
                  {loadingFunctions ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={() => setShowFunctions(!showFunctions)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  {showFunctions ? "Hide" : "Show"} Functions
                </button>
              </div>
            </div>

            {showFunctions && (
              <>
                {error ? (
                  <div className="text-center py-8 bg-red-50 rounded-lg">
                    <FaCalendarAlt className="text-6xl text-red-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Functions</h3>
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : loadingFunctions ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-gray-600 mt-3">Loading events...</p>
                  </div>
                ) : functions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Functions</h3>
                    <p className="text-gray-500">Check back later for hostel events</p>
                  </div>
                ) : (
                  <>
                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Events</p>
                            <p className="text-2xl font-bold text-gray-800">{functions.length}</p>
                          </div>
                          <FaCalendarAlt className="text-2xl text-orange-500" />
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Approved Events</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {functions.filter(f => f.status === "approved").length}
                            </p>
                          </div>
                          <FaCheckCircle className="text-2xl text-green-500" />
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Guests</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {functions.reduce((sum, f) => sum + (parseInt(f.expectedGuests) || 0), 0)}
                            </p>
                          </div>
                          <FaUsers className="text-2xl text-blue-500" />
                        </div>
                      </div>
                    </div>

                    {/* LIST VIEW (FULL WIDTH) */}
                    <div className="space-y-6">
                      {functions.map((func) => (
                        <div
                          key={func._id || func.id}
                          className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between gap-6 border hover:shadow-lg transition-all border-l-4 border-l-orange-400"
                        >
                          {/* Left Section */}
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                              {func.title}
                            </h2>
                            <p className="text-gray-600 mb-4">{func.description}</p>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                              <span className="flex items-center gap-2">
                                <FaCalendarAlt className="text-orange-500" />
                                {new Date(func.date).toLocaleDateString('en-IN')} • {func.time}
                              </span>

                              <span className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-red-500" /> 
                                {func.venue}
                              </span>

                              <span className="flex items-center gap-2">
                                <FaUsers className="text-green-500" /> 
                                {func.expectedGuests} Expected Guests
                              </span>

                              <span className="flex items-center gap-2">
                                <FaPhone className="text-blue-500" /> 
                                {func.organizer} ({func.contact})
                              </span>
                            </div>
                          </div>

                          {/* Right Section */}
                          <div className="flex flex-col justify-between items-start md:items-end gap-4">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                func.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : func.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {func.status.toUpperCase()}
                            </span>

                            {func.budget && (
                              <div className="p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm font-medium text-yellow-800">
                                  💰 Estimated Budget: {func.budget}
                                </p>
                              </div>
                            )}

                            <div className="text-xs text-gray-500 text-right">
                              Posted: {new Date(func.createdAt || new Date()).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Update Notice */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
                        <div>
                          <h4 className="font-medium text-blue-800">Function Updates</h4>
                          <p className="text-sm text-blue-600">
                            These functions are managed by hostel administration. Any changes will be updated here automatically.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* MAIN CONTENT FOR EACH PAGE */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Outlet />
          </div>
        </section>
      </main>

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
}