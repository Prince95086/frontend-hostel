// File: AdminFunction.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUsers as FaGuests,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";
import axios from "axios";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function AdminFunction() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFunctionModal, setShowFunctionModal] = useState(false);
  const [functions, setFunctions] = useState([]);
  const [functionForm, setFunctionForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "18:00",
    venue: "Hostel Common Hall",
    organizer: "",
    contact: "",
    expectedGuests: 50,
    budget: "",
    status: "pending",
  });
  const [editingFunctionIndex, setEditingFunctionIndex] = useState(null);

  const navigate = useNavigate();

  /* ---------- LOAD FUNCTIONS FROM BACKEND ---------- */
  const fetchFunctions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/functions`);
      setFunctions(res.data);
    } catch (err) {
      console.error(err);
      // Fallback to localStorage if backend fails
      const savedFunctions = localStorage.getItem('hostelFunctions');
      if (savedFunctions) {
        try {
          const parsedFunctions = JSON.parse(savedFunctions);
          setFunctions(parsedFunctions);
        } catch (error) {
          console.error('Error loading saved functions:', error);
          loadSampleFunctions();
        }
      } else {
        loadSampleFunctions();
      }
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  /* ---------- SAVE FUNCTIONS TO LOCALSTORAGE AS BACKUP ---------- */
  useEffect(() => {
    if (functions.length > 0) {
      localStorage.setItem('hostelFunctions', JSON.stringify(functions));
    }
  }, [functions]);

  /* ---------- LOAD SAMPLE FUNCTIONS ---------- */
  const loadSampleFunctions = () => {
    const sampleFunctions = [
      {
        id: 1,
        title: "Annual Hostel Day",
        description: "Annual hostel day celebration with cultural programs and awards",
        date: "2024-02-15",
        time: "18:00",
        venue: "Hostel Common Hall",
        organizer: "Student Council",
        contact: "9876543210",
        expectedGuests: 200,
        budget: "₹25,000",
        status: "approved",
        createdAt: "2024-01-10T10:30:00Z"
      },
      {
        id: 2,
        title: "Freshers Welcome",
        description: "Welcome party for new students",
        date: "2024-01-25",
        time: "19:00",
        venue: "Mess Hall",
        organizer: "Senior Students",
        contact: "9876543211",
        expectedGuests: 150,
        budget: "₹15,000",
        status: "completed",
        createdAt: "2024-01-05T14:20:00Z"
      },
      {
        id: 3,
        title: "Sports Tournament",
        description: "Inter-hostel sports competition",
        date: "2024-02-20",
        time: "08:00",
        venue: "Sports Complex",
        organizer: "Sports Committee",
        contact: "9876543212",
        expectedGuests: 100,
        budget: "₹30,000",
        status: "pending",
        createdAt: "2024-01-12T11:45:00Z"
      }
    ];
    setFunctions(sampleFunctions);
  };

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
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin-dashbord" },
    { label: "Students", icon: <FaUsers />, path: "/admin-student" },
    { label: "Student Mess Fee", icon: <FaUtensils />, path: "/messfee-record" },
    { label: "Student Canteen Fee", icon: <FaCoffee />, path: "/admin/canteen-fee" },
    { label: "Attendance of Worker", icon: <FaClipboardList />, path: "/admin/attendance" },
    { label: "Total Attendance", icon: <FaChartLine />, path: "/admin/total-attendance" },
    { label: "Report Student", icon: <FaExclamationTriangle />, path: "/admin/report-student" },
    { 
      label: "Function", 
      icon: <FaTasks />, 
      path: null, 
      action: () => setShowFunctionModal(true) 
    },
    { label: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  const venues = [
    "Hostel Common Hall",
    "Mess Hall",
    "Outdoor Ground",
    "Conference Room",
    "Sports Complex",
    "Other"
  ];

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
    { value: "completed", label: "Completed", color: "bg-blue-100 text-blue-800" },
    { value: "cancelled", label: "Cancelled", color: "bg-gray-100 text-gray-800" }
  ];

  const handleFunctionInputChange = (e) => {
    const { name, value } = e.target;
    setFunctionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ---------- SUBMIT FUNCTION (TO BACKEND) ---------- */
  const handleSubmitFunction = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFunctionIndex !== null) {
        // Update existing function
        const id = functions[editingFunctionIndex]._id;
        await axios.put(`${API_BASE_URL}/api/functions/${id}`, functionForm);
        alert(`Function "${functionForm.title}" updated successfully!`);
      } else {
        // Add new function
        await axios.post(`${API_BASE_URL}/api/functions`, functionForm);
        alert(`Function "${functionForm.title}" booked successfully!`);
      }

      // Refresh the functions list
      await fetchFunctions();
      
      // Reset form and close modal
      setFunctionForm({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        time: "18:00",
        venue: "Hostel Common Hall",
        organizer: "",
        contact: "",
        expectedGuests: 50,
        budget: "",
        status: "pending",
      });
      setEditingFunctionIndex(null);
      setShowFunctionModal(false);
      
    } catch (err) {
      console.error(err);
      alert("Error saving function. Please try again.");
    }
  };

  const handleEditFunction = (index) => {
    const funcToEdit = functions[index];
    setFunctionForm({
      title: funcToEdit.title,
      description: funcToEdit.description,
      date: funcToEdit.date,
      time: funcToEdit.time,
      venue: funcToEdit.venue,
      organizer: funcToEdit.organizer,
      contact: funcToEdit.contact,
      expectedGuests: funcToEdit.expectedGuests,
      budget: funcToEdit.budget,
      status: funcToEdit.status,
    });
    setEditingFunctionIndex(index);
    setShowFunctionModal(true);
  };

  const handleDeleteFunction = async (index) => {
    if (window.confirm("Are you sure you want to delete this function?")) {
      try {
        const id = functions[index]._id;
        await axios.delete(`${API_BASE_URL}/api/functions/${id}`);
        await fetchFunctions();
        alert("Function deleted successfully");
      } catch (err) {
        console.error(err);
        alert("Error deleting function. Please try again.");
      }
    }
  };

  const handleUpdateStatus = async (index, newStatus) => {
    try {
      const id = functions[index]._id;
      await axios.patch(`${API_BASE_URL}/api/functions/${id}/status`, { status: newStatus });
      await fetchFunctions();
      alert(`Function status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert("Error updating status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  const handleResetFunctions = () => {
    if (window.confirm("Are you sure you want to reset all functions? This will load sample data.")) {
      localStorage.removeItem('hostelFunctions');
      loadSampleFunctions();
      alert("Functions reset to sample data");
    }
  };

  const handleClearAllFunctions = () => {
    if (window.confirm("Are you sure you want to clear all functions? This cannot be undone.")) {
      setFunctions([]);
      localStorage.removeItem('hostelFunctions');
      alert("All functions cleared");
    }
  };

  const handleExportFunctions = () => {
    const dataStr = JSON.stringify(functions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `hostel-functions-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportFunctions = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedFunctions = JSON.parse(e.target.result);
        if (Array.isArray(importedFunctions)) {
          if (window.confirm(`Import ${importedFunctions.length} functions? This will replace current data.`)) {
            setFunctions(importedFunctions);
            alert(`Successfully imported ${importedFunctions.length} functions`);
          }
        } else {
          alert("Invalid file format. Please import a valid JSON file.");
        }
      } catch (error) {
        alert("Error reading file. Please check the file format.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
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
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }
              }}
              className="w-full flex items-center gap-3
              px-3 py-3 mb-1
              text-lg font-semibold
              rounded-lg
              hover:bg-green-700
              transition-all text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ================= FUNCTION MODAL ================= */}
      {showFunctionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-[1400px] max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editingFunctionIndex !== null ? "Edit Function" : "Book New Function"}
                </h2>
                <button
                  onClick={() => {
                    setShowFunctionModal(false);
                    setEditingFunctionIndex(null);
                    setFunctionForm({
                      title: "",
                      description: "",
                      date: new Date().toISOString().split("T")[0],
                      time: "18:00",
                      venue: "Hostel Common Hall",
                      organizer: "",
                      contact: "",
                      expectedGuests: 50,
                      budget: "",
                      status: "pending",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmitFunction}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Function Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={functionForm.title}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="e.g., Annual Hostel Day"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer *
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={functionForm.organizer}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="e.g., Student Council"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={functionForm.description}
                    onChange={handleFunctionInputChange}
                    rows="4"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                    placeholder="Describe the function..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={functionForm.date}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={functionForm.time}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue *
                    </label>
                    <select
                      name="venue"
                      value={functionForm.venue}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {venues.map((venue) => (
                        <option key={venue} value={venue}>{venue}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={functionForm.contact}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="e.g., 9876543210"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Guests *
                    </label>
                    <input
                      type="number"
                      name="expectedGuests"
                      value={functionForm.expectedGuests}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Budget
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={functionForm.budget}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., ₹25,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={functionForm.status}
                      onChange={handleFunctionInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFunctionModal(false);
                      setEditingFunctionIndex(null);
                      setFunctionForm({
                        title: "",
                        description: "",
                        date: new Date().toISOString().split("T")[0],
                        time: "18:00",
                        venue: "Hostel Common Hall",
                        organizer: "",
                        contact: "",
                        expectedGuests: 50,
                        budget: "",
                        status: "pending",
                      });
                    }}
                    className="px-8 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
                  >
                    {editingFunctionIndex !== null ? "Update Function" : "Save Function"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                <button className="w-full px-4 py-3 text-left hover:bg-green-50">
                  Profile
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-green-50">
                  Settings
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-green-50">
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ---------- PAGE CONTENT ---------- */}
        <section className="flex-1 p-6 overflow-auto">
          {/* Function Management Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Function Management</h2>
                <p className="text-gray-600">Manage hostel functions and events</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-semibold">Auto-save enabled:</span> All data is automatically saved to browser storage
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleExportFunctions}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                    title="Export to JSON"
                  >
                    Export
                  </button>
                  <label className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm cursor-pointer">
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFunctions}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleResetFunctions}
                    className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg font-medium hover:bg-yellow-50 transition-colors text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleClearAllFunctions}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                </div>
                <button
                  onClick={() => setShowFunctionModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus />
                  Book New Function
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Functions</p>
                    <p className="text-2xl font-bold text-gray-800">{functions.length}</p>
                  </div>
                  <FaCalendarAlt className="text-2xl text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {functions.filter(f => f.status === "approved").length}
                    </p>
                  </div>
                  <FaCheck className="text-2xl text-green-500" />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {functions.filter(f => f.status === "pending").length}
                    </p>
                  </div>
                  <FaCalendarAlt className="text-2xl text-yellow-500" />
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Guests</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {functions.reduce((sum, f) => sum + parseInt(f.expectedGuests || 0), 0)}
                    </p>
                  </div>
                  <FaGuests className="text-2xl text-purple-500" />
                </div>
              </div>
            </div>

            {/* Functions Table */}
            {functions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">S.No</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Function Title</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Date & Time</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Venue</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Organizer</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Guests</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {functions.map((func, index) => (
                      <tr key={func._id || func.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-800">{func.title}</p>
                            <p className="text-sm text-gray-600 truncate max-w-xs">{func.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {new Date(func.createdAt).toLocaleDateString()}
                              {func.updatedAt && ` • Updated: ${new Date(func.updatedAt).toLocaleDateString()}`}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">
                              {new Date(func.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{func.time}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{func.venue}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{func.organizer}</p>
                            <p className="text-sm text-gray-600">{func.contact}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FaGuests className="text-gray-500" />
                            <span>{func.expectedGuests}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(func.status)}`}>
                            {getStatusLabel(func.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {/* Status Action Buttons */}
                            {func.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(index, "approved")}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Approve"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(index, "rejected")}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Reject"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditFunction(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteFunction(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Functions Booked Yet</h3>
                <p className="text-gray-500 mb-6">Click "Book New Function" to schedule your first event.</p>
                <button
                  onClick={() => setShowFunctionModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <FaPlus />
                  Book First Function
                </button>
              </div>
            )}
          </div>

          {/* Data Management Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Data Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Local Storage Status</h4>
                <p className="text-sm text-gray-600">
                  Data is automatically saved to your browser's local storage as backup.
                  Functions will persist even after closing the browser.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${functions.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm">
                    {functions.length > 0 ? `${functions.length} functions saved` : 'No data saved'}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Backup & Restore</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Export your functions as JSON file for backup or import previously exported data.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportFunctions}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Export JSON
                  </button>
                  <label className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 cursor-pointer">
                    Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFunctions}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Reset to sample data or clear all functions permanently.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetFunctions}
                    className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
                  >
                    Reset to Sample
                  </button>
                  <button
                    onClick={handleClearAllFunctions}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Outlet for other routes */}
          <Outlet />
        </section>
      </main>
    </div>
  );
}