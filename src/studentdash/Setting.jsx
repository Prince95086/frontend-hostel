import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaClipboardList,
  FaCog,
  FaChartLine,
  FaExclamationTriangle,
  FaBars,
  FaUtensils,
  FaCoffee,
  FaRupeeSign,
  FaSignOutAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaUndo,
  FaKey,
  FaIdCard
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function Setting() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Setting");
  const [loading, setLoading] = useState(false);
  
  // Student info states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentId, setStudentId] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

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

  /* ---------- CHECK IF ALREADY LOGGED IN ---------- */
  useEffect(() => {
    const savedStudent = localStorage.getItem("studentInfo") || sessionStorage.getItem("studentInfo");
    const savedId = localStorage.getItem("studentId") || sessionStorage.getItem("studentId");
    const savedRollNo = localStorage.getItem("studentRollNo") || sessionStorage.getItem("studentRollNo");
    
    if (savedStudent) {
      try {
        const studentData = JSON.parse(savedStudent);
        setStudentInfo(studentData);
        
        // Get student ID from various sources
        const id = savedId || savedRollNo || studentData.rollNo || studentData.rollNumber || studentData._id;
        setStudentId(id);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing student info:", e);
      }
    }
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

  // Password state for Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Update active menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveMenu(currentItem.label);
    }
  }, [location.pathname]);

  const handleMenuClick = (label, path) => {
    setActiveMenu(label);
    
    // Navigate to the path for all menu items
    if (path && path !== "#") {
      navigate(path);
      if (isMobile) setSidebarOpen(false);
    }
  };

  // Handle password change
  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  // Show loading toast
  const showLoadingToast = (message) => {
    return toast.loading(message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Show success toast
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Show error toast
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Handle password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("Passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showErrorToast("Password must be at least 6 characters long!");
      return;
    }

    const loadingToastId = showLoadingToast("Changing password...");
    
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/stuchangepass/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      const result = await response.json();
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show success toast
      showSuccessToast(result.message || "Password changed successfully!");

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show error toast
      showErrorToast(error.message || "Error changing password!");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout from Settings page
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    const loadingToastId = showLoadingToast("Logging out...");

    try {
      // Simulate API call or delay for logout process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear all storage
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("studentInfo");
      localStorage.removeItem("studentId");
      localStorage.removeItem("studentPhone");
      localStorage.removeItem("studentRollNo");
      localStorage.removeItem("studentData");
      localStorage.removeItem("student");
      localStorage.removeItem("activeMenu");
      
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("studentInfo");
      sessionStorage.removeItem("studentId");
      sessionStorage.removeItem("studentPhone");
      sessionStorage.removeItem("studentRollNo");

      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show success toast
      showSuccessToast("Logged out successfully!");

      // Navigate to home after showing toast
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show error toast
      showErrorToast("Error during logout!");
    }
  };

  // Reset password form
  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    showSuccessToast("Password form reset!");
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

  // Check if current route is settings
  const isSettingsPage = location.pathname === "/student-setting";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

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
                      <p className="text-sm text-gray-500 truncate flex items-center">
                        <FaIdCard className="mr-1 text-xs" />
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
          {isSettingsPage ? (
            // Settings Page Content (when Setting is clicked in sidebar)
            <div className="max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <FaCog className="text-orange-500" />
                  Settings
                </h1>
                <p className="text-gray-600 mt-2">Manage your account settings</p>
              </div>

              {/* Change Password Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaKey className="text-orange-500" />
                    Change Password
                  </h2>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetPasswordForm}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FaUndo />
                      Reset
                    </button>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter new password (min. 6 characters)"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Password must be at least 6 characters long
                      </p>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {passwordData.newPassword && passwordData.confirmPassword && 
                       passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-sm text-red-600 mt-2">
                          Passwords do not match
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSave />
                        {loading ? "Changing Password..." : "Change Password"}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Password Requirements */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Password Requirements</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Minimum 6 characters in length</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number (recommended)</li>
                    <li>• Include special characters (recommended)</li>
                    <li>• Do not use common passwords</li>
                  </ul>
                </div>
              </div>

              {/* Logout Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaSignOutAlt className="text-red-500 text-3xl" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Logout</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    You will be logged out from all devices and redirected to the login page.
                    Make sure you have saved all your work before logging out.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaSignOutAlt />
                      Logout Now
                    </button>
                  </div>

                  {/* Warning Box */}
                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• You will lose access to all student portal features</li>
                      <li>• Any unsaved changes will be lost</li>
                      <li>• You will need to login again to access your account</li>
                      <li>• Session will be terminated on all devices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // All other pages content
            <Outlet />
          )}
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