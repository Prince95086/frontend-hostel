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
  FaSearch,
  FaRupeeSign,
  FaReceipt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaPhone,
  FaIdCard,
  FaSpinner,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";
import axios from "axios";

// UPDATED: Using Render URL as fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://hostel-backend-1-vc4l.onrender.com/api";

// ==================== STUDENT REPORTS COMPONENT ====================
function StudentReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentIdentifier, setStudentIdentifier] = useState("");

  // Auto-fetch reports when component mounts
  useEffect(() => {
    const fetchStudentReports = async () => {
      setLoading(true);
      setError("");
      
      try {
        // Check for saved credentials
        const savedPhone = localStorage.getItem("studentPhone") || sessionStorage.getItem("studentPhone");
        const savedRollNo = localStorage.getItem("studentRollNo") || sessionStorage.getItem("studentRollNo");
        const studentInfo = localStorage.getItem("studentInfo") || sessionStorage.getItem("studentInfo");
        
        console.log("Fetching reports with credentials:", { savedPhone, savedRollNo, studentInfo: !!studentInfo });

        // Determine which identifier to use
        let identifierToUse = null;
        let identifierType = "";
        
        if (savedPhone) {
          identifierToUse = savedPhone;
          identifierType = "phone";
          setStudentIdentifier(`Phone: ${savedPhone}`);
        } else if (savedRollNo) {
          identifierToUse = savedRollNo;
          identifierType = "roll number";
          setStudentIdentifier(`Roll No: ${savedRollNo}`);
        } else if (studentInfo) {
          try {
            const studentData = JSON.parse(studentInfo);
            if (studentData.phone) {
              identifierToUse = studentData.phone;
              identifierType = "phone";
              setStudentIdentifier(`Phone: ${studentData.phone}`);
            } else if (studentData.rollNo) {
              identifierToUse = studentData.rollNo;
              identifierType = "roll number";
              setStudentIdentifier(`Roll No: ${studentData.rollNo}`);
            }
          } catch (e) {
            console.error("Error parsing studentInfo:", e);
          }
        }

        if (!identifierToUse) {
          setError("No login information found. Please log in first.");
          setLoading(false);
          return;
        }

        console.log(`Fetching reports using ${identifierType}:`, identifierToUse);
        
        const res = await axios.get(
          `${API_BASE_URL}/student-reports/login/${identifierToUse}`
        );

        console.log("API Response:", res.data);
        
        // Handle different response formats
        let reportsData = [];
        if (res.data.success && res.data.data) {
          reportsData = res.data.data;
        } else if (Array.isArray(res.data)) {
          reportsData = res.data;
        } else if (res.data.reports) {
          reportsData = res.data.reports;
        } else {
          reportsData = [res.data].filter(item => item && item._id);
        }
        
        setReports(reportsData);
        
        if (reportsData.length === 0) {
          setError("No reports found for your account");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.response?.data?.message || "Could not fetch your reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentReports();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading your reports...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-6xl text-gray-300 mb-4">📋</div>
        <h3 className="text-xl font-bold text-gray-600 mb-2">Unable to Load Reports</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header with Identifier */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Reports
        </h2>
        {studentIdentifier && (
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium">
            {studentIdentifier}
          </div>
        )}
      </div>

      {/* Reports Table */}
      {reports.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700">S.No</th>
                <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                <th className="p-3 text-left font-semibold text-gray-700">Issue Type</th>
                <th className="p-3 text-left font-semibold text-gray-700">Severity</th>
                <th className="p-3 text-left font-semibold text-gray-700">Description</th>
                <th className="p-3 text-left font-semibold text-gray-700">Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report._id || index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{formatDate(report.date || report.createdAt)}</td>
                  <td className="p-3">
                    <span className="font-medium">{report.issueType || report.issue || "General"}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                        report.severity || report.priority
                      )}`}
                    >
                      {report.severity || report.priority || "medium"}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs">
                    <p className="truncate" title={report.description || report.message}>
                      {report.description || report.message || "No description"}
                    </p>
                  </td>
                  <td className="p-3">
                    <span className={report.actionTaken ? "text-green-600" : "text-yellow-600"}>
                      {report.actionTaken || report.resolution || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">High Severity</p>
              <p className="text-2xl font-bold text-red-600">
                {reports.filter(r => (r.severity || r.priority)?.toLowerCase() === 'high').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Medium Severity</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => (r.severity || r.priority)?.toLowerCase() === 'medium').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Low Severity</p>
              <p className="text-2xl font-bold text-green-600">
                {reports.filter(r => (r.severity || r.priority)?.toLowerCase() === 'low').length}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Reports Found</h3>
          <p className="text-gray-500">No reports have been filed against your account.</p>
        </div>
      )}

      {/* Important Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Reports are automatically fetched based on your login credentials. 
          If you believe this is an error, please contact the hostel administration.
        </p>
      </div>
    </div>
  );
}

// ==================== MAIN LAYOUT COMPONENT ====================
export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
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

  /* ---------- CHECK LOGIN STATUS ---------- */
  useEffect(() => {
    const token = localStorage.getItem("studentToken") || sessionStorage.getItem("studentToken");
    const studentData = localStorage.getItem("studentInfo") || sessionStorage.getItem("studentInfo");
    const savedId = localStorage.getItem("studentId") || sessionStorage.getItem("studentId");
    
    if (token && studentData) {
      try {
        const parsedData = JSON.parse(studentData);
        setStudentInfo(parsedData);
        setIsLoggedIn(true);
        
        // Set student ID - prioritize savedId, then rollNo, then other fields
        const id = savedId || 
                  parsedData.rollNo || 
                  parsedData.studentId || 
                  parsedData._id || 
                  parsedData.id ||
                  parsedData.phone ||
                  "N/A";
        setStudentId(id);
        
        console.log("Student logged in:", { 
          name: parsedData.name || "Prince Kumar",
          id: id
        });
      } catch (e) {
        console.error("Error parsing student data:", e);
      }
    } else {
      // For demo purposes - remove in production
      // This sets default values if no login data exists
      setStudentInfo({ name: "Prince Kumar" });
      setStudentId("312");
      setIsLoggedIn(true);
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

  const handleMenuClick = (label, path) => {
    setActiveMenu(label);
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  /* ---------- LOGOUT FUNCTION ---------- */
  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentRollNo");
    localStorage.removeItem("loginMethod");
    localStorage.removeItem("studentId");
    
    sessionStorage.removeItem("studentToken");
    sessionStorage.removeItem("studentInfo");
    sessionStorage.removeItem("studentPhone");
    sessionStorage.removeItem("studentRollNo");
    sessionStorage.removeItem("loginMethod");
    sessionStorage.removeItem("studentId");
    
    setIsLoggedIn(false);
    setStudentInfo(null);
    setDropdownOpen(false);
    navigate("/");
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
          shadow-xl
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
                    ${activeMenu === item.label ? 'bg-orange-600 shadow-lg' : 'hover:bg-orange-500'}
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

        {/* Student Info in Sidebar - Exactly as shown in screenshot */}
        {isLoggedIn && (
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
                <div className="absolute right-0 top-14 bg-white shadow-lg rounded-lg border border-gray-200 w-56 py-1 z-50">
                  {/* Profile Info in Dropdown - Exactly as shown in first screenshot */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">
                      {studentInfo?.name || "Prince Kumar"}
                    </p>
                    <p className="text-sm text-gray-600">
                      ID: {studentId}
                    </p>
                  </div>

                  {/* Menu Items - Exactly as shown in first screenshot */}
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/my-account");
                    }}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/student-setting");
                    }}
                  >
                    Settings
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ---------- PAGE CONTENT ---------- */}
        <section className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
          {/* Check current route and render appropriate content */}
          {location.pathname === "/admin/reports" ? (
            <StudentReports />
          ) : (
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