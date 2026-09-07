// import React, { useState, useEffect } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import {
//   FaUserCircle,
//   FaUsers,
//   FaClipboardList,
//   FaCog,
//   FaChartLine,
//   FaExclamationTriangle,
//   FaTasks,
//   FaBars,
//   FaUtensils,
//   FaCoffee,
//   FaSearch,
//   FaRupeeSign,
//   FaReceipt,
//   FaCalendarAlt,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaMoneyBillWave,
//   FaTachometerAlt,
//   FaDownload,
//   FaPrint,
//   FaFileInvoice,
//   FaPhone,
//   FaCheck,
//   FaTimes,
//   FaExclamation,
//   FaBell,
//   FaHistory,
//   FaEnvelope,
//   FaSpinner,
//   FaCreditCard,
//   FaWallet,
//   FaUniversity,
//   FaQrcode,
//   FaLock,
//   FaArrowLeft
// } from "react-icons/fa";
// import { IoChevronDown } from "react-icons/io5";
// import pulogo from "../assets/puimages/pulogo.jpeg";

// // ==================== MAIN LAYOUT COMPONENT ====================
// export default function MessFeeStudent() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [activeMenu, setActiveMenu] = useState("Mess Fee");
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* ---------- RESPONSIVE ---------- */
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//       setSidebarOpen(window.innerWidth >= 1024);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   /* ---------- SIDEBAR MENU ---------- */
//   const menuItems = [
//     { label: "My Account", icon: <FaUserCircle />, path: "/my-account" },
//     { label: "Pay Fee", icon: <FaRupeeSign />, path: "/pay-fee" },
//     { label: "Mess Fee", icon: <FaUtensils />, path: "/mess-fee" },
//     { label: "Canteen Fee", icon: <FaCoffee />, path: "/canteen-fee" },
//     { label: "Reports", icon: <FaChartLine />, path: "/admin/reports" },
//     { label: "Function", icon: <FaClipboardList />, path: "/admin/total-complaint" },
//     { label: "Pending Complain", icon: <FaExclamationTriangle />, path: "/admin/pending-complaint" },
//     { label: "Setting", icon: <FaCog />, path: "/student-setting" },
//   ];

//   const handleMenuClick = (label, path) => {
//     setActiveMenu(label);
//     navigate(path);
//     if (isMobile) setSidebarOpen(false);
//   };

//   // Auto-close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobile && sidebarOpen) {
//         const sidebar = document.querySelector('aside');
//         const menuButton = document.querySelector('.menu-button');
        
//         if (sidebar && !sidebar.contains(event.target) && 
//             menuButton && !menuButton.contains(event.target)) {
//           setSidebarOpen(false);
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [sidebarOpen, isMobile]);

//   // Render content based on active menu
//   const renderContent = () => {
//     switch (activeMenu) {
//       case "Mess Fee":
//         return <MessFeeContent />;
//       case "Canteen Fee":
//         return <CanteenFeeContent />;
//       case "My Account":
//         return <MyAccountContent />;
//       case "Pay Fee":
//         return <PayFeeContent />;
//       default:
//         return <DefaultContent />;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* ================= SIDEBAR ================= */}
//       <aside
//         className={`
//           fixed lg:static inset-y-0 left-0 z-30
//           w-64 bg-orange-400 text-white flex flex-col justify-between
//           transform transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         <div className="p-5">
//           <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide">
//             Student Panel
//           </h2>

//           <nav>
//             <ul className="space-y-2">
//               {menuItems.map((item) => (
//                 <li
//                   key={item.label}
//                   className={`
//                     flex items-center space-x-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200
//                     ${activeMenu === item.label ? 'bg-orange-600' : 'hover:bg-orange-500'}
//                   `}
//                   onClick={() => handleMenuClick(item.label, item.path)}
//                 >
//                   <span className="text-lg">{item.icon}</span>
//                   <span className="font-medium">{item.label}</span>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </aside>

//       {/* ================= MAIN ================= */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* ---------- HEADER ---------- */}
//         <header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {isMobile && (
//                 <button 
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <FaBars className="text-xl text-gray-700" />
//                 </button>
//               )}
              
//               <img
//                 src={pulogo}
//                 alt="University Logo"
//                 className="w-10 h-10 lg:w-14 lg:h-14 object-contain"
//               />
              
//               <h1 className="text-xl lg:text-3xl font-bold text-gray-800 tracking-wide">
//                 Teja Singh Boys Hostel 6
//               </h1>
//             </div>

//             {/* ---------- NOTIFICATION & PROFILE ---------- */}
//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 text-gray-600 hover:text-orange-600">
//                 <FaBell className="w-6 h-6" />
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   3
//                 </span>
//               </button>
              
