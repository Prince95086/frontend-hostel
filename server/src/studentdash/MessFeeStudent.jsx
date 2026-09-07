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
  FaCreditCard,
  FaWallet,
  FaUniversity,
  FaQrcode,
  FaLock,
  FaArrowLeft,
  FaIdCard
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

// ==================== MAIN LAYOUT COMPONENT ====================
export default function MessFeeStudent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Mess Fee");
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
    
    if (storedStudent) {
      try {
        const studentData = JSON.parse(storedStudent);
        setStudentInfo(studentData);
        setIsLoggedIn(true);
        
        // If phone is not in studentInfo but we have storedPhone, add it
        if (!studentData.phone && storedPhone) {
          studentData.phone = storedPhone;
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
     { label: "Function", icon: <FaClipboardList />, path: "/functions" },
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

  // Set active menu based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/pay-fee") setActiveMenu("Pay Fee");
    else if (path === "/mess-fee") setActiveMenu("Mess Fee");
    else if (path === "/canteen-fee") setActiveMenu("Canteen Fee");
    else if (path === "/my-account") setActiveMenu("My Account");
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentData");
    localStorage.removeItem("token");
    localStorage.removeItem("reportStudentId");
    localStorage.removeItem("reportStudentData");
    
    sessionStorage.removeItem("studentInfo");
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("studentPhone");
    sessionStorage.removeItem("token");
    
    setStudentInfo(null);
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
  };

  // Render content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case "Mess Fee":
        return <MessFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      case "My Account":
        return <MyAccountContent studentInfo={studentInfo} />;
      case "Pay Fee":
        return <PayFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      case "Canteen Fee":
        return <CanteenFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
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

// ==================== MESS FEE CONTENT COMPONENT (UPDATED WITH SEARCH) ====================
function MessFeeContent({ studentInfo, isLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Auto-load data if student is already logged in from sign-in page
  useEffect(() => {
    const loadStudentData = async () => {
      if (isLoggedIn && studentInfo && !autoLoaded) {
        setLoading(true);
        
        // Get phone number from studentInfo
        const studentPhone = studentInfo.phone || 
                            studentInfo.phoneNo || 
                            localStorage.getItem("studentPhone") || 
                            sessionStorage.getItem("studentPhone");
        
        if (studentPhone) {
          setPhone(studentPhone);
          await fetchStudentData(studentPhone);
        } else {
          // If no phone, try using roll number or ID
          const studentId = studentInfo.rollNo || studentInfo._id;
          if (studentId) {
            await fetchStudentById(studentId);
          }
        }
        setAutoLoaded(true);
      }
    };

    loadStudentData();
  }, [isLoggedIn, studentInfo, autoLoaded]);

  // Filter fees based on search term
  useEffect(() => {
    if (fees.length > 0) {
      const filtered = fees.filter(record => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        return (
          record.month?.toLowerCase().includes(term) ||
          record.year?.toString().includes(term) ||
          record.receiptNo?.toLowerCase().includes(term)
        );
      });
      setFilteredFees(filtered);
    } else {
      setFilteredFees(fees);
    }
  }, [fees, searchTerm]);

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
      setFilteredFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load error:", err);
      setError("Could not load fee data automatically. Please search manually.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentById = async (studentId) => {
    try {
      // Try to get student by ID
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}`
      );
      setStudent(studentRes.data);

      const feeRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}/mess-fees`
      );
      setFees(feeRes.data);
      setFilteredFees(feeRes.data);

    } catch (err) {
      console.error("Auto-load by ID error:", err);
      setError("Could not load fee data automatically. Please search manually.");
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
      setFilteredFees(feeRes.data);

    } catch (err) {
      console.error("Search error:", err);
      setError("Student not found or no records available");
    } finally {
      setLoading(false);
    }
  };

  const handleTableSearch = (e) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
  };

  const totalRecords = filteredFees.length;
  const totalAmount = filteredFees.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
  const totalPaid = filteredFees.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
  const totalDue = filteredFees.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
  const paidRecords = filteredFees.filter(record => record.status === "Paid").length;
  const pendingRecords = filteredFees.filter(record => record.status === "Pending").length;
  const partialRecords = filteredFees.filter(record => record.status === "Partial").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Partial": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (filteredFees.length === 0) {
      alert("No data to download");
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Month,Year,Total Amount,Paid Amount,Due Amount,Payment Date,Payment Method,Status,Receipt No,Remarks\n" +
      filteredFees.map(row => 
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

  // Show welcome message for logged in students
  if (isLoggedIn && !student && loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Mess Fee Records</h1>
          <div className="text-sm text-gray-600">Loading your mess fee data...</div>
        </div>
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your mess fee records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Mess Fee Records</h1>
        <div className="text-sm text-gray-600">
          {isLoggedIn ? "View your mess fee payment history" : "View and manage mess fee payments"}
        </div>
      </div>

      {!student && (
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
                  placeholder="Enter student phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? <><FaSpinner className="animate-spin" /><span>Searching...</span></> : <><FaSearch /><span>Search</span></>}
              </button>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600">{error}</p></div>}
          </form>
        </div>
      )}

      {student && (
        <>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <FaUserCircle className="text-blue-600 text-5xl" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div><p className="text-gray-600 text-sm">Phone</p><p className="font-semibold">{student.phone}</p></div>
                  <div><p className="text-gray-600 text-sm">Room</p><p className="font-semibold">Room {student.roomNo}</p></div>
                  <div><p className="text-gray-600 text-sm">Roll No</p><p className="font-semibold">{student.rollNo}</p></div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
              </div>
            </div>
          </div>

          {fees.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-gray-600">Records</p><p className="text-2xl font-bold text-gray-800">{totalRecords}</p></div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><FaCalendarAlt className="text-blue-600 text-xl" /></div>
                  </div>
                </div>
              </div>

              {/* Table Search - EXACTLY AS SHOWN IN IMAGE */}
              <div className="bg-white rounded-xl shadow p-4">
                <form onSubmit={handleTableSearch} className="flex gap-3">
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
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <FaSearch />
                    <span>Search</span>
                  </button>
                </form>
                <p className="text-sm text-gray-500 mt-2">
                  Showing records for: <span className="font-semibold">{student?.name}</span> • Phone: <span className="font-semibold">{student?.phone}</span>
                </p>
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
                      {filteredFees.map((record) => (
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
                
                {/* Show count of filtered results */}
                {searchTerm && (
                  <div className="p-3 bg-gray-50 border-t text-sm text-gray-600">
                    Found {filteredFees.length} record{filteredFees.length !== 1 ? 's' : ''} matching "{searchTerm}"
                  </div>
                )}
              </div>
            </>
          ) : (
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

// ==================== PAY FEE CONTENT COMPONENT (UPDATED) ====================
function PayFeeContent({ studentInfo, isLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messFees, setMessFees] = useState([]);
  const [canteenFees, setCanteenFees] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("mess");
  const [selectAll, setSelectAll] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);

  // Check if already logged in from parent
  useEffect(() => {
    if (isLoggedIn && studentInfo && !autoLoaded) {
      const studentPhone = studentInfo.phone || 
                          studentInfo.phoneNo || 
                          localStorage.getItem("studentPhone") || 
                          sessionStorage.getItem("studentPhone");
      
      if (studentPhone) {
        setPhone(studentPhone);
        handleAutoLogin(studentPhone);
      }
      setAutoLoaded(true);
    }
  }, [isLoggedIn, studentInfo, autoLoaded]);

  const handleAutoLogin = async (phoneNumber) => {
    setLoading(true);
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phoneNumber}`
      );
      
      const studentData = studentRes.data;
      setStudent(studentData);
      setIsLoggedInLocal(true);
      
      // Fetch fees
      await fetchFees(studentData._id);
      
    } catch (err) {
      console.error("Auto-login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phone}`
      );
      
      const studentData = studentRes.data;
      setStudent(studentData);
      setIsLoggedInLocal(true);
      localStorage.setItem("studentPhone", phone);
      localStorage.setItem("studentData", JSON.stringify(studentData));
      
      await fetchFees(studentData._id);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Student not found with this phone number");
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async (studentId) => {
    try {
      const messRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}/mess-fees`
      );
      setMessFees(messRes.data);

      const canteenRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}/canteen-fees`
      );
      setCanteenFees(canteenRes.data);

    } catch (err) {
      console.error("Error fetching fees:", err);
    }
  };

  const handleLogout = () => {
    setIsLoggedInLocal(false);
    setStudent(null);
    setPhone("");
    setMessFees([]);
    setCanteenFees([]);
    setSelectedFees([]);
  };

  const handleFeeSelection = (fee, type) => {
    const feeWithType = { ...fee, feeType: type };
    const isSelected = selectedFees.some(f => f._id === fee._id && f.feeType === type);
    
    if (isSelected) {
      setSelectedFees(selectedFees.filter(f => !(f._id === fee._id && f.feeType === type)));
    } else {
      setSelectedFees([...selectedFees, feeWithType]);
    }
  };

  const handleSelectAll = (type) => {
    const fees = type === 'mess' ? messFees : canteenFees;
    const pendingFees = fees.filter(f => f.status === "Pending" || f.status === "Partial");
    
    if (selectAll) {
      setSelectedFees(selectedFees.filter(f => f.feeType !== type));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedFees];
      pendingFees.forEach(fee => {
        const exists = newSelected.some(f => f._id === fee._id && f.feeType === type);
        if (!exists) {
          newSelected.push({ ...fee, feeType: type });
        }
      });
      setSelectedFees(newSelected);
      setSelectAll(true);
    }
  };

  const calculateTotal = () => {
    return selectedFees.reduce((sum, fee) => sum + (fee.dueAmount || fee.totalAmount || 0), 0);
  };

  const handleProceedToPayment = () => {
    if (selectedFees.length === 0) {
      alert("Please select at least one fee to pay");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingPayment(false);
      setShowPaymentModal(false);
      setPaymentSuccess(true);
      setSelectedFees([]);
      
      await fetchFees(student._id);
      
      setTimeout(() => setPaymentSuccess(false), 3000);
      
    } catch (err) {
      console.error("Payment error:", err);
      setProcessingPayment(false);
      alert("Payment failed. Please try again.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Partial": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const messPending = messFees.filter(f => f.status === "Pending" || f.status === "Partial");
  const canteenPending = canteenFees.filter(f => f.status === "Pending" || f.status === "Partial");
  
  const totalMessDue = messPending.reduce((sum, f) => sum + (f.dueAmount || f.totalAmount || 0), 0);
  const totalCanteenDue = canteenPending.reduce((sum, f) => sum + (f.dueAmount || f.totalAmount || 0), 0);
  const totalDue = totalMessDue + totalCanteenDue;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your fee data...</p>
        </div>
      </div>
    );
  }

  // Login Form
  if (!isLoggedInLocal && !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-orange-600 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Login</h2>
            <p className="text-gray-600">Enter your phone number to pay fees</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  maxLength="10"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <FaPhone />
                  <span>Login & Continue</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your phone number is secure and only used for authentication
          </p>
        </div>
      </div>
    );
  }

  // Payment Success Message
  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
          <button
            onClick={() => setPaymentSuccess(false)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Student Info */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <FaUserCircle className="text-orange-500 text-4xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{student?.name}</h2>
              <div className="flex flex-wrap gap-4 mt-1">
                <p className="text-gray-600 text-sm">📞 {student?.phone || student?.phoneNo}</p>
                <p className="text-gray-600 text-sm">🏠 Room {student?.roomNo || student?.room || "N/A"}</p>
                <p className="text-gray-600 text-sm">📚 {student?.rollNo || student?.rollNumber || "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Due</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <FaTimes />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Mess Fee Due</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalMessDue)}</p>
              <p className="text-xs text-gray-500 mt-1">{messPending.length} pending records</p>
            </div>
            <FaUtensils className="text-orange-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Canteen Fee Due</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalCanteenDue)}</p>
              <p className="text-xs text-gray-500 mt-1">{canteenPending.length} pending records</p>
            </div>
            <FaCoffee className="text-orange-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Selected Fees</p>
              <p className="text-2xl font-bold text-blue-600">{selectedFees.length}</p>
              <p className="text-xs text-gray-500 mt-1">Amount: {formatCurrency(calculateTotal())}</p>
            </div>
            <FaCheckCircle className="text-blue-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Fee Selection Tabs */}
      <div className="bg-white rounded-xl shadow">
        <div className="border-b">
          <nav className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab("mess")}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === "mess"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Mess Fee ({messPending.length})
            </button>
            <button
              onClick={() => setActiveTab("canteen")}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === "canteen"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Canteen Fee ({canteenPending.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "mess" ? (
            <>
              {messPending.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Pending Mess Fee Records</h3>
                    <button
                      onClick={() => handleSelectAll('mess')}
                      className="text-sm text-orange-600 hover:text-orange-700 flex items-center space-x-1"
                    >
                      <FaCheckCircle />
                      <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
                    </button>
                  </div>
                  
                  {messPending.map((fee) => (
                    <div key={fee._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedFees.some(f => f._id === fee._id && f.feeType === 'mess')}
                            onChange={() => handleFeeSelection(fee, 'mess')}
                            className="mt-1 w-5 h-5 text-orange-500 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-semibold text-lg">{fee.month} {fee.year}</p>
                                <p className="text-sm text-gray-600">Total Amount: {formatCurrency(fee.totalAmount)}</p>
                                {fee.paidAmount > 0 && (
                                  <p className="text-sm text-green-600">Paid: {formatCurrency(fee.paidAmount)}</p>
                                )}
                                <p className="text-sm font-semibold text-red-600">Due: {formatCurrency(fee.dueAmount || fee.totalAmount)}</p>
                                {fee.dueDate && (
                                  <p className="text-xs text-red-500 mt-1">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold h-fit ${getStatusColor(fee.status)}`}>
                                {fee.status}
                              </span>
                            </div>
                            {fee.remarks && (
                              <p className="text-xs text-gray-500 mt-2">Note: {fee.remarks}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending mess fees found</p>
                </div>
              )}
            </>
          ) : (
            <>
              {canteenPending.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Pending Canteen Fee Records</h3>
                    <button
                      onClick={() => handleSelectAll('canteen')}
                      className="text-sm text-orange-600 hover:text-orange-700 flex items-center space-x-1"
                    >
                      <FaCheckCircle />
                      <span>{selectAll ? 'Deselect All' : 'Select All'}</span>
                    </button>
                  </div>
                  
                  {canteenPending.map((fee) => (
                    <div key={fee._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedFees.some(f => f._id === fee._id && f.feeType === 'canteen')}
                            onChange={() => handleFeeSelection(fee, 'canteen')}
                            className="mt-1 w-5 h-5 text-orange-500 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-semibold text-lg">{fee.month} {fee.year}</p>
                                <p className="text-sm text-gray-600">Total Amount: {formatCurrency(fee.totalAmount)}</p>
                                {fee.paidAmount > 0 && (
                                  <p className="text-sm text-green-600">Paid: {formatCurrency(fee.paidAmount)}</p>
                                )}
                                <p className="text-sm font-semibold text-red-600">Due: {formatCurrency(fee.dueAmount || fee.totalAmount)}</p>
                                {fee.dueDate && (
                                  <p className="text-xs text-red-500 mt-1">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold h-fit ${getStatusColor(fee.status)}`}>
                                {fee.status}
                              </span>
                            </div>
                            {fee.remarks && (
                              <p className="text-xs text-gray-500 mt-2">Note: {fee.remarks}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending canteen fees found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Summary & Action */}
      {selectedFees.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 sticky bottom-0 border-t-4 border-orange-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-600">Selected Fees: {selectedFees.length}</p>
              <p className="text-3xl font-bold text-gray-800">Total: {formatCurrency(calculateTotal())}</p>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 flex items-center space-x-2 text-lg"
            >
              <FaRupeeSign />
              <span>Proceed to Pay</span>
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Make Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(calculateTotal())}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedFees.length} fee(s) selected</p>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 border rounded-lg flex flex-col items-center ${
                          paymentMethod === "card" ? "border-orange-500 bg-orange-50" : ""
                        }`}
                      >
                        <FaCreditCard className="text-xl mb-1" />
                        <span className="text-xs">Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3 border rounded-lg flex flex-col items-center ${
                          paymentMethod === "upi" ? "border-orange-500 bg-orange-50" : ""
                        }`}
                      >
                        <FaWallet className="text-xl mb-1" />
                        <span className="text-xs">UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`p-3 border rounded-lg flex flex-col items-center ${
                          paymentMethod === "netbanking" ? "border-orange-500 bg-orange-50" : ""
                        }`}
                      >
                        <FaUniversity className="text-xl mb-1" />
                        <span className="text-xs">Net Banking</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("qr")}
                        className={`p-3 border rounded-lg flex flex-col items-center ${
                          paymentMethod === "qr" ? "border-orange-500 bg-orange-50" : ""
                        }`}
                      >
                        <FaQrcode className="text-xl mb-1" />
                        <span className="text-xs">QR Code</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g., name@okhdfcbank)"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  )}

                  {paymentMethod === "netbanking" && (
                    <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500" required>
                      <option value="">Select Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                    </select>
                  )}

                  {paymentMethod === "qr" && (
                    <div className="text-center p-4">
                      <div className="w-48 h-48 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                        <FaQrcode className="text-6xl text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">Scan this QR code with any UPI app</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {processingPayment ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FaRupeeSign />
                        <span>Pay {formatCurrency(calculateTotal())}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== CANTEEN FEE CONTENT COMPONENT (UPDATED WITH SEARCH) ====================
function CanteenFeeContent({ studentInfo, isLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [fees, setFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Auto-load data if student is already logged in from sign-in page
  useEffect(() => {
    const loadStudentData = async () => {
      if (isLoggedIn && studentInfo && !autoLoaded) {
        setLoading(true);
        
        const studentPhone = studentInfo.phone || 
                            studentInfo.phoneNo || 
                            localStorage.getItem("studentPhone") || 
                            sessionStorage.getItem("studentPhone");
        
        if (studentPhone) {
          setPhone(studentPhone);
          await fetchStudentData(studentPhone);
        }
        setAutoLoaded(true);
      }
    };

    loadStudentData();
  }, [isLoggedIn, studentInfo, autoLoaded]);

  // Filter fees based on search term
  useEffect(() => {
    if (fees.length > 0) {
      const filtered = fees.filter(record => {
        if (!searchTerm) return true;
        
        const term = searchTerm.toLowerCase();
        return (
          record.month?.toLowerCase().includes(term) ||
          record.year?.toString().includes(term) ||
          record.receiptNo?.toLowerCase().includes(term)
        );
      });
      setFilteredFees(filtered);
    } else {
      setFilteredFees(fees);
    }
  }, [fees, searchTerm]);

  const fetchStudentData = async (phoneNumber) => {
    try {
      const studentRes = await axios.get(`${API_BASE_URL}/api/students/phone/${phoneNumber}`);
      setStudent(studentRes.data);
      const feeRes = await axios.get(`${API_BASE_URL}/api/students/${studentRes.data._id}/canteen-fees`);
      setFees(feeRes.data);
      setFilteredFees(feeRes.data);
    } catch (err) {
      setError("Could not load canteen fee data automatically");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setFees([]);
    setStudent(null);
    if (phone.length < 10) { setError("Enter valid phone number"); return; }
    setLoading(true);
    try {
      const studentRes = await axios.get(`${API_BASE_URL}/api/students/phone/${phone}`);
      setStudent(studentRes.data);
      const feeRes = await axios.get(`${API_BASE_URL}/api/students/${studentRes.data._id}/canteen-fees`);
      setFees(feeRes.data);
      setFilteredFees(feeRes.data);
    } catch (err) {
      setError("Student not found or no records available");
    } finally { setLoading(false); }
  };

  const handleTableSearch = (e) => {
    e.preventDefault();
    // Filtering is handled by useEffect
  };

  const totalAmount = filteredFees.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const totalPaid = filteredFees.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  const totalDue = filteredFees.reduce((sum, r) => sum + (r.dueAmount || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Partial": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">Loading canteen fee data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Canteen Fee Records</h1>
      
      {!student && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search Student by Phone Number</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Enter student phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2">
                {loading ? <><FaSpinner className="animate-spin" /><span>Searching...</span></> : <><FaSearch /><span>Search</span></>}
              </button>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600">{error}</p></div>}
          </form>
        </div>
      )}
      
      {student && (
        <>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center space-x-4">
              <FaUserCircle className="text-blue-600 text-5xl" />
              <div>
                <h3 className="text-2xl font-bold">{student.name}</h3>
                <p>📞 {student.phone} | 🏠 Room {student.roomNo} | 📚 {student.rollNo}</p>
              </div>
            </div>
          </div>
          
          {fees.length > 0 ? (
            <>
              {/* Table Search - EXACTLY AS SHOWN IN IMAGE */}
              <div className="bg-white rounded-xl shadow p-4">
                <form onSubmit={handleTableSearch} className="flex gap-3">
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
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <FaSearch />
                    <span>Search</span>
                  </button>
                </form>
                <p className="text-sm text-gray-500 mt-2">
                  Showing records for: <span className="font-semibold">{student?.name}</span> • Phone: <span className="font-semibold">{student?.phone}</span>
                </p>
              </div>

              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex justify-between">
                    <span>Total Amount: ₹{totalAmount.toLocaleString()}</span>
                    <span>Paid: ₹{totalPaid.toLocaleString()}</span>
                    <span>Due: ₹{totalDue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left">Month/Year</th>
                        <th className="p-3 text-left">Total</th>
                        <th className="p-3 text-left">Paid</th>
                        <th className="p-3 text-left">Due</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFees.map((record) => (
                        <tr key={record._id} className="border-t">
                          <td className="p-3">{record.month} {record.year}</td>
                          <td className="p-3">₹{record.totalAmount}</td>
                          <td className="p-3 text-green-600">₹{record.paidAmount}</td>
                          <td className="p-3 text-red-600">₹{record.dueAmount}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-blue-600">{record.receiptNo || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Show count of filtered results */}
                {searchTerm && (
                  <div className="p-3 bg-gray-50 border-t text-sm text-gray-600">
                    Found {filteredFees.length} record{filteredFees.length !== 1 ? 's' : ''} matching "{searchTerm}"
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <FaCoffee className="text-4xl text-gray-400 mx-auto mb-4" />
              <p>No canteen fee records found</p>
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
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold">My Account</h1>
      {studentInfo && (
        <div className="mt-6 space-y-4">
          <p><strong>Name:</strong> {studentInfo.name}</p>
          <p><strong>Email:</strong> {studentInfo.email}</p>
          <p><strong>Phone:</strong> {studentInfo.phone}</p>
          <p><strong>Roll No:</strong> {studentInfo.rollNo}</p>
          <p><strong>Room:</strong> {studentInfo.roomNo}</p>
        </div>
      )}
    </div>
  );
}

function DefaultContent({ studentInfo, isLoggedIn }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold">Welcome to Student Panel</h1>
      {isLoggedIn && studentInfo ? (
        <p className="mt-4">Welcome back, {studentInfo.name}! Select a menu option to continue.</p>
      ) : (
        <p className="mt-4">Please log in to access your information.</p>
      )}
    </div>
  );
}