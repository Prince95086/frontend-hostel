import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaUserCircle,
  FaRupeeSign,
  FaUtensils,
  FaCoffee,
  FaChartLine,
  FaClipboardList,
  FaExclamationTriangle,
  FaCog,
  FaBars,
  FaBell,
  FaPhone,
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaCreditCard,
  FaWallet,
  FaUniversity,
  FaQrcode,
  FaLock,
  FaMoneyBillWave,
  FaFileInvoice,
  FaCalendarAlt,
  FaExclamation,
  FaPrint,
  FaDownload,
  FaReceipt,
  FaHistory,
  FaArrowLeft,
  FaIdCard
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";
import QRCode from "qrcode"; // Install: npm install qrcode

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

// ==================== MAIN LAYOUT COMPONENT ====================
export default function MessFeeStudent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem("activeMenu") || "Mess Fee";
  });
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
    if (path !== "#") {
      setActiveMenu(label);
      localStorage.setItem("activeMenu", label);
      navigate(path);
      if (isMobile) setSidebarOpen(false);
    }
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
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find(item => item.path === currentPath);
    if (currentMenuItem) {
      setActiveMenu(currentMenuItem.label);
      localStorage.setItem("activeMenu", currentMenuItem.label);
    }
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    // Clear all storage
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentRollNo");
    localStorage.removeItem("studentData");
    localStorage.removeItem("studentToken");
    localStorage.removeItem("activeMenu");
    
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
      case "Mess Fee":
        return <MessFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      case "Canteen Fee":
        return <CanteenFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      case "Pay Fee":
        return <PayFeeContent studentInfo={studentInfo} isLoggedIn={isLoggedIn} />;
      case "My Account":
        return <MyAccountContent studentInfo={studentInfo} />;
      case "Setting":
        return <SettingContent />;
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
                    ${item.path === "#" ? 'opacity-60 cursor-not-allowed' : ''}
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
                        handleMenuClick("My Account", "/my-account");
                      }}
                    >
                      Profile
                    </button>

                    <button
                      type="button"
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors border-b border-gray-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleMenuClick("Setting", "/student-setting");
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

