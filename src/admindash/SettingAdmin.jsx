import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaTachometerAlt,
  FaUsers,
  FaUtensils,
  FaCoffee,
  FaClipboardList,
  FaChartLine,
  FaExclamationTriangle,
  FaTasks,
  FaCog,
  FaBars,
  FaUserCircle,
  FaKey,
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
  FaUserShield,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import pulogo from "../assets/puimages/pulogo.jpeg";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- Change Password States ---------- */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Password validation criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

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

  // Detect current page
  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin/settings") {
      setCurrentPage("Settings");
    } else if (path === "/admin-dashbord") {
      setCurrentPage("Dashboard");
    } else if (path === "/admin-student") {
      setCurrentPage("Students");
    } else if (path === "/messfee-record") {
      setCurrentPage("Student Mess Fee");
    } else if (path === "/admin/canteen-fee") {
      setCurrentPage("Student Canteen Fee");
    } else if (path === "/admin/attendance") {
      setCurrentPage("Attendance of Worker");
    } else if (path === "/admin/total-attendance") {
      setCurrentPage("Total Attendance");
    } else if (path === "/admin/report-student") {
      setCurrentPage("Report Student");
    } else if (path === "/admin/function") {
      setCurrentPage("Function");
    }
  }, [location.pathname]);

  /* ---------- SIDEBAR MENU ---------- */
  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin-dashbord" },
    { label: "Students", icon: <FaUsers />, path: "/admin-student" },
    { label: "Student Mess Fee", icon: <FaUtensils />, path: "/messfee-record" },
    { label: "Student Canteen Fee", icon: <FaCoffee />, path: "/admin/canteen-fee" },
    { label: "Attendance of Worker", icon: <FaClipboardList />, path: "/admin/attendance" },
    { label: "Total Attendance", icon: <FaChartLine />, path: "/admin/total-attendance" },
    { label: "Report Student", icon: <FaExclamationTriangle />, path: "/admin/report-student" },
    { label: "Function", icon: <FaTasks />, path: "/admin/function" },
    { label: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  // Toastify notification functions
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showInfoToast = (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showWarningToast = (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      showErrorToast("All fields are required");
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError("New password does not meet all requirements");
      showErrorToast("New password does not meet all requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      showErrorToast("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      showErrorToast("New password must be different from current password");
      return;
    }

    setIsChangingPassword(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        setPasswordError("Authentication failed. Please login again.");
        showErrorToast("Authentication failed. Please login again.");
        return;
      }

      // Make API call to change password
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/change-password`,
        { currentPassword, newPassword },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );

      if (response.data.success) {
        setPasswordSuccess("Password changed successfully!");
        showSuccessToast("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordCriteria({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          specialChar: false,
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setPasswordSuccess("");
        }, 3000);
      } else {
        setPasswordError(response.data.message || "Failed to change password");
        showErrorToast(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || "Failed to change password. Please try again.";
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setPasswordError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }

    setIsLoggingOut(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem("adminToken");
      
      // Optional: Call logout API to invalidate token on server
      if (token) {
        try {
          await axios.post(
            `${API_BASE_URL}/api/admin/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } catch (apiError) {
          console.log("Logout API call failed, continuing with client-side logout");
        }
      }
      
      // Clear admin token/session from client
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      sessionStorage.clear();
      
      showInfoToast("Logged out successfully");
      
      // Redirect to login page
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      showErrorToast("Logout failed. Please try again.");
      // Still logout even if API call fails
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordCriteria({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
    });
    showInfoToast("Form reset successfully");
  };

  const handleProfileLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }
    
    localStorage.removeItem("adminToken");
    showInfoToast("Logged out successfully");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  // Render Settings page content
  const renderSettingsPage = () => {
    return (
      <div className="p-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account security and preferences</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <FaUserShield />
            <span className="font-medium">Administrator Account</span>
          </div>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdPassword className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                <p className="text-gray-600 text-sm">Update your account password securely</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-2 ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.length ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span className="text-sm">8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.uppercase ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span className="text-sm">Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.lowercase ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span className="text-sm">Lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.number ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span className="text-sm">Number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordCriteria.specialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.specialChar ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span className="text-sm">Special character</span>
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <FaExclamationTriangle />
                    {passwordError}
                  </p>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm flex items-center gap-2">
                    <FaCheckCircle />
                    {passwordSuccess}
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <FaTimes />
                  <span>Reset</span>
                </button>
              </div>
            </form>
          </div>

          {/* Logout Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaSignOutAlt className="text-red-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Logout</h2>
                <p className="text-gray-600 text-sm">Sign out from your admin account</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">Security Notice</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Logging out will end your current session. Make sure to save any unsaved work before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Current Session</p>
                    <p className="text-sm text-gray-600">Active since {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Last Login</p>
                    <p className="text-sm text-gray-600">
                      {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString()}
                    </p>
                  </div>
                  <FaLock className="text-gray-400" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium mt-6"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <FaSignOutAlt />
                    <span>Logout from Admin Panel</span>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm">
                You'll be redirected to the login page
              </p>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-green-600 text-xl" />
            <h3 className="text-lg font-bold text-gray-800">Security Tips</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Use a strong, unique password for your admin account</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Never share your password with anyone</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Log out when using shared or public computers</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Regularly update your password every 90 days</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Enable two-factor authentication if available</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Render other pages (using Outlet for routing)
  const renderPageContent = () => {
    if (currentPage === "Settings") {
      return renderSettingsPage();
    }
    // For other pages, use Outlet (they will have their own components)
    return <Outlet />;
  };

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
        theme="light"
      />
      
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30
        w-60 bg-green-600 text-white
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-3">
          <h2 className="text-3xl font-extrabold text-center mb-6 tracking-wide">
            Admin Panel
          </h2>

          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3
              px-3 py-3 mb-1
              text-lg font-semibold
              rounded-lg
              hover:bg-green-700
              transition-all text-left
              ${currentPage === item.label ? 'bg-green-800' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col">
        {/* ---------- HEADER ---------- */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <FaBars className="text-2xl text-gray-700" />
              </button>
            )}

            <img src={pulogo} alt="PU Logo" className="w-12 h-12" />

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Teja Singh Boys Hostel 6
            </h1>
          </div>

          {/* ---------- PROFILE ---------- */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <FaUserCircle size={34} />
              <IoChevronDown
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white shadow rounded w-44 z-50">
                <button 
                  onClick={() => {
                    navigate("/admin/profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-2"
                >
                  <FaUserCircle className="text-gray-600" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => {
                    navigate("/admin/settings");
                    setDropdownOpen(false);
                    showInfoToast("Navigating to Settings");
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-2"
                >
                  <FaCog className="text-gray-600" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    handleProfileLogout();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-green-50 flex items-center gap-2 text-red-600"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ---------- PAGE CONTENT ---------- */}
        <section className="flex-1 p-6 overflow-auto">
          {renderPageContent()}
        </section>
      </main>
    </div>
  );
}