//               <div className="relative">
//                 <div
//                   className="flex items-center space-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                 >
//                   <FaUserCircle className="text-gray-700 w-8 h-8 lg:w-10 lg:h-10 hover:text-orange-600 transition-colors" />
//                   <IoChevronDown className={`text-gray-600 w-4 h-4 lg:w-5 lg:h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
//                 </div>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg border border-gray-200 w-48 py-2 z-50">
//                     <button
//                       type="button"
//                       className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors border-b border-gray-100"
//                       onClick={() => {
//                         setDropdownOpen(false);
//                         setActiveMenu("My Account");
//                       }}
//                     >
//                       Profile
//                     </button>

//                     <button
//                       type="button"
//                       className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors border-b border-gray-100"
//                       onClick={() => {
//                         setDropdownOpen(false);
//                         setActiveMenu("Setting");
//                       }}
//                     >
//                       Settings
//                     </button>

//                     <button
//                       type="button"
//                       className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors"
//                       onClick={() => {
//                         localStorage.removeItem("studentToken");
//                         localStorage.removeItem("studentPhone");
//                         localStorage.removeItem("studentData");
//                         setDropdownOpen(false);
//                         navigate("/");
//                       }}
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* ---------- PAGE CONTENT ---------- */}
//         <section className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
//           {renderContent()}
//         </section>
//       </main>

//       {/* Close dropdown when clicking outside */}
//       {dropdownOpen && (
//         <div 
//           className="fixed inset-0 z-20" 
//           onClick={() => setDropdownOpen(false)}
//         ></div>
//       )}
//     </div>
//   );
// }

// // ==================== PAY FEE CONTENT COMPONENT ====================
// function PayFeeContent() {
//   const [phone, setPhone] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [messFees, setMessFees] = useState([]);
//   const [canteenFees, setCanteenFees] = useState([]);
//   const [selectedFees, setSelectedFees] = useState([]);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [activeTab, setActiveTab] = useState("pending");

//   // Check if already logged in
//   useEffect(() => {
//     const savedPhone = localStorage.getItem("studentPhone");
//     const savedStudent = localStorage.getItem("studentData");
    
//     if (savedPhone && savedStudent) {
//       setPhone(savedPhone);
//       setStudent(JSON.parse(savedStudent));
//       setIsLoggedIn(true);
//       fetchFees(JSON.parse(savedStudent)._id);
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
    
//     if (phone.length < 10) {
//       setError("Please enter a valid 10-digit phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Get student by phone
//       const studentRes = await axios.get(
//         `http://localhost:5000/api/students/phone/${phone}`
//       );
      
//       setStudent(studentRes.data);
//       setIsLoggedIn(true);
//       localStorage.setItem("studentPhone", phone);
//       localStorage.setItem("studentData", JSON.stringify(studentRes.data));
      
//       // Fetch fees
//       await fetchFees(studentRes.data._id);
      
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Student not found with this phone number");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFees = async (studentId) => {
//     try {
//       // Fetch mess fees
//       const messRes = await axios.get(
//         `http://localhost:5000/api/students/${studentId}/mess-fees`
//       );
//       setMessFees(messRes.data);

//       // Fetch canteen fees
//       const canteenRes = await axios.get(
//         `http://localhost:5000/api/students/${studentId}/canteen-fees`
//       );
//       setCanteenFees(canteenRes.data);

//     } catch (err) {
//       console.error("Error fetching fees:", err);
//     }
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setStudent(null);
//     setPhone("");
//     setMessFees([]);
//     setCanteenFees([]);
//     setSelectedFees([]);
//     localStorage.removeItem("studentPhone");
//     localStorage.removeItem("studentData");
//   };

//   const handleFeeSelection = (fee, type) => {
//     const feeWithType = { ...fee, feeType: type };
//     const isSelected = selectedFees.some(f => f._id === fee._id && f.feeType === type);
    
//     if (isSelected) {
//       setSelectedFees(selectedFees.filter(f => !(f._id === fee._id && f.feeType === type)));
//     } else {
//       setSelectedFees([...selectedFees, feeWithType]);
//     }
//   };

//   const handleSelectAll = (type) => {
//     const fees = type === 'mess' ? messFees : canteenFees;
//     const pendingFees = fees.filter(f => f.status === "Pending");
    
//     const newSelected = [...selectedFees];
    
//     pendingFees.forEach(fee => {
//       const exists = newSelected.some(f => f._id === fee._id && f.feeType === type);
//       if (!exists) {
//         newSelected.push({ ...fee, feeType: type });
//       }
//     });
    
//     setSelectedFees(newSelected);
//   };

//   const calculateTotal = () => {
//     return selectedFees.reduce((sum, fee) => sum + (fee.dueAmount || fee.totalAmount || 0), 0);
//   };

