import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  FaUser,
  FaIdCard,
  FaPhone,
  FaCalendarAlt,
  FaSave,
  FaSearch,
  FaCheck,
  FaTimes,
  FaBriefcase,
  FaTrash,
  FaUserPlus,
  FaExclamationCircle,
  FaBell,
  FaKey,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import axios from "axios";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function AttendanceWorker() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorker, setNewWorker] = useState({ 
    name: "", 
    employeeId: "", 
    phone: "", 
    designation: "",
    password: "",
    confirmPassword: ""
  });
  
  // New state variables
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  // Confirmation dialog states - REMOVED FOR MARK ALL ACTIONS
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: "", callback: null });
  const [confirmMessage, setConfirmMessage] = useState("");
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation states
  const [phoneError, setPhoneError] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  
  // Track previous date for auto-save
  const prevDateRef = useRef(date);
  const autoSaveTimeoutRef = useRef(null);

  // Fetch workers on component mount
  useEffect(() => {
    fetchWorkers();
  }, []);

  // Fetch attendance when date changes
  useEffect(() => {
    if (workers.length > 0) {
      fetchAttendanceByDate(date);
      // Check if there are unsaved changes before changing date
      if (hasUnsavedChanges) {
        const confirmChange = window.confirm(
          "You have unsaved changes. Changing date will discard them. Continue?"
        );
        if (!confirmChange) {
          setDate(prevDateRef.current);
          return;
        }
        setHasUnsavedChanges(false);
      }
      prevDateRef.current = date;
    }
  }, [date, workers.length]);

  // Auto-save when attendance changes
  useEffect(() => {
    // Don't auto-save on initial load
    if (workers.length === 0) return;
    
    // Don't auto-save if manually saving
    if (isSaving) return;
    
    // Set unsaved changes flag
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
    
    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (3 seconds delay)
    if (autoSaveEnabled) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        if (hasUnsavedChanges) {
          handleAutoSave();
        }
      }, 3000);
    }
    
    // Cleanup
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [workers]);

  // Filter workers based on search term
  useEffect(() => {
    const filtered = workers.filter(worker =>
      worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.phone?.includes(searchTerm) ||
      worker.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkers(filtered);
  }, [searchTerm, workers]);

  // Fetch workers from API
  const fetchWorkers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/workers`);
      const workersWithAttendance = res.data.map(w => ({
        ...w,
        attendance: "" // default blank
      }));
      setWorkers(workersWithAttendance);
      setFilteredWorkers(workersWithAttendance);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error fetching workers:", err);
      showSaveMessage("error", "Failed to fetch workers");
    }
  };

  // Fetch attendance by date
  const fetchAttendanceByDate = async (selectedDate) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/attendance/${selectedDate}`);
      
      setWorkers(prev => {
        return prev.map(worker => {
          const record = res.data.find(r => r.workerId?._id === worker._id);
          return record ? { ...worker, attendance: record.status } : worker;
        });
      });
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // Calculate statistics
  const presentCount = workers.filter(w => w.attendance === "present").length;
  const absentCount = workers.filter(w => w.attendance === "absent").length;
  const pendingCount = workers.filter(w => !w.attendance || w.attendance === "").length;
  const totalWorkers = workers.length;

  // Check if phone number already exists
  const checkPhoneExists = (phone) => {
    return workers.some(worker => worker.phone === phone);
  };

  // Check if employee ID already exists
  const checkEmployeeIdExists = (employeeId) => {
    return workers.some(worker => worker.employeeId === employeeId);
  };

  // Handle phone number change with validation
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setNewWorker({...newWorker, phone});
    
    // Clear previous error
    setPhoneError("");
    
    // Validate phone number format
    const phoneRegex = /^[0-9]{0,10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Phone number must contain only digits (0-9)");
      return;
    }
    
    if (phone.length > 0 && phone.length < 10) {
      setPhoneError("Phone number must be 10 digits");
      return;
    }
    
    // Check if phone number already exists (only if we have 10 digits)
    if (phone.length === 10 && checkPhoneExists(phone)) {
      setPhoneError("This phone number is already registered to another worker");
    }
  };

  // Handle employee ID change with validation
  const handleEmployeeIdChange = (e) => {
    const employeeId = e.target.value;
    setNewWorker({...newWorker, employeeId});
    
    // Clear previous error
    setEmployeeIdError("");
    
    // Check if employee ID already exists
    if (employeeId && checkEmployeeIdExists(employeeId)) {
      setEmployeeIdError("This Employee ID is already taken");
    }
  };

  // Handle attendance change
  const handleAttendanceChange = (id, status) => {
    setWorkers(prev =>
      prev.map(w => w._id === id ? { ...w, attendance: status } : w)
    );
  };

  // Handle mark all - NO CONFIRMATION DIALOG
  const handleMarkAll = (status) => {
    const updatedWorkers = workers.map(worker => ({
      ...worker,
      attendance: status
    }));
    setWorkers(updatedWorkers);
    
    let message = "";
    if (status === "present") {
      message = `All ${totalWorkers} workers marked as PRESENT`;
    } else if (status === "absent") {
      message = `All ${totalWorkers} workers marked as ABSENT`;
    } else {
      message = `All marks cleared for ${totalWorkers} workers`;
    }
    
    showSaveMessage("success", message);
  };

  // Show save message
  const showSaveMessage = (type, text) => {
    setSaveMessage({ type, text });
    setTimeout(() => setSaveMessage({ type: "", text: "" }), 5000);
  };

  // Handle save attendance
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const attendancePayload = workers.map(w => ({
        workerId: w._id,
        status: w.attendance || "absent"
      }));

      await axios.post(`${API_BASE_URL}/api/attendance/save`, {
        date,
        attendance: attendancePayload
      });

      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
      showSaveMessage("success", "Attendance Saved Successfully!");
      
      // Show notification
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
      
    } catch (err) {
      console.error("Error saving attendance:", err);
      showSaveMessage("error", "Error saving attendance. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle auto-save
  const handleAutoSave = async () => {
    if (!autoSaveEnabled || !hasUnsavedChanges) return;
    
    try {
      const attendancePayload = workers.map(w => ({
        workerId: w._id,
        status: w.attendance || "absent"
      }));

      await axios.post(`${API_BASE_URL}/api/attendance/save`, {
        date,
        attendance: attendancePayload
      });

      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
      console.log("Auto-save completed at", new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error in auto-save:", err);
    }
  };

  // Manual save trigger with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveAttendance();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [workers, date]);

  // Handle add new worker with password and validation
  const handleAddWorker = async () => {
    // Clear previous errors
    setPhoneError("");
    setEmployeeIdError("");
    
    // Validate required fields
    if (!newWorker.name || !newWorker.employeeId || !newWorker.phone || !newWorker.password) {
      showSaveMessage("error", "Please fill all required fields (name, employee ID, phone, password)");
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newWorker.phone)) {
      showSaveMessage("error", "Please enter a valid 10-digit phone number");
      return;
    }
    
    // Check if phone number already exists
    if (checkPhoneExists(newWorker.phone)) {
      setPhoneError("This phone number is already registered to another worker");
      showSaveMessage("error", "Phone number already exists. Please use a different phone number.");
      return;
    }
    
    // Check if employee ID already exists
    if (checkEmployeeIdExists(newWorker.employeeId)) {
      setEmployeeIdError("This Employee ID is already taken");
      showSaveMessage("error", "Employee ID already exists. Please use a different Employee ID.");
      return;
    }
    
    // Validate password
    if (newWorker.password.length < 6) {
      showSaveMessage("error", "Password must be at least 6 characters long");
      return;
    }
    
    // Validate password confirmation
    if (newWorker.password !== newWorker.confirmPassword) {
      showSaveMessage("error", "Passwords do not match");
      return;
    }

    try {
      // Prepare worker data with password
      const workerData = {
        name: newWorker.name,
        employeeId: newWorker.employeeId,
        phone: newWorker.phone,
        designation: newWorker.designation,
        password: newWorker.password
      };

      const res = await axios.post(`${API_BASE_URL}/api/workers`, workerData);
      setWorkers(prev => [...prev, { ...res.data, attendance: "" }]);
      setNewWorker({ 
        name: "", 
        employeeId: "", 
        phone: "", 
        designation: "",
        password: "",
        confirmPassword: ""
      });
      setShowAddForm(false);
      showSaveMessage("success", "Worker added successfully! Password has been set.");
    } catch (err) {
      // Handle server-side validation errors
      if (err.response?.data?.message?.includes("phone")) {
        setPhoneError("Phone number already exists in database");
        showSaveMessage("error", "Phone number already exists. Please use a different phone number.");
      } else if (err.response?.data?.message?.includes("employeeId")) {
        setEmployeeIdError("Employee ID already exists in database");
        showSaveMessage("error", "Employee ID already exists. Please use a different Employee ID.");
      } else {
        showSaveMessage("error", err.response?.data?.message || "Error adding worker");
      }
    }
  };

  // Handle delete worker
  const handleDeleteWorker = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/workers/${id}`);
      setWorkers(prev => prev.filter(w => w._id !== id));
      showSaveMessage("success", "Worker deleted successfully!");
    } catch (err) {
      console.error("Error deleting worker:", err);
      showSaveMessage("error", "Error deleting worker. Please try again.");
    }
  };

  // Prompt before leaving if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle confirm dialog actions (only for date change now)
  const handleConfirm = () => {
    if (confirmAction.callback) {
      confirmAction.callback();
    }
    setShowConfirmDialog(false);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Confirmation Dialog - Now only for date change */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationCircle className="text-yellow-500 text-2xl" />
                <h3 className="text-xl font-bold text-gray-800">Confirm Action</h3>
              </div>
              <p className="text-gray-600 mb-6">{confirmMessage}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                if (hasUnsavedChanges) {
                  const confirmNavigation = window.confirm(
                    "You have unsaved changes. Are you sure you want to leave?"
                  );
                  if (!confirmNavigation) return;
                }
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
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

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <FaBell />
            <span>Attendance saved successfully!</span>
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

          {/* Save Status & Profile */}
          <div className="flex items-center gap-4">
            {/* Save Status */}
            <div className="hidden md:flex items-center gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <FaExclamationCircle />
                  <span className="text-sm font-medium">Unsaved Changes</span>
                </div>
              )}
              {lastSaved && (
                <div className="text-sm text-gray-600">
                  Last saved: {lastSaved}
                </div>
              )}
            </div>

            {/* Profile */}
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
          </div>
        </header>

        {/* Save Message Alert */}
        {saveMessage.text && (
          <div className={`px-6 py-3 mx-6 mt-4 rounded-lg ${
            saveMessage.type === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {saveMessage.type === "success" ? <FaCheck /> : <FaExclamationCircle />}
                <span>{saveMessage.text}</span>
              </div>
              <button onClick={() => setSaveMessage({ type: "", text: "" })}>
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* ---------- PAGE CONTENT ---------- */}
        <section className="flex-1 p-6 overflow-auto">
          {/* DASHBOARD CONTENT - ALWAYS SHOW */}
          <div>
            {/* Dashboard Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Worker Attendance Management</h1>
                  <p className="text-gray-600">Mark and manage attendance for hostel workers</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Auto-save Toggle */}
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSaveEnabled}
                        onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Auto-save {autoSaveEnabled ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls and Stats Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {/* Save Info Bar */}
              <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
                hasUnsavedChanges 
                  ? "bg-amber-50 border border-amber-200" 
                  : "bg-green-50 border border-green-200"
              }`}>
                <div className="flex items-center gap-3">
                  <FaExclamationCircle className={
                    hasUnsavedChanges ? "text-amber-600" : "text-green-600"
                  } />
                  <div>
                    <p className="font-medium">
                      {hasUnsavedChanges 
                        ? "You have unsaved changes" 
                        : "All changes are saved"}
                    </p>
                    <p className="text-sm opacity-75">
                      {hasUnsavedChanges
                        ? "Changes will be auto-saved in 3 seconds"
                        : `Last saved: ${lastSaved || "Not saved yet"}`}
                    </p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Shortcut: </span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+S</kbd>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {/* Date Selector */}
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-green-600 text-lg" />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        if (hasUnsavedChanges) {
                          const confirmChange = window.confirm(
                            "You have unsaved changes. Changing date will discard them. Continue?"
                          );
                          if (!confirmChange) return;
                        }
                        setDate(e.target.value);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-3">
                  <FaSearch className="text-gray-400 text-lg" />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Workers</label>
                    <input
                      type="text"
                      placeholder="Search by name, ID, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Add Worker Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <FaUserPlus /> Add New Worker
                  </button>
                </div>

                {/* Save Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={isSaving}
                    className={`w-full px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                      isSaving 
                        ? "bg-blue-400 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Attendance
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mark All Buttons - NO CONFIRMATION DIALOGS */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => handleMarkAll("present")}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition flex items-center gap-2"
                >
                  <FaCheck /> Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll("absent")}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                >
                  <FaTimes /> Mark All Absent
                </button>
                <button
                  onClick={() => handleMarkAll("")}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  Clear All Marks
                </button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{presentCount}</div>
                  <div className="text-sm text-green-600">Present</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{absentCount}</div>
                  <div className="text-sm text-red-600">Absent</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{totalWorkers}</div>
                  <div className="text-sm text-blue-600">Total Workers</div>
                </div>
              </div>
            </div>

            {/* Add Worker Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Worker</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={newWorker.name}
                      onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                    <input
                      type="text"
                      placeholder="EMP001"
                      value={newWorker.employeeId}
                      onChange={handleEmployeeIdChange}
                      className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 ${
                        employeeIdError 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                    {employeeIdError && (
                      <p className="text-red-500 text-sm mt-1">{employeeIdError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={newWorker.phone}
                      onChange={handlePhoneChange}
                      maxLength="10"
                      className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 ${
                        phoneError 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                    {phoneError ? (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    ) : (
                      <p className="text-gray-500 text-sm mt-1">10-digit phone number required</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <select
                      value={newWorker.designation}
                      onChange={(e) => setNewWorker({...newWorker, designation: e.target.value})}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Designation</option>
                      <option value="Fan">Fan</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Painting">Painting</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Food Services">Food Services</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Wifi Management">Wifi Management</option>
                      <option value="Laundry Services">Laundry Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password (min 6 chars)"
                        value={newWorker.password}
                        onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={newWorker.confirmPassword}
                        onChange={(e) => setNewWorker({...newWorker, confirmPassword: e.target.value})}
                        className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 pr-10 ${
                          newWorker.password && newWorker.confirmPassword && newWorker.password !== newWorker.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-green-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {newWorker.password && newWorker.confirmPassword && newWorker.password !== newWorker.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddWorker}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <FaUserPlus /> Add Worker
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setPhoneError("");
                      setEmployeeIdError("");
                    }}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <FaKey className="inline mr-2" />
                    Password will be used by workers to login to their account. Make sure it's secure.
                  </p>
                </div>
              </div>
            )}

            {/* Workers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <FaUser className="inline mr-2" />
                        Worker Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <FaIdCard className="inline mr-2" />
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <FaBriefcase className="inline mr-2" />
                        Designation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <FaPhone className="inline mr-2" />
                        Phone No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredWorkers.length > 0 ? (
                      filteredWorkers.map((worker) => (
                        <tr key={worker._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-semibold">{worker.employeeId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{worker.designation}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{worker.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleAttendanceChange(worker._id, "present")}
                                className={`px-4 py-1 rounded-lg flex items-center gap-1 ${
                                  worker.attendance === "present" 
                                  ? "bg-green-600 text-white" 
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                              >
                                <FaCheck /> Present
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(worker._id, "absent")}
                                className={`px-4 py-1 rounded-lg flex items-center gap-1 ${
                                  worker.attendance === "absent" 
                                  ? "bg-red-600 text-white" 
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                                }`}
                              >
                                <FaTimes /> Absent
                              </button>
                            </div>
                            <div className="mt-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                worker.attendance === "present" 
                                ? "bg-green-100 text-green-800" 
                                : worker.attendance === "absent" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {worker.attendance === "present" ? "Present" : 
                                 worker.attendance === "absent" ? "Absent" : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleDeleteWorker(worker._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          {searchTerm ? "No workers found with your search criteria." : "No workers found. Add some workers to get started."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-sm text-gray-500 text-center">
              <p>Total {filteredWorkers.length} worker(s) found • Date: {new Date(date).toLocaleDateString('en-IN')}</p>
              <p className="mt-1">
                {hasUnsavedChanges 
                  ? "⚠️ You have unsaved changes. Save manually or wait for auto-save." 
                  : "✓ All changes are saved"}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}