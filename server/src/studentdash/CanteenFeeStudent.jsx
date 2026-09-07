import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
  FaDownload,
  FaPrint,
  FaFileInvoice,
  FaPhone,
  FaCheck,
  FaTimes,
  FaExclamation,
  FaBell,
  FaHistory,
  FaEnvelope,
  FaSpinner,
  FaIdCard
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

// ==================== MAIN LAYOUT COMPONENT ====================
export default function CanteenFeeStudent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Canteen Fee");
  const [studentInfo, setStudentInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
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

  /* ---------- CHECK IF ALREADY LOGGED IN FROM SIGN-IN PAGE ---------- */
  useEffect(() => {
    // Check both localStorage and sessionStorage
    const storedStudent = localStorage.getItem("studentInfo") || sessionStorage.getItem("studentInfo");
    const storedPhone = localStorage.getItem("studentPhone") || sessionStorage.getItem("studentPhone");
    const storedRollNo = localStorage.getItem("studentRollNo") || sessionStorage.getItem("studentRollNo");
    
    if (storedStudent) {
      try {
        const studentData = JSON.parse(storedStudent);
        setStudentInfo(studentData);
        setIsLoggedIn(true);
        
        // Add phone or roll number if available
        if (!studentData.phone && storedPhone) {
          studentData.phone = storedPhone;
        }
        if (!studentData.rollNo && storedRollNo) {
          studentData.rollNo = storedRollNo;
        }
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

  const handleMenuClick = (label, path) => {
    setActiveMenu(label);
    navigate(path);
    if (isMobile) setSidebarOpen(false);
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

  // Handle logout
  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentRollNo");
    localStorage.removeItem("studentData");
    localStorage.removeItem("token");
    
    sessionStorage.removeItem("studentInfo");
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("studentPhone");
    sessionStorage.removeItem("studentRollNo");
    sessionStorage.removeItem("token");
    
    setStudentInfo(null);
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
  };

  // Render content based on active menu - pass student info and login state
  const renderContent = () => {
    switch (activeMenu) {
      case "Canteen Fee":
        return <CanteenFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      case "My Account":
        return <MyAccountContent studentInfo={studentInfo} />;
      case "Pay Fee":
        return <PayFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      case "Mess Fee":
        return <MessFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      default:
        return <DefaultContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
    }
  };

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

        {/* Student Info in Sidebar if logged in */}
        {isLoggedIn && studentInfo && (
          <div className="p-4 border-t border-orange-500">
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-2xl" />
              <div>
                <p className="font-semibold truncate">{studentInfo.name || "Student"}</p>
                <p className="text-sm opacity-90">ID: {studentInfo.rollNo || studentInfo._id}</p>
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

            {/* ---------- NOTIFICATION & PROFILE ---------- */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-orange-600">
                <FaBell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="relative">
                <div
                  className="flex items-center space-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle className="text-gray-700 w-8 h-8 lg:w-10 lg:h-10 hover:text-orange-600 transition-colors" />
                  <IoChevronDown className={`text-gray-600 w-4 h-4 lg:w-5 lg:h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg border border-gray-200 w-48 py-2 z-50">
                    {isLoggedIn && studentInfo && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800 truncate">{studentInfo.name || "Student"}</p>
                        <p className="text-sm text-gray-500 truncate">ID: {studentInfo.rollNo || studentInfo._id}</p>
                      </div>
                    )}
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors border-b border-gray-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        setActiveMenu("My Account");
                        navigate("/my-account");
                      }}
                    >
                      Profile
                    </button>

                    <button
                      type="button"
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors border-b border-gray-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        setActiveMenu("Setting");
                        navigate("/student-setting");
                      }}
                    >
                      Settings
                    </button>

                    <button
                      type="button"
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ---------- PAGE CONTENT ---------- */}
        <section className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
          {renderContent()}
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

// ==================== CANTEEN FEE CONTENT COMPONENT (UPDATED WITH AUTO-LOAD) ====================
function CanteenFeeContent({ studentInfo, isLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [fees, setFees] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);

  // Auto-load data if student is already logged in from sign-in page
  useEffect(() => {
    const loadStudentData = async () => {
      if (isLoggedIn && studentInfo && !autoLoaded) {
        setLoading(true);
        
        // Get phone number from various sources
        const studentPhone = studentInfo.phone || 
                            studentInfo.phoneNo || 
                            localStorage.getItem("studentPhone") || 
                            sessionStorage.getItem("studentPhone");
        
        if (studentPhone && studentPhone.length >= 10) {
          setPhone(studentPhone);
          await fetchStudentData(studentPhone);
        } else {
          // If no phone, try using roll number
          const studentRollNo = studentInfo.rollNo || 
                               studentInfo.rollNumber || 
                               localStorage.getItem("studentRollNo") || 
                               sessionStorage.getItem("studentRollNo");
          
          if (studentRollNo) {
            await fetchStudentByRollNo(studentRollNo);
          } else {
            // Try using student ID
            const studentId = studentInfo._id;
            if (studentId) {
              await fetchStudentById(studentId);
            }
          }
        }
        setAutoLoaded(true);
      }
    };

    loadStudentData();
  }, [isLoggedIn, studentInfo, autoLoaded]);

  const fetchStudentData = async (phoneNumber) => {
    setError("");
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phoneNumber}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentRes.data._id}/canteen-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load error:", err);
      setError("Could not load canteen fee data automatically. Please search manually.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentByRollNo = async (rollNo) => {
    try {
      // First try to get student by roll number
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/rollno/${rollNo}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentRes.data._id}/canteen-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load by roll no error:", err);
      setError("Could not load canteen fee data automatically. Please search manually.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentById = async (studentId) => {
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}/canteen-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load by ID error:", err);
      setError("Could not load canteen fee data automatically. Please search manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setFees([]);
    setStudent(null);

    if (phone.length < 10) {
      setError("Enter valid phone number");
      return;
    }

    setLoading(true);
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phone}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentRes.data._id}/canteen-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Search error:", err);
      setError("Student not found or no records available");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalRecords = fees.length;
  const totalAmount = fees.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
  const totalPaid = fees.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
  const totalDue = fees.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
  const paidRecords = fees.filter(record => record.status === "Paid").length;
  const pendingRecords = fees.filter(record => record.status === "Pending").length;
  const partialRecords = fees.filter(record => record.status === "Partial").length;

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash":
        return <FaMoneyBillWave className="text-green-600" />;
      case "Online":
        return <FaRupeeSign className="text-blue-600" />;
      case "Cheque":
        return <FaFileInvoice className="text-purple-600" />;
      default:
        return <FaRupeeSign className="text-gray-600" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (fees.length === 0) {
      alert("No data to download");
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Month,Year,Total Amount,Paid Amount,Due Amount,Payment Date,Payment Method,Status,Receipt No,Remarks\n" +
      fees.map(row => 
        `${row.month},${row.year},${row.totalAmount},${row.paidAmount},${row.dueAmount},"${row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : 'N/A'}",${row.paymentMethod},${row.status},${row.receiptNo || 'N/A'},"${row.remarks || ''}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "canteen_fee_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Welcome message for logged in students
  if (isLoggedIn && !student && loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Canteen Fee Records</h1>
          <div className="text-sm text-gray-600">Loading your canteen fee data...</div>
        </div>
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your canteen fee records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Canteen Fee Records</h1>
        <div className="text-sm text-gray-600">
          {isLoggedIn ? "View your canteen fee payment history" : "Student Portal - View and manage canteen fee payments"}
        </div>
      </div>

      {/* Search Phone Number - Only show if no student data loaded yet */}
      {!student && !loading && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {isLoggedIn ? "Search by Phone Number" : "Search Student by Phone Number"}
          </h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter student phone number (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Enter the student's registered phone number to view their canteen fee records
            </p>
          </form>
        </div>
      )}

      {/* Student Info */}
      {student && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-blue-600 text-3xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{student.name || "No Name"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-gray-600 text-sm">Phone Number</p>
                  <p className="font-semibold">{student.phone || student.phoneNo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Room Number</p>
                  <p className="font-semibold">Room {student.roomNo || student.room || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Roll Number</p>
                  <p className="font-semibold">{student.rollNo || student.rollNumber || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
            </div>
          </div>
        </div>
      )}

      {/* Records Section */}
      {fees.length > 0 && (
        <>
          {/* Table Search */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by month, year, or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Showing records for: <span className="font-semibold">{student?.name}</span> • Phone: <span className="font-semibold">{student?.phone || student?.phoneNo || "N/A"}</span>
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-800">{totalRecords}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-orange-600">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaRupeeSign className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Due</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamation className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Monthly Canteen Fee Records</h3>
                  <p className="text-gray-600 mt-1">
                    Payment status and details for {student?.name}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <FaPrint />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <FaDownload />
                    <span>Download Report</span>
                  </button>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800`}>
                    Paid: {paidRecords}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800`}>
                    Partial: {partialRecords}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800`}>
                    Pending: {pendingRecords}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Month/Year</th>
                    <th className="py-3 px-4 text-left">Total Amount</th>
                    <th className="py-3 px-4 text-left">Paid Amount</th>
                    <th className="py-3 px-4 text-left">Due Amount</th>
                    <th className="py-3 px-4 text-left">Payment Date</th>
                    <th className="py-3 px-4 text-left">Payment Method</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Receipt No</th>
                    <th className="py-3 px-4 text-left">Remarks</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees
                    .filter(record => 
                      searchTerm === "" || 
                      record.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      record.year.toString().includes(searchTerm) ||
                      (record.receiptNo && record.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((record) => (
                    <tr key={record._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{record.month} {record.year}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold">₹{record.totalAmount?.toLocaleString() || "0"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-bold ${
                          (record.paidAmount || 0) > 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          ₹{record.paidAmount?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-bold ${
                          (record.dueAmount || 0) > 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          ₹{record.dueAmount?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-600">
                          {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "Not Paid"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getPaymentMethodIcon(record.paymentMethod)}
                          </span>
                          <span>{record.paymentMethod || "Not specified"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-blue-600 font-mono">{record.receiptNo || "N/A"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-600 max-w-xs truncate" title={record.remarks}>
                          {record.remarks || "No remarks"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {record.receiptNo && (
                            <button 
                              onClick={() => {
                                alert(`Receipt Number: ${record.receiptNo}\nMonth: ${record.month} ${record.year}\nAmount: ₹${record.paidAmount}\nDate: ${record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : 'N/A'}`);
                              }}
                              className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200" 
                              title="View Receipt"
                            >
                              <FaReceipt />
                            </button>
                          )}
                          {record.status === "Pending" && (
                            <button 
                              onClick={() => {
                                alert(`Redirecting to payment for ${record.month} ${record.year}...`);
                              }}
                              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" 
                              title="Pay Now"
                            >
                              <FaRupeeSign />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-600">
                  <span className="font-semibold">Summary:</span> {paidRecords} Paid Records • {partialRecords} Partial Records • {pendingRecords} Pending Records
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!fees.length && student && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <FaCoffee className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Fee Records Found</h3>
          <p className="text-gray-600">No canteen fee records found for this student</p>
        </div>
      )}
    </div>
  );
}

// ==================== MESS FEE CONTENT COMPONENT (UPDATED WITH AUTO-LOAD) ====================
function MessFeeContent({ studentInfo, isLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [fees, setFees] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);

  // Auto-load data if student is already logged in from sign-in page
  useEffect(() => {
    const loadStudentData = async () => {
      if (isLoggedIn && studentInfo && !autoLoaded) {
        setLoading(true);
        
        const studentPhone = studentInfo.phone || 
                            studentInfo.phoneNo || 
                            localStorage.getItem("studentPhone") || 
                            sessionStorage.getItem("studentPhone");
        
        if (studentPhone && studentPhone.length >= 10) {
          setPhone(studentPhone);
          await fetchStudentData(studentPhone);
        } else {
          const studentRollNo = studentInfo.rollNo || 
                               studentInfo.rollNumber || 
                               localStorage.getItem("studentRollNo") || 
                               sessionStorage.getItem("studentRollNo");
          
          if (studentRollNo) {
            await fetchStudentByRollNo(studentRollNo);
          } else {
            const studentId = studentInfo._id;
            if (studentId) {
              await fetchStudentById(studentId);
            }
          }
        }
        setAutoLoaded(true);
      }
    };

    loadStudentData();
  }, [isLoggedIn, studentInfo, autoLoaded]);

  const fetchStudentData = async (phoneNumber) => {
    setError("");
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phoneNumber}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentRes.data._id}/mess-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load error:", err);
      setError("Could not load mess fee data automatically. Please search manually.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentByRollNo = async (rollNo) => {
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/rollno/${rollNo}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentRes.data._id}/mess-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load by roll no error:", err);
      setError("Could not load mess fee data automatically. Please search manually.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentById = async (studentId) => {
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}/mess-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load by ID error:", err);
      setError("Could not load mess fee data automatically. Please search manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setFees([]);
    setStudent(null);

    if (phone.length < 10) {
      setError("Enter valid phone number");
      return;
    }

    setLoading(true);
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phone}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentRes.data._id}/mess-fees`
      );
      setFees(feeRes.data);

    } catch (err) {
      console.error("Search error:", err);
      setError("Student not found or no records available");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalRecords = fees.length;
  const totalAmount = fees.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
  const totalPaid = fees.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
  const totalDue = fees.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
  const paidRecords = fees.filter(record => record.status === "Paid").length;
  const pendingRecords = fees.filter(record => record.status === "Pending").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash":
        return <FaMoneyBillWave className="text-green-600" />;
      case "Online":
        return <FaRupeeSign className="text-blue-600" />;
      case "Cheque":
        return <FaFileInvoice className="text-purple-600" />;
      default:
        return <FaRupeeSign className="text-gray-600" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (fees.length === 0) {
      alert("No data to download");
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Month,Year,Total Amount,Paid Amount,Due Amount,Payment Date,Payment Method,Status,Receipt No,Remarks\n" +
      fees.map(row => 
        `${row.month},${row.year},${row.totalAmount},${row.paidAmount},${row.dueAmount},"${row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : 'N/A'}",${row.paymentMethod},${row.status},${row.receiptNo || 'N/A'},"${row.remarks || ''}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mess_fee_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoggedIn && !student && loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Mess Fee Records</h1>
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your mess fee records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Mess Fee Records</h1>

      {!student && !loading && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search Student by Phone Number</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter student phone number (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      )}

      {student && (
        <>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <FaUserCircle className="text-blue-600 text-5xl" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{student.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div><p className="text-gray-600">Phone</p><p className="font-semibold">{student.phone}</p></div>
                  <div><p className="text-gray-600">Room</p><p className="font-semibold">Room {student.roomNo}</p></div>
                  <div><p className="text-gray-600">Roll No</p><p className="font-semibold">{student.rollNo}</p></div>
                </div>
              </div>
            </div>
          </div>

          {fees.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Total Records</p><p className="text-2xl font-bold text-gray-800">{totalRecords}</p></div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><FaCalendarAlt className="text-blue-600 text-xl" /></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Total Amount</p><p className="text-2xl font-bold text-orange-600">₹{totalAmount.toLocaleString()}</p></div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"><FaRupeeSign className="text-orange-600 text-xl" /></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Total Paid</p><p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p></div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><FaCheckCircle className="text-green-600 text-xl" /></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Total Due</p><p className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</p></div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><FaExclamation className="text-red-600 text-xl" /></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Monthly Mess Fee Records</h3>
                      <p className="text-gray-600 mt-1">Payment details for {student.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button onClick={handlePrint} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"><FaPrint /><span>Print</span></button>
                      <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"><FaDownload /><span>Download</span></button>
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Paid: {paidRecords}</span>
                      <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Pending: {pendingRecords}</span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Month/Year</th>
                        <th className="py-3 px-4 text-left">Total</th>
                        <th className="py-3 px-4 text-left">Paid</th>
                        <th className="py-3 px-4 text-left">Due</th>
                        <th className="py-3 px-4 text-left">Payment Date</th>
                        <th className="py-3 px-4 text-left">Method</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((record) => (
                        <tr key={record._id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4">{record.month} {record.year}</td>
                          <td className="py-3 px-4 font-bold">₹{record.totalAmount?.toLocaleString()}</td>
                          <td className="py-3 px-4 text-green-600">₹{record.paidAmount?.toLocaleString()}</td>
                          <td className="py-3 px-4 text-red-600">₹{record.dueAmount?.toLocaleString()}</td>
                          <td className="py-3 px-4">{record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "-"}</td>
                          <td className="py-3 px-4">{record.paymentMethod || "-"}</td>
                          <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>{record.status}</span></td>
                          <td className="py-3 px-4 font-mono text-blue-600">{record.receiptNo || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!fees.length && (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <FaUtensils className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Fee Records Found</h3>
              <p className="text-gray-600">No mess fee records found for this student</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Other content components (updated to accept props)
function MyAccountContent({ studentInfo }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Account</h1>
      <div className="bg-white rounded-xl shadow p-6">
        {studentInfo ? (
          <div className="space-y-4">
            <p><strong>Name:</strong> {studentInfo.name}</p>
            <p><strong>Email:</strong> {studentInfo.email}</p>
            <p><strong>Phone:</strong> {studentInfo.phone || studentInfo.phoneNo}</p>
            <p><strong>Roll Number:</strong> {studentInfo.rollNo || studentInfo.rollNumber}</p>
            <p><strong>Room Number:</strong> {studentInfo.roomNo || studentInfo.room}</p>
          </div>
        ) : (
          <p>Please log in to view your account details.</p>
        )}
      </div>
    </div>
  );
}

function PayFeeContent({ studentInfo, isLoggedIn }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Pay Fee</h1>
      <div className="bg-white rounded-xl shadow p-6">
        {isLoggedIn ? (
          <p>Pay fee functionality coming soon for {studentInfo?.name}...</p>
        ) : (
          <p>Please log in to pay fees.</p>
        )}
      </div>
    </div>
  );
}

function DefaultContent({ studentInfo, isLoggedIn }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome to Student Panel</h1>
      <div className="bg-white rounded-xl shadow p-6">
        {isLoggedIn ? (
          <p>Welcome back, {studentInfo?.name}! Select a menu option from the sidebar to continue.</p>
        ) : (
          <p>Please log in to access your information.</p>
        )}
      </div>
    </div>
  );
}