//   const handleProceedToPayment = () => {
//     if (selectedFees.length === 0) {
//       alert("Please select at least one fee to pay");
//       return;
//     }
//     setShowPaymentModal(true);
//   };

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     setProcessingPayment(true);

//     try {
//       // Simulate payment processing
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Here you would make API calls to update payment status
//       // For each selected fee, update its status
      
//       setProcessingPayment(false);
//       setShowPaymentModal(false);
//       setPaymentSuccess(true);
//       setSelectedFees([]);
      
//       // Refresh fees
//       await fetchFees(student._id);
      
//       setTimeout(() => setPaymentSuccess(false), 3000);
      
//     } catch (err) {
//       console.error("Payment error:", err);
//       setProcessingPayment(false);
//       alert("Payment failed. Please try again.");
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Paid": return "bg-green-100 text-green-800";
//       case "Partial": return "bg-yellow-100 text-yellow-800";
//       case "Pending": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Calculate totals
//   const totalMessDue = messFees.filter(f => f.status === "Pending").reduce((sum, f) => sum + (f.dueAmount || f.totalAmount || 0), 0);
//   const totalCanteenDue = canteenFees.filter(f => f.status === "Pending").reduce((sum, f) => sum + (f.dueAmount || f.totalAmount || 0), 0);
//   const totalDue = totalMessDue + totalCanteenDue;

//   // Login Form
//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
//           <div className="text-center mb-8">
//             <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaLock className="text-orange-600 text-3xl" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Login</h2>
//             <p className="text-gray-600">Enter your phone number to pay fees</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number *
//               </label>
//               <div className="relative">
//                 <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="tel"
//                   placeholder="Enter 10-digit phone number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
//                   maxLength="10"
//                   required
//                 />
//               </div>
//             </div>

//             {error && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-600">{error}</p>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
//                   <span>Verifying...</span>
//                 </>
//               ) : (
//                 <>
//                   <FaPhone />
//                   <span>Login & Continue</span>
//                 </>
//               )}
//             </button>
//           </form>

//           <p className="text-xs text-gray-500 text-center mt-4">
//             Your phone number is secure and only used for authentication
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Payment Success Message
//   if (paymentSuccess) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FaCheckCircle className="text-green-500 text-4xl" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
//           <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
//           <button
//             onClick={() => setPaymentSuccess(false)}
//             className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Student Info */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div className="flex items-center space-x-4">
//             <FaUserCircle className="text-orange-500 text-4xl" />
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">{student?.name}</h2>
//               <p className="text-gray-600">Phone: {student?.phone || student?.phoneNo}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-600">Total Due</p>
//               <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600">Mess Fee Due</p>
//               <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalMessDue)}</p>
//             </div>
//             <FaUtensils className="text-orange-500 text-3xl" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600">Canteen Fee Due</p>
//               <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalCanteenDue)}</p>
//             </div>
//             <FaCoffee className="text-orange-500 text-3xl" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600">Selected Fees</p>
//               <p className="text-2xl font-bold text-blue-600">{selectedFees.length}</p>
//             </div>
//             <FaCheckCircle className="text-blue-500 text-3xl" />
//           </div>
//         </div>
//       </div>

//       {/* Fee Selection Tabs */}
//       <div className="bg-white rounded-xl shadow">
//         <div className="border-b">
//           <nav className="flex space-x-4 px-6">
//             <button
//               onClick={() => setActiveTab("pending")}
//               className={`py-4 px-2 border-b-2 font-medium ${
//                 activeTab === "pending"
//                   ? "border-orange-500 text-orange-600"
//                   : "border-transparent text-gray-500"
//               }`}
//             >
//               Pending Fees
//             </button>
//             <button
//               onClick={() => setActiveTab("history")}
//               className={`py-4 px-2 border-b-2 font-medium ${
//                 activeTab === "history"
//                   ? "border-orange-500 text-orange-600"
//                   : "border-transparent text-gray-500"
//               }`}
//             >
//               Payment History
//             </button>
//           </nav>
//         </div>

