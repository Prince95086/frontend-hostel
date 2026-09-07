import React, { useState } from "react";
import { 
  FaFan, 
  FaBolt, 
  FaBroom, 
  FaPaintRoller, 
  FaCouch, 
  FaUtensils, 
  FaTint, 
  FaWifi, 
  FaTshirt, 
  FaCog, 
  FaArrowRight,
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaBuilding,
  FaDoorClosed,
  FaCalendar,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaSpinner,
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaHashtag
} from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// UPDATED: Using Render URL as fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://hostel-backend-1-vc4l.onrender.com/api";

const AdminOptions = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedComplaints, setExpandedComplaints] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const options = [
    { 
      name: "Fan Management", 
      icon: FaFan,
      description: "Control and monitor fan systems",
      color: "from-blue-500 to-cyan-500",
      category: "fan",
      apiCategory: "fan"
    },
    { 
      name: "Electricity", 
      icon: FaBolt,
      description: "Manage power distribution and usage",
      color: "from-purple-500 to-pink-500",
      category: "electricity",
      apiCategory: "electricity"
    },
    { 
      name: "Cleaning", 
      icon: FaBroom,
      description: "Schedule and track cleaning services",
      color: "from-blue-500 to-cyan-500",
      category: "cleaning",
      apiCategory: "cleaning"
    },
    { 
      name: "Painting", 
      icon: FaPaintRoller,
      description: "Coordinate maintenance painting",
      color: "from-purple-500 to-pink-500",
      category: "painting",
      apiCategory: "painting"
    },
    { 
      name: "Furniture", 
      icon: FaCouch,
      description: "Manage furniture inventory and repairs",
      color: "from-blue-500 to-cyan-500",
      category: "furniture",
      apiCategory: "furniture"
    },
    { 
      name: "Food Services", 
      icon: FaUtensils,
      description: "Oversee mess and food operations",
      color: "from-purple-500 to-pink-500",
      category: "food",
      apiCategory: "food"
    },
    { 
      name: "Water Supply", 
      icon: FaTint,
      description: "Monitor water distribution systems",
      color: "from-cyan-500 to-blue-500",
      category: "water",
      apiCategory: "water"
    },
    { 
      name: "WiFi Management", 
      icon: FaWifi,
      description: "Manage internet connectivity and networks",
      color: "from-purple-500 to-pink-500",
      category: "wifi",
      apiCategory: "wifi"
    },
    { 
      name: "Laundry Services", 
      icon: FaTshirt,
      description: "Oversee washing machines and laundry",
      color: "from-red-500 to-blue-500",
      category: "laundry",
      apiCategory: "laundry"
    },
  ];

  const fetchComplaints = async (category, option) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(category);
    setSelectedOption(option);
    setExpandedComplaints({});
    setUpdatingStatus({});
    
    try {
      const res = await axios.get(
        `${API_BASE_URL}/complaints/category/${category}`
      );
      console.log("Fetched complaints data:", res.data);
      
      if (res.data.success) {
        setComplaints(res.data.data || []);
        toast.success(`Loaded ${res.data.data?.length || 0} complaints`);
      } else {
        setError(res.data.message || "Failed to fetch complaints");
        setComplaints([]);
        toast.error(res.data.message || "Failed to fetch complaints");
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.response?.data?.message || err.message || "Failed to connect to server");
      setComplaints([]);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    fetchComplaints(option.apiCategory || option.category, option);
  };

  const closeComplaintsPanel = () => {
    setComplaints([]);
    setSelectedCategory(null);
    setSelectedOption(null);
    setError(null);
    setExpandedComplaints({});
    setUpdatingStatus({});
    setShowConfirmation(false);
    setSelectedComplaint(null);
  };

  const toggleComplaintExpand = (complaintId) => {
    setExpandedComplaints(prev => ({
      ...prev,
      [complaintId]: !prev[complaintId]
    }));
  };

  const confirmUpdateStatus = (complaint) => {
    if (complaint.status?.toLowerCase() !== 'pending') {
      toast.warning("Only pending complaints can be marked as completed.");
      return;
    }
    
    setSelectedComplaint(complaint);
    setShowConfirmation(true);
  };

  const updateComplaintStatus = async (confirmed) => {
    if (!confirmed || !selectedComplaint) {
      setShowConfirmation(false);
      setSelectedComplaint(null);
      return;
    }

    const complaintId = selectedComplaint._id;
    setUpdatingStatus(prev => ({ ...prev, [complaintId]: true }));
    
    try {
      const newStatus = "completed";
      const res = await axios.put(
        `${API_BASE_URL}/complaints/${complaintId}/status`,
        { status: newStatus }
      );

      if (res.data.success) {
        // Update the local state
        setComplaints(prev => prev.map(complaint => 
          complaint._id === complaintId 
            ? { ...complaint, status: newStatus, updatedAt: new Date().toISOString() }
            : complaint
        ));
        
        // Show success toast
        toast.success(`Complaint #${complaintId.slice(-6)} marked as completed`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(res.data.message || "Failed to update status", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Failed to update complaint status", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: false }));
      setShowConfirmation(false);
      setSelectedComplaint(null);
    }
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
        return <FaExclamationCircle className="text-blue-500" />;
      default:
        return <FaExclamationCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
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

  const renderDataValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (typeof value === 'boolean') return value ? "Yes" : "No";
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  const getAllDataFields = (complaint) => {
    const excludeFields = ['_id', '__v'];
    return Object.keys(complaint)
      .filter(key => !excludeFields.includes(key))
      .sort();
  };

  // Helper function to get student name from complaint
  const getStudentName = (complaint) => {
    return complaint.name || complaint.userName || complaint.studentName || complaint.userId || "Anonymous";
  };

  // Helper function to get room number from complaint
  const getRoomNumber = (complaint) => {
    return complaint.roomNo || complaint.roomNumber || complaint.room || "N/A";
  };

  // Helper function to get block number from complaint
  const getBlockNumber = (complaint) => {
    return complaint.block || complaint.blockNo || "N/A";
  };

  // Helper function to get hostel from complaint
  const getHostel = (complaint) => {
    return complaint.hostel || complaint.hostelName || "N/A";
  };

  // Helper function to get roll number from complaint
  const getRollNumber = (complaint) => {
    return complaint.rollNo || complaint.rollNumber || "N/A";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 relative overflow-hidden">
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

      {/* Confirmation Dialog */}
      {showConfirmation && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                <FaQuestionCircle className="text-yellow-500 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Confirm Status Update</h3>
                <p className="text-gray-600">Mark this complaint as completed?</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">Complaint ID:</span>
                <span className="font-mono">{selectedComplaint._id?.slice(-8)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">Category:</span>
                <span className="capitalize">{selectedCategory}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">Student:</span>
                <span>{getStudentName(selectedComplaint)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Location:</span>
                <span>{getHostel(selectedComplaint)}, {getBlockNumber(selectedComplaint)} - Room {getRoomNumber(selectedComplaint)}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => updateComplaintStatus(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => updateComplaintStatus(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center space-x-2"
              >
                <FaCheckCircle />
                <span>Yes, Mark as Completed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full blur-xl opacity-20 animate-bounce"></div>

      <div className="max-w-6xl w-full relative z-10 mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-500">
            <FaCog className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Admin Control Panel
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage all hostel operations and maintenance services from one centralized dashboard
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {options.map((option, index) => (
            <div
              key={index}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 overflow-hidden cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="p-6 relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <option.icon className="text-white text-2xl" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                  {option.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {option.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm font-medium">View Complaints</span>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                    <FaArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
              
              <div className={`h-1 bg-gradient-to-r ${option.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Complaints Panel */}
        {selectedOption && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Panel Header */}
              <div className={`bg-gradient-to-r ${selectedOption.color} p-6 text-white`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <selectedOption.icon className="text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedOption.name} Complaints</h2>
                      <p className="text-white/80">{selectedOption.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeComplaintsPanel}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Panel Stats */}
              <div className="border-b border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {complaints.length} complaints • Last updated: {new Date().toLocaleTimeString()}
                </div>
                <div className="flex space-x-2 text-sm">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    Pending: {complaints.filter(c => c.status?.toLowerCase() === 'pending').length}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Completed: {complaints.filter(c => c.status?.toLowerCase() === 'completed' || c.status?.toLowerCase() === 'resolved').length}
                  </span>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center p-8">
                    <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Complaints</h3>
                    <p className="text-gray-600">{error}</p>
                    <button
                      onClick={() => fetchComplaints(selectedOption.apiCategory, selectedOption)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="text-center p-8">
                    <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Complaints Found</h3>
                    <p className="text-gray-600">There are no complaints for this category.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint, index) => {
                      const complaintId = complaint._id || index;
                      return (
                        <div
                          key={complaintId}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(complaint.status)}
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {complaint.title || `Complaint #${complaint.complaintId || complaint._id?.slice(-6)}`}
                                </h4>
                                <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 mt-2">
                                  <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                                    <FaUser className="text-blue-400 text-xs" />
                                    <span className="font-medium">{getStudentName(complaint)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                                    <FaHashtag className="text-green-400 text-xs" />
                                    <span>Roll No: {getRollNumber(complaint)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 bg-purple-50 px-3 py-1 rounded-full">
                                    <FaDoorClosed className="text-purple-400 text-xs" />
                                    <span>Room: {getRoomNumber(complaint)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-full">
                                    <FaMapMarkerAlt className="text-orange-400 text-xs" />
                                    <span>Block: {getBlockNumber(complaint)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 bg-red-50 px-3 py-1 rounded-full">
                                    <FaBuilding className="text-red-400 text-xs" />
                                    <span>Hostel: {getHostel(complaint)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => confirmUpdateStatus(complaint)}
                                  disabled={complaint.status?.toLowerCase() !== 'pending' || updatingStatus[complaint._id]}
                                  className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(complaint.status)} ${
                                    complaint.status?.toLowerCase() === 'pending' 
                                      ? 'hover:bg-yellow-200 cursor-pointer' 
                                      : 'cursor-default'
                                  } ${updatingStatus[complaint._id] ? 'opacity-50' : ''}`}
                                >
                                  {updatingStatus[complaint._id] ? (
                                    <>
                                      <FaSpinner className="animate-spin" />
                                      <span>Updating...</span>
                                    </>
                                  ) : (
                                    <>
                                      {getStatusIcon(complaint.status)}
                                      <span>{getStatusText(complaint.status)}</span>
                                      {complaint.status?.toLowerCase() === 'pending' && (
                                        <FaCheck className="ml-1 text-yellow-600" />
                                      )}
                                    </>
                                  )}
                                </button>
                              </div>
                              <button
                                onClick={() => toggleComplaintExpand(complaintId)}
                                className="text-blue-500 hover:text-blue-700 text-sm flex items-center space-x-1"
                              >
                                {expandedComplaints[complaintId] ? <FaEyeSlash /> : <FaEye />}
                                <span>{expandedComplaints[complaintId] ? "Show Less" : "Show All Data"}</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-3 mb-4">
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                              {complaint.description || complaint.message || "No description provided"}
                            </p>
                          </div>
                          
                          {expandedComplaints[complaintId] && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                                <FaInfoCircle className="text-blue-500" />
                                <span>All Complaint Data</span>
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {getAllDataFields(complaint).map((field) => (
                                  <div key={field} className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="font-medium text-gray-600 capitalize">
                                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                    </span>
                                    <span className="text-gray-800 text-right">
                                      {renderDataValue(complaint[field])}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-1">
                              <FaCalendar className="text-gray-400" />
                              <span>Created: {formatDate(complaint.createdAt || complaint.createdDate)}</span>
                              {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                                <span className="ml-4">
                                  Updated: {formatDate(complaint.updatedAt)}
                                </span>
                              )}
                            </div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              ID: {complaint._id?.slice(-8) || index}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">{complaints.length}</span> total complaints • 
                    <span className="ml-2">
                      <span className="text-yellow-600">
                        {complaints.filter(c => c.status?.toLowerCase() === 'pending').length} pending
                      </span>
                    </span> • 
                    <span className="ml-2 text-green-600">
                      {complaints.filter(c => c.status?.toLowerCase() === 'completed' || c.status?.toLowerCase() === 'resolved').length} completed
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={closeComplaintsPanel}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Bar */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600 text-sm">Support Available</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-gray-600 text-sm">System Uptime</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{options.length}</div>
              <div className="text-gray-600 text-sm">Services</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">30m</div>
              <div className="text-gray-600 text-sm">Avg Response Time</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Panjab University Hostel Management System • Admin Portal v2.4.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOptions;