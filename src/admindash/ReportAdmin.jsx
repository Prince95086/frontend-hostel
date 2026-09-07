import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaFileAlt,
  FaEye,
  FaTrash,
  FaEdit,
  FaFilter,
  FaPhone,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";
import axios from "axios";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function ReportAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState("worker");
  const [filterType, setFilterType] = useState("worker");
  const [reports, setReports] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [reportData, setReportData] = useState({
    name: "",
    id: "",
    phoneNo: "",
    date: new Date().toISOString().split("T")[0],
    issueType: "",
    description: "",
    severity: "medium",
    actionTaken: "",
  });

  const navigate = useNavigate();

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

  /* ---------- FETCH REPORTS ---------- */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const workerRes = await axios.get(`${API_BASE_URL}/api/worker-reports`);
        const studentRes = await axios.get(`${API_BASE_URL}/api/student-reports`);

        const workers = workerRes.data.map(r => ({
          ...r,
          _id: r._id,
          type: "worker",
          id: r.workerId,
          name: r.workerName,
          phoneNo: r.phoneNo || r.workerPhone || r.phone || "N/A"
        }));

        const students = studentRes.data.map(r => ({
          ...r,
          _id: r._id,
          type: "student",
          id: r.studentId,
          name: r.studentName,
          phoneNo: r.phoneNo || r.studentPhone || r.phone || "N/A"
        }));

        setReports([...workers, ...students]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReports();
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
    { label: "Function", icon: <FaTasks />, path: "/admin/function" },
    { label: "Settings", icon: <FaCog />, path: "/admin/settings" },
    { label: "Write Report", icon: <FaFileAlt />, path: null, action: () => setShowReportModal(true) },
  ];

  const issueTypes = {
    worker: ["Late Arrival", "Absent", "Misconduct", "Poor Performance", "Equipment Damage", "Other"],
    student: ["Discipline", "Property Damage", "Late Night Entry", "Violation of Rules", "Health Issue", "Other"]
  };

  // Filter reports based on filterType
  const filteredReports = reports.filter(report => {
    if (filterType === "worker") return report.type === "worker";
    if (filterType === "student") return report.type === "student";
    return true;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    try {
      if (reportType === "worker") {
        if (editingIndex !== null) {
          await axios.put(`${API_BASE_URL}/api/worker-reports/${reports[editingIndex]._id}`, {
            workerName: reportData.name,
            workerId: reportData.id,
            phoneNo: reportData.phoneNo,
            date: reportData.date,
            issueType: reportData.issueType,
            description: reportData.description,
            severity: reportData.severity,
            actionTaken: reportData.actionTaken,
          });
        } else {
          await axios.post(`${API_BASE_URL}/api/worker-reports`, {
            workerName: reportData.name,
            workerId: reportData.id,
            phoneNo: reportData.phoneNo,
            date: reportData.date,
            issueType: reportData.issueType,
            description: reportData.description,
            severity: reportData.severity,
            actionTaken: reportData.actionTaken,
          });
        }
      } else {
        if (editingIndex !== null) {
          await axios.put(`${API_BASE_URL}/api/student-reports/${reports[editingIndex]._id}`, {
            studentName: reportData.name,
            studentId: reportData.id,
            phoneNo: reportData.phoneNo,
            date: reportData.date,
            issueType: reportData.issueType,
            description: reportData.description,
            severity: reportData.severity,
            actionTaken: reportData.actionTaken,
          });
        } else {
          await axios.post(`${API_BASE_URL}/api/student-reports`, {
            studentName: reportData.name,
            studentId: reportData.id,
            phoneNo: reportData.phoneNo,
            date: reportData.date,
            issueType: reportData.issueType,
            description: reportData.description,
            severity: reportData.severity,
            actionTaken: reportData.actionTaken,
          });
        }
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Error submitting report. Please try again.");
    }
  };

  const handleDeleteReport = async (index) => {
    const report = filteredReports[index];

    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      if (report.type === "worker") {
        await axios.delete(`${API_BASE_URL}/api/worker-reports/${report._id}`);
      } else {
        await axios.delete(`${API_BASE_URL}/api/student-reports/${report._id}`);
      }
      
      setReports(prev => prev.filter(r => r._id !== report._id));
      alert("Report deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Error deleting report. Please try again.");
    }
  };

  const handleEditReport = (index) => {
    const report = filteredReports[index];

    setReportType(report.type);
    setReportData({
      name: report.name,
      id: report.id,
      phoneNo: report.phoneNo || "",
      date: report.date,
      issueType: report.issueType,
      description: report.description,
      severity: report.severity,
      actionTaken: report.actionTaken,
    });

    const originalIndex = reports.findIndex(r => r._id === report._id);
    setEditingIndex(originalIndex);
    setShowReportModal(true);
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    setReportData({
      name: "",
      id: "",
      phoneNo: "",
      date: new Date().toISOString().split("T")[0],
      issueType: "",
      description: "",
      severity: "medium",
      actionTaken: "",
    });
    setEditingIndex(null);
  };

  const handleViewReport = (index) => {
    const report = filteredReports[index];
    alert(
      `Report Details:\n\n` +
      `Type: ${report.type === "worker" ? "Worker" : "Student"}\n` +
      `Name: ${report.name}\n` +
      `ID: ${report.id}\n` +
      `Phone: ${report.phoneNo || "N/A"}\n` +
      `Date: ${report.date}\n` +
      `Issue Type: ${report.issueType}\n` +
      `Severity: ${report.severity}\n` +
      `Description: ${report.description}\n` +
      `Action Taken: ${report.actionTaken || "Not specified"}\n` +
      `Created: ${new Date(report.createdAt || Date.now()).toLocaleString()}`
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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

      {/* ================= REPORT MODAL (FULL WIDTH) ================= */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-[1400px] max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editingIndex !== null ? "Edit Report" : "Write Report"}
                </h2>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setEditingIndex(null);
                    setReportData({
                      name: "",
                      id: "",
                      phoneNo: "",
                      date: new Date().toISOString().split("T")[0],
                      issueType: "",
                      description: "",
                      severity: "medium",
                      actionTaken: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  &times;
                </button>
              </div>

              {/* Report Type Selection */}
              <div className="flex gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => handleReportTypeChange("worker")}
                  className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
                    reportType === "worker"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Worker Report
                </button>
                <button
                  type="button"
                  onClick={() => handleReportTypeChange("student")}
                  className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-colors ${
                    reportType === "student"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Student Report
                </button>
              </div>

              <form onSubmit={handleSubmitReport}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      {reportType === "worker" ? "Worker Name" : "Student Name"} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={reportData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder={`Enter ${reportType === "worker" ? "worker" : "student"} name`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      {reportType === "worker" ? "Worker ID" : "Student ID"} *
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={reportData.id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder={`Enter ${reportType === "worker" ? "worker" : "student"} ID`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNo"
                        value={reportData.phoneNo}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                        pattern="[0-9]{10}"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={reportData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Issue Type *
                    </label>
                    <select
                      name="issueType"
                      value={reportData.issueType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select issue type</option>
                      {issueTypes[reportType].map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <div className="flex gap-3">
                      {["low", "medium", "high"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setReportData(prev => ({ ...prev, severity: level }))}
                          className={`flex-1 py-3 rounded-lg font-medium capitalize text-lg transition-all ${
                            reportData.severity === level
                              ? level === "low"
                                ? "bg-green-500 text-white shadow-lg"
                                : level === "medium"
                                ? "bg-yellow-500 text-white shadow-lg"
                                : "bg-red-500 text-white shadow-lg"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={reportData.description}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                    placeholder={`Describe the issue with ${reportType === "worker" ? "the worker" : "the student"} in detail...`}
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Action Taken
                  </label>
                  <textarea
                    name="actionTaken"
                    value={reportData.actionTaken}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Enter the action taken..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReportModal(false);
                      setEditingIndex(null);
                      setReportData({
                        name: "",
                        id: "",
                        phoneNo: "",
                        date: new Date().toISOString().split("T")[0],
                        issueType: "",
                        description: "",
                        severity: "medium",
                        actionTaken: "",
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
                    {editingIndex !== null ? "Update" : "Submit"}
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

            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Hostel 6
            </h1>
          </div>

          {/* ---------- PROFILE ---------- */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <FaUserCircle size={30} />
              <IoChevronDown
                className={`text-gray-600 transition-transform ${
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

        {/* ---------- PAGE CONTENT (REPORTS TABLE) ---------- */}
        <section className="flex-1 p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg p-4">
            {/* Header with minimized text */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-xl text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Reports</h2>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="text-sm">
                  <span className="text-gray-500">View:</span>
                  <span className="font-semibold ml-1">
                    {filterType === "worker" ? "Worker" : "Student"}
                  </span>
                  <span className="text-gray-500 ml-2 text-xs">({filteredReports.length})</span>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <FaFileAlt className="text-base" />
                  New
                </button>
              </div>
            </div>

            {/* Filter Buttons - Compact */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilterType("worker")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  filterType === "worker"
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaUsers />
                Worker
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/30 rounded">
                  {reports.filter(r => r.type === "worker").length}
                </span>
              </button>
              <button
                onClick={() => setFilterType("student")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  filterType === "student"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaUsers />
                Student
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/30 rounded">
                  {reports.filter(r => r.type === "student").length}
                </span>
              </button>
            </div>

            {/* Stats Cards - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-800">{reports.length}</p>
                  </div>
                  <FaFileAlt className="text-lg text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Worker</p>
                    <p className="text-xl font-bold text-gray-800">
                      {reports.filter(r => r.type === "worker").length}
                    </p>
                  </div>
                  <FaUsers className="text-lg text-green-500" />
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Student</p>
                    <p className="text-xl font-bold text-gray-800">
                      {reports.filter(r => r.type === "student").length}
                    </p>
                  </div>
                  <FaUsers className="text-lg text-purple-500" />
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">High</p>
                    <p className="text-xl font-bold text-gray-800">
                      {reports.filter(r => r.severity === "high").length}
                    </p>
                  </div>
                  <FaExclamationTriangle className="text-lg text-red-500" />
                </div>
              </div>
            </div>

            {filteredReports.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">#</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">Type</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">ID</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">Phone</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">Issue</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">Severity</th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => (
                      <tr key={report._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-3 text-sm">{index + 1}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.type === "worker" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {report.type === "worker" ? "W" : "S"}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium text-sm">{report.name}</td>
                        <td className="py-2 px-3 text-sm">{report.id}</td>
                        <td className="py-2 px-3 text-sm">
                          <div className="flex items-center gap-1">
                            <FaPhone className="text-blue-500 text-xs" />
                            {report.phoneNo}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-sm">{report.date}</td>
                        <td className="py-2 px-3 text-sm">{report.issueType}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                            {report.severity.charAt(0)}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleViewReport(index)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View"
                            >
                              <FaEye className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleEditReport(index)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteReport(index)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                {filterType === "worker" ? (
                  <>
                    <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Worker Reports</h3>
                    <p className="text-sm text-gray-500 mb-4">Create your first worker report</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setFilterType("student")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        View Student
                      </button>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FaFileAlt />
                        New
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Student Reports</h3>
                    <p className="text-sm text-gray-500 mb-4">Create your first student report</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setFilterType("worker")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        View Worker
                      </button>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FaFileAlt />
                        New
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}