//         <div className="p-6">
//           {activeTab === "pending" ? (
//             <div className="space-y-8">
//               {/* Mess Fees */}
//               {messFees.filter(f => f.status === "Pending").length > 0 && (
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold flex items-center">
//                       <FaUtensils className="mr-2 text-orange-500" />
//                       Mess Fee Pending
//                     </h3>
//                     <button
//                       onClick={() => handleSelectAll('mess')}
//                       className="text-sm text-orange-600 hover:text-orange-700"
//                     >
//                       Select All
//                     </button>
//                   </div>
//                   <div className="space-y-3">
//                     {messFees.filter(f => f.status === "Pending").map((fee) => (
//                       <div key={fee._id} className="border rounded-lg p-4 hover:shadow-md">
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start space-x-3">
//                             <input
//                               type="checkbox"
//                               checked={selectedFees.some(f => f._id === fee._id && f.feeType === 'mess')}
//                               onChange={() => handleFeeSelection(fee, 'mess')}
//                               className="mt-1 w-4 h-4 text-orange-500"
//                             />
//                             <div>
//                               <p className="font-semibold">{fee.month} {fee.year}</p>
//                               <p className="text-sm text-gray-600">Due Amount: {formatCurrency(fee.dueAmount || fee.totalAmount)}</p>
//                               {fee.dueDate && (
//                                 <p className="text-xs text-red-500">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
//                               )}
//                             </div>
//                           </div>
//                           <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(fee.status)}`}>
//                             {fee.status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Canteen Fees */}
//               {canteenFees.filter(f => f.status === "Pending").length > 0 && (
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold flex items-center">
//                       <FaCoffee className="mr-2 text-orange-500" />
//                       Canteen Fee Pending
//                     </h3>
//                     <button
//                       onClick={() => handleSelectAll('canteen')}
//                       className="text-sm text-orange-600 hover:text-orange-700"
//                     >
//                       Select All
//                     </button>
//                   </div>
//                   <div className="space-y-3">
//                     {canteenFees.filter(f => f.status === "Pending").map((fee) => (
//                       <div key={fee._id} className="border rounded-lg p-4 hover:shadow-md">
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start space-x-3">
//                             <input
//                               type="checkbox"
//                               checked={selectedFees.some(f => f._id === fee._id && f.feeType === 'canteen')}
//                               onChange={() => handleFeeSelection(fee, 'canteen')}
//                               className="mt-1 w-4 h-4 text-orange-500"
//                             />
//                             <div>
//                               <p className="font-semibold">{fee.month} {fee.year}</p>
//                               <p className="text-sm text-gray-600">Due Amount: {formatCurrency(fee.dueAmount || fee.totalAmount)}</p>
//                               {fee.dueDate && (
//                                 <p className="text-xs text-red-500">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
//                               )}
//                             </div>
//                           </div>
//                           <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(fee.status)}`}>
//                             {fee.status}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {messFees.filter(f => f.status === "Pending").length === 0 && 
//                canteenFees.filter(f => f.status === "Pending").length === 0 && (
//                 <div className="text-center py-8">
//                   <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
//                   <p className="text-gray-600">No pending fees found</p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Payment History */}
//               {[...messFees.filter(f => f.status === "Paid"), ...canteenFees.filter(f => f.status === "Paid")].map((fee) => (
//                 <div key={fee._id} className="border rounded-lg p-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="font-semibold">{fee.month} {fee.year}</p>
//                       <p className="text-sm text-gray-600">
//                         {fee.feeType || (fee.paymentMethod ? "Canteen" : "Mess")} Fee
//                       </p>
//                       <p className="text-xs text-gray-500">Paid on: {new Date(fee.paymentDate).toLocaleDateString()}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-green-600">{formatCurrency(fee.paidAmount)}</p>
//                       <p className="text-xs text-gray-500">Receipt: {fee.receiptNo}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payment Summary & Action */}
//       {selectedFees.length > 0 && (
//         <div className="bg-white rounded-xl shadow p-6 sticky bottom-0">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div>
//               <p className="text-gray-600">Selected Fees: {selectedFees.length}</p>
//               <p className="text-2xl font-bold text-gray-800">Total: {formatCurrency(calculateTotal())}</p>
//             </div>
//             <button
//               onClick={handleProceedToPayment}
//               className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 flex items-center space-x-2"
//             >
//               <FaRupeeSign />
//               <span>Proceed to Pay</span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Payment Modal */}
//       {showPaymentModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">Make Payment</h3>
//                 <button
//                   onClick={() => setShowPaymentModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>

//               <div className="mb-6 p-4 bg-orange-50 rounded-lg">
//                 <p className="text-sm text-gray-600">Total Amount</p>
//                 <p className="text-3xl font-bold text-orange-600">{formatCurrency(calculateTotal())}</p>
//               </div>