// ==================== PAY FEE CONTENT COMPONENT (UPDATED WITH AUTO-LOAD) ====================
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
  const [activeTab, setActiveTab] = useState("pending");
  const [transactionId, setTransactionId] = useState(null);
  const [updatingFees, setUpdatingFees] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [generatedQR, setGeneratedQR] = useState(false);
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
          // Try using roll number or ID
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
    try {
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phoneNumber}`
      );
      
      setStudent(studentRes.data);
      setIsLoggedInLocal(true);
      localStorage.setItem("studentPhone", phoneNumber);
      localStorage.setItem("studentData", JSON.stringify(studentRes.data));
      
      await fetchFees(studentRes.data._id);
      
    } catch (err) {
      console.error("Auto-load error:", err);
      setError("Could not load fee data automatically. Please search manually.");
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
      setIsLoggedInLocal(true);
      localStorage.setItem("studentRollNo", rollNo);
      localStorage.setItem("studentData", JSON.stringify(studentRes.data));
      
      await fetchFees(studentRes.data._id);
      
    } catch (err) {
      console.error("Auto-load by roll no error:", err);
      setError("Could not load fee data automatically. Please search manually.");
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
      setIsLoggedInLocal(true);
      localStorage.setItem("studentData", JSON.stringify(studentRes.data));
      
      await fetchFees(studentId);
      
    } catch (err) {
      console.error("Auto-load by ID error:", err);
      setError("Could not load fee data automatically. Please search manually.");
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
      // Get student by phone
      const studentRes = await axios.get(
        `${API_BASE_URL}/api/students/phone/${phone}`
      );
      
      setStudent(studentRes.data);
      setIsLoggedInLocal(true);
      localStorage.setItem("studentPhone", phone);
      localStorage.setItem("studentData", JSON.stringify(studentRes.data));
      
      // Fetch fees
      await fetchFees(studentRes.data._id);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Student not found with this phone number");
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async (studentId) => {
    try {
      // Fetch mess fees
      const messRes = await axios.get(
        `${API_BASE_URL}/api/students/${studentId}/mess-fees`
      );
      setMessFees(messRes.data);

      // Fetch canteen fees
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
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentData");
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
    
    const newSelected = [...selectedFees];
    
    pendingFees.forEach(fee => {
      const exists = newSelected.some(f => f._id === fee._id && f.feeType === type);
      if (!exists) {
        newSelected.push({ ...fee, feeType: type });
      }
    });
    
    setSelectedFees(newSelected);
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
    setGeneratedQR(false);
    setQrImage(null);
  };

  // Function to generate dynamic QR code with amount
  const generatePaymentQR = async () => {
    try {
      setProcessingPayment(true);
      
      const totalAmount = calculateTotal();
      const upiId = "predgs@ybl"; // Your UPI ID
      const payeeName = "Teja Singh Boys Hostel";
      const transactionNote = `Fee payment for ${student?.name}`;
      
      // Generate unique transaction ID
      const txnId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      setTransactionId(txnId);
      
      // Create UPI QR code string with exact amount (auto-filled when scanned)
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
      
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(upiString, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      setQrImage(qrDataUrl);
      setGeneratedQR(true);
      setProcessingPayment(false);
      
    } catch (error) {
      console.error("Error generating QR:", error);
      alert("Failed to generate QR code. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Function to update fee status after successful payment
  const updateFeeStatus = async (feeId, feeType, amount) => {
    try {
      const endpoint = feeType === 'mess' 
        ? `${API_BASE_URL}/api/mess-fees/${feeId}/pay`
        : `${API_BASE_URL}/api/canteen-fees/${feeId}/pay`;
      
      await axios.post(endpoint, {
        studentId: student._id,
        amount: amount,
        paymentMethod: "UPI QR",
        paymentDate: new Date().toISOString(),
        receiptNo: generateReceiptNumber(),
        transactionId: transactionId
      });
      
      console.log(`Fee ${feeId} updated successfully`);
    } catch (error) {
      console.error(`Error updating fee ${feeId}:`, error);
      throw error;
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === "qr" && !generatedQR) {
      await generatePaymentQR();
      return;
    }
    
    setProcessingPayment(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUpdatingFees(true);
      
      const updatePromises = selectedFees.map(fee => 
        updateFeeStatus(fee._id, fee.feeType, fee.dueAmount || fee.totalAmount)
      );
      
      await Promise.all(updatePromises);
      
      await fetchFees(student._id);
      
      setProcessingPayment(false);
      setShowPaymentModal(false);
      setPaymentSuccess(true);
      setSelectedFees([]);
      setTransactionId(null);
      setQrImage(null);
      setGeneratedQR(false);
      setUpdatingFees(false);
      
      setTimeout(() => setPaymentSuccess(false), 3000);
      
    } catch (err) {
      console.error("Payment error:", err);
      setProcessingPayment(false);
      setUpdatingFees(false);
      alert("Payment failed. Please try again.");
    }
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RCP${year}${month}${day}${random}`;
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

  // Calculate totals
  const totalMessDue = messFees.filter(f => f.status === "Pending" || f.status === "Partial")
    .reduce((sum, f) => sum + (f.dueAmount || f.totalAmount || 0), 0);
  const totalCanteenDue = canteenFees.filter(f => f.status === "Pending" || f.status === "Partial")
    .reduce((sum, f) => sum + (f.dueAmount || f.totalAmount || 0), 0);
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
          <p className="text-gray-600 mb-6">
            Your payment of {formatCurrency(calculateTotal())} has been processed successfully. 
            {selectedFees.length} fee(s) have been marked as PAID.
          </p>
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
      {/* Header with Student Info - Logout button removed */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <FaUserCircle className="text-orange-500 text-4xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{student?.name || studentInfo?.name}</h2>
              <p className="text-gray-600">Phone: {student?.phone || studentInfo?.phone || studentInfo?.phoneNo}</p>
              <p className="text-sm text-gray-500">Room: {student?.roomNo || studentInfo?.roomNo || "N/A"} | Roll: {student?.rollNo || studentInfo?.rollNo || "N/A"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Due</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</p>
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
            </div>
            <FaUtensils className="text-orange-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Canteen Fee Due</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalCanteenDue)}</p>
            </div>
            <FaCoffee className="text-orange-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Selected Fees</p>
              <p className="text-2xl font-bold text-blue-600">{selectedFees.length}</p>
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
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === "pending"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Fees
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === "history"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Payment History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "pending" ? (
            <div className="space-y-8">
              {/* Mess Fees */}
              {messFees.filter(f => f.status === "Pending" || f.status === "Partial").length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FaUtensils className="mr-2 text-orange-500" />
                      Mess Fee - Pending/Partial
                    </h3>
                    <button
                      onClick={() => handleSelectAll('mess')}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {messFees.filter(f => f.status === "Pending" || f.status === "Partial").map((fee) => (
                      <div key={fee._id} className="border rounded-lg p-4 hover:shadow-md">
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
                                  <p className="font-semibold">{fee.month} {fee.year}</p>
                                  <p className="text-sm text-gray-600">Total: {formatCurrency(fee.totalAmount)}</p>
                                  {fee.paidAmount > 0 && (
                                    <p className="text-sm text-green-600">Paid: {formatCurrency(fee.paidAmount)}</p>
                                  )}
                                  <p className="text-sm font-semibold text-red-600">Due: {formatCurrency(fee.dueAmount || fee.totalAmount)}</p>
                                  {fee.dueDate && (
                                    <p className="text-xs text-red-500">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                                  )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold h-fit ${getStatusColor(fee.status)}`}>
                                  {fee.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Canteen Fees */}
              {canteenFees.filter(f => f.status === "Pending" || f.status === "Partial").length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FaCoffee className="mr-2 text-orange-500" />
                      Canteen Fee - Pending/Partial
                    </h3>
                    <button
                      onClick={() => handleSelectAll('canteen')}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {canteenFees.filter(f => f.status === "Pending" || f.status === "Partial").map((fee) => (
                      <div key={fee._id} className="border rounded-lg p-4 hover:shadow-md">
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
                                  <p className="font-semibold">{fee.month} {fee.year}</p>
                                  <p className="text-sm text-gray-600">Total: {formatCurrency(fee.totalAmount)}</p>
                                  {fee.paidAmount > 0 && (
                                    <p className="text-sm text-green-600">Paid: {formatCurrency(fee.paidAmount)}</p>
                                  )}
                                  <p className="text-sm font-semibold text-red-600">Due: {formatCurrency(fee.dueAmount || fee.totalAmount)}</p>
                                  {fee.dueDate && (
                                    <p className="text-xs text-red-500">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                                  )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold h-fit ${getStatusColor(fee.status)}`}>
                                  {fee.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messFees.filter(f => f.status === "Pending" || f.status === "Partial").length === 0 && 
               canteenFees.filter(f => f.status === "Pending" || f.status === "Partial").length === 0 && (
                <div className="text-center py-12">
                  <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No pending fees found!</p>
                  <p className="text-gray-500">All your fees are paid up to date.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment History */}
              {[...messFees.filter(f => f.status === "Paid"), ...canteenFees.filter(f => f.status === "Paid")].length > 0 ? (
                [...messFees.filter(f => f.status === "Paid"), ...canteenFees.filter(f => f.status === "Paid")].map((fee) => (
                  <div key={fee._id} className="border rounded-lg p-4 hover:shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {fee.feeType === 'mess' ? 
                            <FaUtensils className="text-orange-500" /> : 
                            <FaCoffee className="text-orange-500" />
                          }
                          <p className="font-semibold">{fee.month} {fee.year}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(fee.status)}`}>
                            {fee.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="font-bold">₹{fee.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Paid</p>
                            <p className="font-bold text-green-600">₹{fee.paidAmount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-medium">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Method</p>
                            <p className="text-sm">{fee.paymentMethod || 'N/A'}</p>
                          </div>
                        </div>
                        {fee.receiptNo && (
                          <p className="text-xs text-gray-500 mt-2">Receipt: {fee.receiptNo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FaHistory className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No payment history found</p>
                </div>
              )}
            </div>
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
              disabled={updatingFees}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 flex items-center space-x-2 text-lg disabled:opacity-50"
            >
              {updatingFees ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaRupeeSign />
                  <span>Proceed to Pay</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                          paymentMethod === "card" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FaCreditCard className={`text-xl mb-1 ${paymentMethod === "card" ? "text-orange-500" : "text-gray-400"}`} />
                        <span className="text-xs">Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3 border rounded-lg flex flex-col items-center ${
                          paymentMethod === "upi" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FaWallet className={`text-xl mb-1 ${paymentMethod === "upi" ? "text-orange-500" : "text-gray-400"}`} />
                        <span className="text-xs">UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`p-3 border rounded-lg flex flex-col items-center ${
                          paymentMethod === "netbanking" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FaUniversity className={`text-xl mb-1 ${paymentMethod === "netbanking" ? "text-orange-500" : "text-gray-400"}`} />
                        <span className="text-xs">Net Banking</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("qr")}
                        className={`p-3 border rounded-lg flex flex-col items-center ${
                          paymentMethod === "qr" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FaQrcode className={`text-xl mb-1 ${paymentMethod === "qr" ? "text-orange-500" : "text-gray-400"}`} />
                        <span className="text-xs">QR Code (Auto Amount)</span>
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

                  {/* DYNAMIC QR CODE SECTION - WITH AUTO AMOUNT */}
                  {paymentMethod === "qr" && (
                    <div className="text-center p-4">
                      {!generatedQR ? (
                        <div>
                          <button
                            type="button"
                            onClick={generatePaymentQR}
                            disabled={processingPayment}
                            className="mb-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto"
                          >
                            {processingPayment ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                <span>Generating QR...</span>
                              </>
                            ) : (
                              <>
                                <FaQrcode />
                                <span>Generate QR Code</span>
                              </>
                            )}
                          </button>
                          
                          <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                            <FaQrcode className="text-6xl text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Click to generate QR code with amount {formatCurrency(calculateTotal())}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="relative mb-4">
                            <img
                              src={qrImage}
                              alt="Payment QR Code"
                              className="mx-auto mb-2 w-48 h-48 border rounded-lg shadow-md"
                            />
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              ₹{calculateTotal()}
                            </div>
                          </div>
                          
                          <p className="text-sm font-bold text-gray-800 mb-2">
                            Amount: {formatCurrency(calculateTotal())}
                          </p>
                          
                          <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <p className="text-xs text-green-800 font-semibold">
                              ✅ Amount is pre-filled in QR code
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              When you scan, the amount ₹{calculateTotal()} will be automatically set
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            Scan with any UPI app (Google Pay, PhonePe, Paytm)
                          </p>
                          
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-800">
                              <strong>UPI ID:</strong> predgs@ybl
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              The amount will be auto-filled when you scan
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = qrImage;
                              link.download = `payment_qr_${transactionId || 'hostel'}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2 mx-auto"
                          >
                            <FaDownload />
                            <span>Download QR</span>
                          </button>

                          {transactionId && (
                            <p className="text-xs text-gray-500 mt-2">
                              Transaction ID: {transactionId}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={processingPayment || (paymentMethod === "qr" && !generatedQR)}
                    className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {processingPayment ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : paymentMethod === "qr" && !generatedQR ? (
                      <>
                        <FaQrcode />
                        <span>Generate QR First</span>
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

// ==================== MESS FEE CONTENT COMPONENT (UPDATED WITH AUTO-LOAD) ====================
function MessFeeContent({ studentInfo, isLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [fees, setFees] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const totalRecords = fees.length;
  const totalAmount = fees.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
  const totalPaid = fees.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
  const totalDue = fees.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
  const paidRecords = fees.filter(record => record.status === "Paid").length;
  const pendingRecords = fees.filter(record => record.status === "Pending").length;
  const partialRecords = fees.filter(record => record.status === "Partial").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Partial": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash": return <FaMoneyBillWave className="text-green-600" />;
      case "Online": return <FaRupeeSign className="text-blue-600" />;
      case "Cheque": return <FaFileInvoice className="text-purple-600" />;
      default: return <FaRupeeSign className="text-gray-600" />;
    }
  };

  const handlePrint = () => window.print();

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

  // Show loading state
  if (loading) {
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
          {isLoggedIn ? "View your mess fee payment history" : "Student Portal - View and manage mess fee payments"}
        </div>
      </div>

      {/* Only show search form if no student data loaded yet */}
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
          </form>
        </div>
      )}

      {student && (
        <>
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

          {fees.length > 0 && (
            <>
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

              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Monthly Mess Fee Records</h3>
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
                      {fees.map((record) => (
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
                                    localStorage.setItem("activeMenu", "Pay Fee");
                                    window.location.href = "/pay-fee";
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
                      <span className="font-semibold">Summary:</span> {paidRecords} Paid • {partialRecords} Partial • {pendingRecords} Pending
                    </div>
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
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

// ==================== CANTEEN FEE CONTENT COMPONENT (UPDATED WITH AUTO-LOAD) ====================
function CanteenFeeContent({ studentInfo, isLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [fees, setFees] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const totalRecords = fees.length;
  const totalAmount = fees.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
  const totalPaid = fees.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
  const totalDue = fees.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
  const paidRecords = fees.filter(record => record.status === "Paid").length;
  const pendingRecords = fees.filter(record => record.status === "Pending").length;
  const partialRecords = fees.filter(record => record.status === "Partial").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Partial": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash": return <FaMoneyBillWave className="text-green-600" />;
      case "Online": return <FaRupeeSign className="text-blue-600" />;
      case "Cheque": return <FaFileInvoice className="text-purple-600" />;
      default: return <FaRupeeSign className="text-gray-600" />;
    }
  };

  const handlePrint = () => window.print();

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

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Canteen Fee Records</h1>
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your canteen fee records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Canteen Fee Records</h1>

      {/* Only show search form if no student data loaded yet */}
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
                      <h3 className="text-xl font-bold text-gray-800">Monthly Canteen Fee Records</h3>
                      <p className="text-gray-600 mt-1">Payment details for {student.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button onClick={handlePrint} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"><FaPrint /><span>Print</span></button>
                      <button onClick={handleDownload} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"><FaDownload /><span>Download</span></button>
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Paid: {paidRecords}</span>
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Partial: {partialRecords}</span>
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
              <FaCoffee className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Fee Records Found</h3>
              <p className="text-gray-600">No canteen fee records found for this student</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ==================== MY ACCOUNT CONTENT COMPONENT ====================
function MyAccountContent({ studentInfo }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Account</h1>
      <div className="bg-white rounded-xl shadow p-6">
        {studentInfo ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <FaUserCircle className="text-orange-500 text-5xl" />
              <div>
                <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
                <p className="text-gray-600">Student</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{studentInfo.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{studentInfo.phone || studentInfo.phoneNo}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-semibold">{studentInfo.rollNo || studentInfo.rollNumber}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Room Number</p>
                <p className="font-semibold">{studentInfo.roomNo || studentInfo.room}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Please log in to view your account details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== SETTING CONTENT COMPONENT ====================
function SettingContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Settings</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-center py-12">
          <FaCog className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Settings content will be implemented soon...</p>
        </div>
      </div>
    </div>
  );
}

// ==================== DEFAULT CONTENT COMPONENT ====================
function DefaultContent({ studentInfo, isLoggedIn }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome to Student Panel</h1>
      <div className="bg-white rounded-xl shadow p-6">
        {isLoggedIn ? (
          <div className="text-center py-12">
            <FaUserCircle className="text-6xl text-orange-500 mx-auto mb-4" />
            <p className="text-xl font-semibold">Welcome back, {studentInfo?.name}!</p>
            <p className="text-gray-500 mt-2">Select a menu option from the sidebar to continue.</p>
          </div>
        ) : (
          <p className="text-center text-gray-600 py-12">
            Please log in to access your information.
          </p>
        )}
      </div>
    </div>
  );
}