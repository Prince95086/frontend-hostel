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
  FaSpinner,
  FaPhone,
  FaDoorClosed,
  FaHashtag,
  FaBuilding,
  FaClock,
  FaList,
  FaCheckDouble,
  FaHistory
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";
import axios from "axios";

// UPDATED: Using Render URL as fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://hostel-backend-1-vc4l.onrender.com/api";

// ==================== COMPLAINTS COMPONENT (Base) ====================
function ComplaintsBase({ statusFilter, title, icon: Icon, colorScheme }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [expandedComplaints, setExpandedComplaints] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    inProgress: 0
  });

  const colors = {
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
      button: "bg-yellow-500",
      buttonHover: "hover:bg-yellow-600",
      ring: "focus:ring-yellow-500",
      icon: "text-yellow-500",
      lightBg: "bg-yellow-100",
      lightText: "text-yellow-600"
    },
    completed: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      button: "bg-green-500",
      buttonHover: "hover:bg-green-600",
      ring: "focus:ring-green-500",
      icon: "text-green-500",
      lightBg: "bg-green-100",
      lightText: "text-green-600"
    }
  };

  const theme = colors[colorScheme] || colors.pending;

  // Check if already logged in from sign-in page
  useEffect(() => {
    const storedStudent = localStorage.getItem("studentInfo") || sessionStorage.getItem("studentInfo");
    const storedPhone = localStorage.getItem("studentPhone") || sessionStorage.getItem("studentPhone");
    const storedRollNo = localStorage.getItem("studentRollNo") || sessionStorage.getItem("studentRollNo");
    
    if (storedStudent) {
      try {
        const studentData = JSON.parse(storedStudent);
        setStudentInfo(studentData);
        
        // Determine phone number from various sources
        let phoneToUse = storedPhone || studentData.phone || studentData.phoneNo;
        
        if (phoneToUse) {
          setPhoneNumber(phoneToUse);
          // Auto-fetch complaints for this phone number
          fetchComplaintsByPhone(phoneToUse);
        } else if (storedRollNo || studentData.rollNo) {
          // If no phone, try using roll number
          const rollToUse = storedRollNo || studentData.rollNo;
          fetchComplaintsByRollNo(rollToUse);
        }
      } catch (e) {
        console.error("Error parsing student info:", e);
      }
    }
  }, []);

  // Fetch complaints by phone number
  const fetchComplaintsByPhone = async (phone) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/studentcomplaints/phone/${phone}`
      );
      
      if (response.data) {
        let complaintsData = [];
        
        if (response.data.success && response.data.data) {
          complaintsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          complaintsData = response.data;
        } else if (response.data.complaints) {
          complaintsData = response.data.complaints;
        } else {
          complaintsData = response.data;
        }
        
        setComplaints(complaintsData);
        
        // Calculate statistics
        const pending = complaintsData.filter(c => c.status?.toLowerCase() === 'pending').length;
        const completed = complaintsData.filter(c => c.status?.toLowerCase() === 'completed' || c.status?.toLowerCase() === 'resolved').length;
        const inProgress = complaintsData.filter(c => c.status?.toLowerCase() === 'in progress' || c.status?.toLowerCase() === 'in-progress').length;
        
        setStats({
          total: complaintsData.length,
          pending,
          completed,
          inProgress
        });
        
        if (response.data.student) {
          setStudentInfo(response.data.student);
        } else if (complaintsData.length > 0) {
          const firstComplaint = complaintsData[0];
          setStudentInfo({
            name: firstComplaint.name || firstComplaint.studentName,
            rollNo: firstComplaint.rollNo || firstComplaint.rollNumber,
            roomNo: firstComplaint.roomNo || firstComplaint.room,
            hostel: firstComplaint.hostel,
            block: firstComplaint.block
          });
        }
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      if (err.response?.status === 404) {
        setError("No complaints found");
      } else {
        setError(err.response?.data?.message || "Failed to fetch complaints");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints by roll number
  const fetchComplaintsByRollNo = async (rollNo) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/studentcomplaints/rollno/${rollNo}`
      );
      
      if (response.data) {
        let complaintsData = [];
        
        if (response.data.success && response.data.data) {
          complaintsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          complaintsData = response.data;
        } else if (response.data.complaints) {
          complaintsData = response.data.complaints;
        } else {
          complaintsData = response.data;
        }
        
        setComplaints(complaintsData);
        
        const pending = complaintsData.filter(c => c.status?.toLowerCase() === 'pending').length;
        const completed = complaintsData.filter(c => c.status?.toLowerCase() === 'completed' || c.status?.toLowerCase() === 'resolved').length;
        const inProgress = complaintsData.filter(c => c.status?.toLowerCase() === 'in progress' || c.status?.toLowerCase() === 'in-progress').length;
        
        setStats({
          total: complaintsData.length,
          pending,
          completed,
          inProgress
        });
        
        if (response.data.student) {
          setStudentInfo(response.data.student);
        } else if (complaintsData.length > 0) {
          const firstComplaint = complaintsData[0];
          setStudentInfo({
            name: firstComplaint.name || firstComplaint.studentName,
            rollNo: firstComplaint.rollNo || firstComplaint.rollNumber,
            roomNo: firstComplaint.roomNo || firstComplaint.room,
            hostel: firstComplaint.hostel,
            block: firstComplaint.block
          });
        }
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSearch = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }
    
    const cleanedPhone = phoneNumber.replace(/\s/g, '');
    if (cleanedPhone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    setError(null);
    fetchComplaintsByPhone(cleanedPhone);
  };

  const toggleComplaintExpand = (complaintId) => {
    setExpandedComplaints(prev => ({
      ...prev,
      [complaintId]: !prev[complaintId]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'completed':
      case 'resolved':
        return <FaCheckCircle className="text-green-500" />;
      case 'in progress':
      case 'in-progress':
        return <FaExclamationTriangle className="text-blue-500" />;
      default:
        return <FaExclamationTriangle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'resolved':
        return 'Resolved';
      case 'in progress':
      case 'in-progress':
        return 'In Progress';
      default:
        return status || 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStudentName = (complaint) => {
    return complaint.name || complaint.userName || complaint.studentName || "Anonymous";
  };

  const getRoomNumber = (complaint) => {
    return complaint.roomNo || complaint.roomNumber || complaint.room || "N/A";
  };

  const getBlockNumber = (complaint) => {
    return complaint.block || complaint.blockNo || "N/A";
  };

  const getHostel = (complaint) => {
    return complaint.hostel || complaint.hostelName || "N/A";
  };

  const getRollNumber = (complaint) => {
    return complaint.rollNo || complaint.rollNumber || "N/A";
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'fan':
        return '🔧';
      case 'electricity':
        return '⚡';
      case 'cleaning':
        return '🧹';
      case 'painting':
        return '🎨';
      case 'furniture':
        return '🪑';
      case 'food':
        return '🍲';
      case 'water':
        return '💧';
      case 'wifi':
        return '📶';
      case 'laundry':
        return '👕';
      default:
        return '📋';
    }
  };

  // Filter complaints based on status
  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === 'pending') return c.status?.toLowerCase() === 'pending';
    if (statusFilter === 'completed') return c.status?.toLowerCase() === 'completed' || c.status?.toLowerCase() === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {studentInfo ? `Welcome, ${studentInfo.name}` : `View all ${title.toLowerCase()}`}
          </p>
        </div>
        <div className={`flex items-center gap-2 ${theme.bg} ${theme.text} px-4 py-2 rounded-full`}>
          <Icon className={theme.icon} />
          <span className="font-semibold">{filteredComplaints.length} {statusFilter === 'pending' ? 'Pending' : 'Completed'}</span>
        </div>
      </div>

      {/* Search Section - Only show if NOT logged in and no data loaded */}
      {!studentInfo && !searchPerformed && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handlePhoneSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter student phone number (10 digits)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
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
          </form>
          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}
      
      {/* Student Info Display - Show when logged in */}
      {studentInfo && (
        <div className={`${theme.bg} rounded-xl shadow-lg p-6 border ${theme.border}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${theme.lightBg} rounded-full flex items-center justify-center`}>
                <FaUserCircle className={`${theme.lightText} text-3xl`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme.text}`}>{studentInfo.name}</h2>
                <p className={theme.lightText}>Roll No: {studentInfo.rollNo || studentInfo.rollNumber} • Room: {studentInfo.roomNo}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className={`${theme.lightBg} ${theme.text} px-4 py-2 rounded-full`}>
                Block: {studentInfo.block}
              </span>
              <span className={`${theme.lightBg} ${theme.text} px-4 py-2 rounded-full`}>
                {studentInfo.hostel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {searchPerformed && (
        <div className="space-y-6">
          {/* Stats Cards */}
          {complaints.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Complaints</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaList className="text-blue-500 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FaClock className="text-yellow-500 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-green-500 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-blue-500 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <FaSpinner className={`animate-spin text-4xl ${theme.icon} mx-auto mb-4`} />
              <p className="text-gray-600">Loading complaints...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* No Complaints State */}
          {!loading && !error && complaints.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Complaints Found</h3>
              <p className="text-gray-600">You haven't submitted any complaints yet.</p>
            </div>
          )}

          {/* Filtered Complaints List */}
          {!loading && !error && filteredComplaints.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Icon className={theme.icon} />
                {title} ({filteredComplaints.length})
              </h2>
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className={`bg-white rounded-xl shadow-sm border ${theme.border} p-6 hover:shadow-md transition-shadow border-l-4 border-l-${colorScheme === 'pending' ? 'yellow' : 'green'}-500`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(complaint.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {complaint.title || `Complaint #${complaint._id?.slice(-6)}`}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                            {getStatusText(complaint.status)}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                            <span>{getCategoryIcon(complaint.category)}</span>
                            {complaint.category || "General"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleComplaintExpand(complaint._id)}
                      className={`${theme.text} hover:${theme.text} text-sm flex items-center gap-1`}
                    >
                      {expandedComplaints[complaint._id] ? 'Show Less' : 'View Details'}
                    </button>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      {complaint.description || complaint.message || "No description provided"}
                    </p>
                  </div>

                  {/* Student Details - Always visible */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <FaUserCircle className={theme.icon} />
                      <span className="text-gray-600">{getStudentName(complaint)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaHashtag className="text-blue-500" />
                      <span className="text-gray-600">Roll: {getRollNumber(complaint)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaDoorClosed className="text-green-500" />
                      <span className="text-gray-600">Room: {getRoomNumber(complaint)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaBuilding className="text-orange-500" />
                      <span className="text-gray-600">Block: {getBlockNumber(complaint)}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedComplaints[complaint._id] && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-3">Additional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Hostel</p>
                          <p className="font-medium">{getHostel(complaint)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium capitalize">{complaint.category || "General"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created</p>
                          <p className="font-medium">{formatDate(complaint.createdAt)}</p>
                        </div>
                        {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                          <div>
                            <p className="text-sm text-gray-500">Last Updated</p>
                            <p className="font-medium">{formatDate(complaint.updatedAt)}</p>
                          </div>
                        )}
                        {complaint.resolvedAt && (
                          <div>
                            <p className="text-sm text-gray-500">Resolved On</p>
                            <p className="font-medium">{formatDate(complaint.resolvedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>Submitted: {formatDate(complaint.createdAt || complaint.createdDate)}</span>
                    </div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                      ID: {complaint._id?.slice(-8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Filtered Complaints State */}
          {!loading && !error && complaints.length > 0 && filteredComplaints.length === 0 && (
            <div className={`${theme.bg} rounded-xl shadow-lg p-12 text-center border ${theme.border}`}>
              <Icon className={`text-5xl ${theme.icon} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>No {statusFilter === 'pending' ? 'Pending' : 'Completed'} Complaints!</h3>
              <p className="text-gray-600 mb-4">
                {statusFilter === 'pending' 
                  ? 'All your complaints have been resolved or are in progress.' 
                  : 'You have not completed any complaints yet.'}
              </p>
              {statusFilter === 'pending' && (
                <div className="flex justify-center gap-4">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                    Completed: {stats.completed}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                    In Progress: {stats.inProgress}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== PENDING COMPLAIN COMPONENT ====================
function PendingComplain() {
  return (
    <ComplaintsBase 
      statusFilter="pending"
      title="Pending Complaints"
      icon={FaClock}
      colorScheme="pending"
    />
  );
}

// ==================== COMPLETED COMPLAIN COMPONENT ====================
function CompletedComplain() {
  return (
    <ComplaintsBase 
      statusFilter="completed"
      title="Completed Complaints"
      icon={FaCheckCircle}
      colorScheme="completed"
    />
  );
}

// ==================== MAIN LAYOUT COMPONENT ====================
export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() => {
    // Initialize active menu based on current path
    const path = window.location.pathname;
    if (path === "/admin/pending-complaint") return "Pending Complain";
    if (path === "/my-account") return "My Account";
    if (path === "/pay-fee") return "Pay Fee";
    if (path === "/mess-fee") return "Mess Fee";
    if (path === "/canteen-fee") return "Canteen Fee";
    if (path === "/admin/reports") return "Reports";
    if (path === "/admin/total-complaint") return "Function";
    if (path === "/student-setting") return "Setting";
    return "My Account";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

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
        const id = savedId || savedRollNo || studentData.rollNo || studentData.rollNumber || studentData._id;
        setStudentId(id);
        setIsLoggedIn(true);
      } catch (e) {
        console.log("Error parsing student info:", e);
      }
    }
  }, []);

  /* ---------- SIDEBAR MENU (EXACTLY AS IN YOUR ORIGINAL CODE) ---------- */
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
    setIsLoggedIn(false);
    setStudentInfo(null);
    setStudentId("");
    
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("studentId");
    localStorage.removeItem("token");
    localStorage.removeItem("studentPhone");
    localStorage.removeItem("studentRollNo");
    
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

  // Set active menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find(item => item.path === currentPath);
    if (currentMenuItem) {
      setActiveMenu(currentMenuItem.label);
    }
  }, [location.pathname]);

  // Render content based on path
  const renderContent = () => {
    // If we're on the pending complaint page
    if (location.pathname === "/admin/pending-complaint") {
      return (
        <div className="space-y-6">
          {/* Two buttons for switching between Pending and Completed */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "pending"
                  ? "bg-yellow-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaClock />
              Pending Complaints
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "completed"
                  ? "bg-green-500 text-white shadow-lg scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FaCheckCircle />
              Completed Complaints
            </button>
          </div>

          {/* Render based on active tab */}
          {activeTab === "pending" ? <PendingComplain /> : <CompletedComplain />}
        </div>
      );
    }
    
    // For all other paths, render the outlet
    return <Outlet />;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ================= SIDEBAR (EXACTLY AS IN YOUR ORIGINAL CODE) ================= */}
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
                <p className="text-sm opacity-90">ID: {studentId}</p>
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
                  {isLoggedIn && studentInfo && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 truncate">{studentInfo.name || "Student"}</p>
                      <p className="text-sm text-gray-500 truncate">ID: {studentId}</p>
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
                      <FaTimesCircle />
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