//               <form onSubmit={handlePaymentSubmit}>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Payment Method</label>
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         type="button"
//                         onClick={() => setPaymentMethod("card")}
//                         className={`p-3 border rounded-lg flex flex-col items-center ${
//                           paymentMethod === "card" ? "border-orange-500 bg-orange-50" : ""
//                         }`}
//                       >
//                         <FaCreditCard className="text-xl mb-1" />
//                         <span className="text-xs">Card</span>
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setPaymentMethod("upi")}
//                         className={`p-3 border rounded-lg flex flex-col items-center ${
//                           paymentMethod === "upi" ? "border-orange-500 bg-orange-50" : ""
//                         }`}
//                       >
//                         <FaWallet className="text-xl mb-1" />
//                         <span className="text-xs">UPI</span>
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setPaymentMethod("netbanking")}
//                         className={`p-3 border rounded-lg flex flex-col items-center ${
//                           paymentMethod === "netbanking" ? "border-orange-500 bg-orange-50" : ""
//                         }`}
//                       >
//                         <FaUniversity className="text-xl mb-1" />
//                         <span className="text-xs">Net Banking</span>
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setPaymentMethod("qr")}
//                         className={`p-3 border rounded-lg flex flex-col items-center ${
//                           paymentMethod === "qr" ? "border-orange-500 bg-orange-50" : ""
//                         }`}
//                       >
//                         <FaQrcode className="text-xl mb-1" />
//                         <span className="text-xs">QR Code</span>
//                       </button>
//                     </div>
//                   </div>

//                   {paymentMethod === "card" && (
//                     <div className="space-y-3">
//                       <input
//                         type="text"
//                         placeholder="Card Number"
//                         className="w-full p-3 border rounded-lg"
//                         required
//                       />
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           placeholder="MM/YY"
//                           className="p-3 border rounded-lg"
//                           required
//                         />
//                         <input
//                           type="text"
//                           placeholder="CVV"
//                           className="p-3 border rounded-lg"
//                           required
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {paymentMethod === "upi" && (
//                     <input
//                       type="text"
//                       placeholder="Enter UPI ID"
//                       className="w-full p-3 border rounded-lg"
//                       required
//                     />
//                   )}

//                   {paymentMethod === "netbanking" && (
//                     <select className="w-full p-3 border rounded-lg" required>
//                       <option value="">Select Bank</option>
//                       <option value="sbi">State Bank of India</option>
//                       <option value="hdfc">HDFC Bank</option>
//                       <option value="icici">ICICI Bank</option>
//                     </select>
//                   )}

//                   {paymentMethod === "qr" && (
//                     <div className="text-center p-4">
//                       <div className="w-48 h-48 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
//                         <FaQrcode className="text-6xl text-gray-400" />
//                       </div>
//                       <p className="text-sm">Scan with any UPI app</p>
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     disabled={processingPayment}
//                     className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center space-x-2"
//                   >
//                     {processingPayment ? (
//                       <>
//                         <FaSpinner className="animate-spin" />
//                         <span>Processing...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaRupeeSign />
//                         <span>Pay {formatCurrency(calculateTotal())}</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ==================== MESS FEE CONTENT COMPONENT ====================
// function MessFeeContent() {
//   const [phone, setPhone] = useState("");
//   const [fees, setFees] = useState([]);
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError("");
//     setFees([]);
//     setStudent(null);

//     if (phone.length < 10) {
//       setError("Enter valid phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       const studentRes = await axios.get(
//         `http://localhost:5000/api/students/phone/${phone}`
//       );
//       setStudent(studentRes.data);

//       const feeRes = await axios.get(
//         `http://localhost:5000/api/students/${studentRes.data._id}/mess-fees`
//       );
//       setFees(feeRes.data);

//     } catch (err) {
//       console.error("Search error:", err);
//       setError("Student not found or no records available");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalRecords = fees.length;
//   const totalAmount = fees.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
//   const totalPaid = fees.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
//   const totalDue = fees.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
//   const paidRecords = fees.filter(record => record.status === "Paid").length;
//   const pendingRecords = fees.filter(record => record.status === "Pending").length;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Paid": return "bg-green-100 text-green-800";
//       case "Partial": return "bg-yellow-100 text-yellow-800";
//       case "Pending": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPaymentMethodIcon = (method) => {
//     switch (method) {
//       case "Cash": return <FaMoneyBillWave className="text-green-600" />;
//       case "Online": return <FaRupeeSign className="text-blue-600" />;
//       case "Cheque": return <FaFileInvoice className="text-purple-600" />;
//       default: return <FaRupeeSign className="text-gray-600" />;
//     }
//   };

//   const handlePrint = () => window.print();

//   const handleDownload = () => {
//     if (fees.length === 0) {
//       alert("No data to download");
//       return;
//     }
    
//     const csvContent = "data:text/csv;charset=utf-8," + 
//       "Month,Year,Total Amount,Paid Amount,Due Amount,Payment Date,Payment Method,Status,Receipt No,Remarks\n" +
//       fees.map(row => 
//         `${row.month},${row.year},${row.totalAmount},${row.paidAmount},${row.dueAmount},"${row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : 'N/A'}",${row.paymentMethod},${row.status},${row.receiptNo || 'N/A'},"${row.remarks || ''}"`
//       ).join("\n");
    
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "mess_fee_report.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Mess Fee Records</h1>
//         <div className="text-sm text-gray-600">
//           Student Portal - View and manage mess fee payments
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Search Student by Phone Number</h2>
//         <form onSubmit={handleSearch} className="space-y-4">
//           <div className="flex gap-3">
//             <div className="flex-1 relative">
//               <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Enter student phone number (10 digits)"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
//                   <span>Searching...</span>
//                 </>
//               ) : (
//                 <>
//                   <FaSearch />
//                   <span>Search</span>
//                 </>
//               )}
//             </button>
//           </div>
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-600">{error}</p>
//             </div>
//           )}
//           <p className="text-sm text-gray-500">
//             Enter the student's registered phone number to view their mess fee records
//           </p>
//         </form>
//       </div>

//       {student && (
//         <>
//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
//                 <FaUserCircle className="text-blue-600 text-3xl" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-2xl font-bold text-gray-800">{student.name || "No Name"}</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
//                   <div>
//                     <p className="text-gray-600 text-sm">Phone Number</p>
//                     <p className="font-semibold">{student.phone || student.phoneNo || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Room Number</p>
//                     <p className="font-semibold">Room {student.roomNo || student.room || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Roll Number</p>
//                     <p className="font-semibold">{student.rollNo || student.rollNumber || "N/A"}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-blue-50 rounded-lg p-4">
//                 <p className="text-sm text-gray-600">Total Records</p>
//                 <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
//               </div>
//             </div>
//           </div>

//           {fees.length > 0 && (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Records</p>
//                       <p className="text-2xl font-bold text-gray-800">{totalRecords}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FaCalendarAlt className="text-blue-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Amount</p>
//                       <p className="text-2xl font-bold text-orange-600">₹{totalAmount.toLocaleString()}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
//                       <FaRupeeSign className="text-orange-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Paid</p>
//                       <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                       <FaCheckCircle className="text-green-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Due</p>
//                       <p className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                       <FaExclamation className="text-red-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow overflow-hidden">
//                 <div className="p-6 border-b">
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">Monthly Mess Fee Records</h3>
//                       <p className="text-gray-600 mt-1">
//                         Payment status and details for {student?.name}
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <button
//                         onClick={handlePrint}
//                         className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
//                       >
//                         <FaPrint />
//                         <span>Print</span>
//                       </button>
//                       <button
//                         onClick={handleDownload}
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
//                       >
//                         <FaDownload />
//                         <span>Download Report</span>
//                       </button>
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800`}>
//                         Paid: {paidRecords}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800`}>
//                         Pending: {pendingRecords}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="py-3 px-4 text-left">Month/Year</th>
//                         <th className="py-3 px-4 text-left">Total Amount</th>
//                         <th className="py-3 px-4 text-left">Paid Amount</th>
//                         <th className="py-3 px-4 text-left">Due Amount</th>
//                         <th className="py-3 px-4 text-left">Payment Date</th>
//                         <th className="py-3 px-4 text-left">Payment Method</th>
//                         <th className="py-3 px-4 text-left">Status</th>
//                         <th className="py-3 px-4 text-left">Receipt No</th>
//                         <th className="py-3 px-4 text-left">Remarks</th>
//                         <th className="py-3 px-4 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {fees.map((record) => (
//                         <tr key={record._id} className="border-t hover:bg-gray-50">
//                           <td className="py-3 px-4">
//                             <div className="font-medium">{record.month} {record.year}</div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="font-bold">₹{record.totalAmount?.toLocaleString() || "0"}</div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className={`font-bold ${
//                               (record.paidAmount || 0) > 0 ? 'text-green-600' : 'text-gray-600'
//                             }`}>
//                               ₹{record.paidAmount?.toLocaleString() || "0"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className={`font-bold ${
//                               (record.dueAmount || 0) > 0 ? 'text-red-600' : 'text-gray-600'
//                             }`}>
//                               ₹{record.dueAmount?.toLocaleString() || "0"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="text-gray-600">
//                               {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "Not Paid"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-lg">
//                                 {getPaymentMethodIcon(record.paymentMethod)}
//                               </span>
//                               <span>{record.paymentMethod || "Not specified"}</span>
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
//                               {record.status}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="text-blue-600 font-mono">{record.receiptNo || "N/A"}</div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="text-gray-600 max-w-xs truncate" title={record.remarks}>
//                               {record.remarks || "No remarks"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="flex space-x-2">
//                               {record.receiptNo && (
//                                 <button 
//                                   onClick={() => {
//                                     alert(`Receipt Number: ${record.receiptNo}\nMonth: ${record.month} ${record.year}\nAmount: ₹${record.paidAmount}\nDate: ${record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : 'N/A'}`);
//                                   }}
//                                   className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200" 
//                                   title="View Receipt"
//                                 >
//                                   <FaReceipt />
//                                 </button>
//                               )}
//                               {record.status === "Pending" && (
//                                 <button 
//                                   onClick={() => {
//                                     alert(`Redirecting to payment for ${record.month} ${record.year}...`);
//                                   }}
//                                   className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" 
//                                   title="Pay Now"
//                                 >
//                                   <FaRupeeSign />
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
                
//                 <div className="p-4 border-t bg-gray-50">
//                   <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                     <div className="text-gray-600">
//                       <span className="font-semibold">Summary:</span> {paidRecords} Paid Records • {pendingRecords} Pending Records
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       Last updated: {new Date().toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {!fees.length && (
//             <div className="bg-white rounded-xl shadow p-8 text-center">
//               <FaUtensils className="text-4xl text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-gray-800 mb-2">No Fee Records Found</h3>
//               <p className="text-gray-600">No mess fee records found for this student</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // ==================== CANTEEN FEE CONTENT COMPONENT ====================
// function CanteenFeeContent() {
//   const [phone, setPhone] = useState("");
//   const [fees, setFees] = useState([]);
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError("");
//     setFees([]);
//     setStudent(null);

//     if (phone.length < 10) {
//       setError("Enter valid phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       const studentRes = await axios.get(
//         `http://localhost:5000/api/students/phone/${phone}`
//       );
//       setStudent(studentRes.data);

//       const feeRes = await axios.get(
//         `http://localhost:5000/api/students/${studentRes.data._id}/canteen-fees`
//       );
//       setFees(feeRes.data);

//     } catch (err) {
//       console.error("Search error:", err);
//       setError("Student not found or no records available");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalRecords = fees.length;
//   const totalAmount = fees.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
//   const totalPaid = fees.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
//   const totalDue = fees.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
//   const paidRecords = fees.filter(record => record.status === "Paid").length;
//   const pendingRecords = fees.filter(record => record.status === "Pending").length;
//   const partialRecords = fees.filter(record => record.status === "Partial").length;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Paid": return "bg-green-100 text-green-800";
//       case "Partial": return "bg-yellow-100 text-yellow-800";
//       case "Pending": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPaymentMethodIcon = (method) => {
//     switch (method) {
//       case "Cash": return <FaMoneyBillWave className="text-green-600" />;
//       case "Online": return <FaRupeeSign className="text-blue-600" />;
//       case "Cheque": return <FaFileInvoice className="text-purple-600" />;
//       default: return <FaRupeeSign className="text-gray-600" />;
//     }
//   };

//   const handlePrint = () => window.print();

//   const handleDownload = () => {
//     if (fees.length === 0) {
//       alert("No data to download");
//       return;
//     }
    
//     const csvContent = "data:text/csv;charset=utf-8," + 
//       "Month,Year,Total Amount,Paid Amount,Due Amount,Payment Date,Payment Method,Status,Receipt No,Remarks\n" +
//       fees.map(row => 
//         `${row.month},${row.year},${row.totalAmount},${row.paidAmount},${row.dueAmount},"${row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : 'N/A'}",${row.paymentMethod},${row.status},${row.receiptNo || 'N/A'},"${row.remarks || ''}"`
//       ).join("\n");
    
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "canteen_fee_report.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Canteen Fee Records</h1>
//         <div className="text-sm text-gray-600">
//           Student Portal - View and manage canteen fee payments
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Search Student by Phone Number</h2>
//         <form onSubmit={handleSearch} className="space-y-4">
//           <div className="flex gap-3">
//             <div className="flex-1 relative">
//               <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Enter student phone number (10 digits)"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
//                   <span>Searching...</span>
//                 </>
//               ) : (
//                 <>
//                   <FaSearch />
//                   <span>Search</span>
//                 </>
//               )}
//             </button>
//           </div>
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-600">{error}</p>
//             </div>
//           )}
//           <p className="text-sm text-gray-500">
//             Enter the student's registered phone number to view their canteen fee records
//           </p>
//         </form>
//       </div>

//       {student && (
//         <>
//           <div className="bg-white rounded-xl shadow p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
//                 <FaUserCircle className="text-blue-600 text-3xl" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-2xl font-bold text-gray-800">{student.name || "No Name"}</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
//                   <div>
//                     <p className="text-gray-600 text-sm">Phone Number</p>
//                     <p className="font-semibold">{student.phone || student.phoneNo || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Room Number</p>
//                     <p className="font-semibold">Room {student.roomNo || student.room || "N/A"}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Roll Number</p>
//                     <p className="font-semibold">{student.rollNo || student.rollNumber || "N/A"}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-blue-50 rounded-lg p-4">
//                 <p className="text-sm text-gray-600">Total Records</p>
//                 <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
//               </div>
//             </div>
//           </div>

//           {fees.length > 0 && (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Records</p>
//                       <p className="text-2xl font-bold text-gray-800">{totalRecords}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FaCalendarAlt className="text-blue-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Amount</p>
//                       <p className="text-2xl font-bold text-orange-600">₹{totalAmount.toLocaleString()}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
//                       <FaRupeeSign className="text-orange-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Paid</p>
//                       <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                       <FaCheckCircle className="text-green-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-xl shadow p-5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-600">Total Due</p>
//                       <p className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                       <FaExclamation className="text-red-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl shadow overflow-hidden">
//                 <div className="p-6 border-b">
//                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">Monthly Canteen Fee Records</h3>
//                       <p className="text-gray-600 mt-1">
//                         Payment status and details for {student?.name}
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <button
//                         onClick={handlePrint}
//                         className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
//                       >
//                         <FaPrint />
//                         <span>Print</span>
//                       </button>
//                       <button
//                         onClick={handleDownload}
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
//                       >
//                         <FaDownload />
//                         <span>Download Report</span>
//                       </button>
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800`}>
//                         Paid: {paidRecords}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800`}>
//                         Partial: {partialRecords}
//                       </span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800`}>
//                         Pending: {pendingRecords}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="py-3 px-4 text-left">Month/Year</th>
//                         <th className="py-3 px-4 text-left">Total Amount</th>
//                         <th className="py-3 px-4 text-left">Paid Amount</th>
//                         <th className="py-3 px-4 text-left">Due Amount</th>
//                         <th className="py-3 px-4 text-left">Payment Date</th>
//                         <th className="py-3 px-4 text-left">Payment Method</th>
//                         <th className="py-3 px-4 text-left">Status</th>
//                         <th className="py-3 px-4 text-left">Receipt No</th>
//                         <th className="py-3 px-4 text-left">Remarks</th>
//                         <th className="py-3 px-4 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {fees.map((record) => (
//                         <tr key={record._id} className="border-t hover:bg-gray-50">
//                           <td className="py-3 px-4">
//                             <div className="font-medium">{record.month} {record.year}</div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="font-bold">₹{record.totalAmount?.toLocaleString() || "0"}</div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className={`font-bold ${
//                               (record.paidAmount || 0) > 0 ? 'text-green-600' : 'text-gray-600'
//                             }`}>
//                               ₹{record.paidAmount?.toLocaleString() || "0"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className={`font-bold ${
//                               (record.dueAmount || 0) > 0 ? 'text-red-600' : 'text-gray-600'
//                             }`}>
//                               ₹{record.dueAmount?.toLocaleString() || "0"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="text-gray-600">
//                               {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "Not Paid"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="flex items-center space-x-2">
//                               <span className="text-lg">
//                                 {getPaymentMethodIcon(record.paymentMethod)}
//                               </span>
//                               <span>{record.paymentMethod || "Not specified"}</span>
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
//                               {record.status}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="text-blue-600 font-mono">{record.receiptNo || "N/A"}</div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="text-gray-600 max-w-xs truncate" title={record.remarks}>
//                               {record.remarks || "No remarks"}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4">
//                             <div className="flex space-x-2">
//                               {record.receiptNo && (
//                                 <button 
//                                   onClick={() => {
//                                     alert(`Receipt Number: ${record.receiptNo}\nMonth: ${record.month} ${record.year}\nAmount: ₹${record.paidAmount}\nDate: ${record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : 'N/A'}`);
//                                   }}
//                                   className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200" 
//                                   title="View Receipt"
//                                 >
//                                   <FaReceipt />
//                                 </button>
//                               )}
//                               {record.status === "Pending" && (
//                                 <button 
//                                   onClick={() => {
//                                     alert(`Redirecting to payment for ${record.month} ${record.year}...`);
//                                   }}
//                                   className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200" 
//                                   title="Pay Now"
//                                 >
//                                   <FaRupeeSign />
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
                
//                 <div className="p-4 border-t bg-gray-50">
//                   <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                     <div className="text-gray-600">
//                       <span className="font-semibold">Summary:</span> {paidRecords} Paid • {partialRecords} Partial • {pendingRecords} Pending
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       Last updated: {new Date().toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {!fees.length && (
//             <div className="bg-white rounded-xl shadow p-8 text-center">
//               <FaCoffee className="text-4xl text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-gray-800 mb-2">No Fee Records Found</h3>
//               <p className="text-gray-600">No canteen fee records found for this student</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // Other content components (simplified)
// function MyAccountContent() {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Account</h1>
//       <div className="bg-white rounded-xl shadow p-6">
//         <p>My Account content will go here...</p>
//       </div>
//     </div>
//   );
// }

// function DefaultContent() {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome to Student Panel</h1>
//       <div className="bg-white rounded-xl shadow p-6">
//         <p>Select a menu option from the sidebar to get started.</p>
//       </div>
//     </div>
//   );
// }