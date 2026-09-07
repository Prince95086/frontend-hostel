import React, { useState, useEffect } from "react";
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
  FaSearch,
  FaArrowLeft,
  FaChartBar,
  FaCalendarDay,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaBriefcase
} from "react-icons/fa";
import axios from "axios";
import { IoChevronDown } from "react-icons/io5";
import pulogo from "../assets/puimages/pulogo.jpeg";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function TotalAttendance() {
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
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerAttendance, setWorkerAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0]
  });
  const [loading, setLoading] = useState(false);

  // Fetch workers on component mount
  useEffect(() => {
    fetchWorkers();
  }, []);

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
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/workers`);
      setWorkers(res.data);
      setFilteredWorkers(res.data);
    } catch (err) {
      console.error("Error fetching workers:", err);
      alert("Error fetching workers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch worker attendance when a worker is selected
  const fetchWorkerAttendance = async (workerId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/attendance/worker/${workerId}`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });
      setWorkerAttendance(res.data);
    } catch (err) {
      console.error("Error fetching worker attendance:", err);
      alert("Error fetching attendance records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle worker selection
  const handleWorkerSelect = async (worker) => {
    setSelectedWorker(worker);
    await fetchWorkerAttendance(worker._id);
  };

  // Handle back to workers list
  const handleBackToList = () => {
    setSelectedWorker(null);
    setWorkerAttendance([]);
  };

  // Calculate statistics for selected worker
  const calculateWorkerStats = () => {
    if (!workerAttendance.length) return { present: 0, absent: 0, total: 0, presentPercentage: 0 };

    const total = workerAttendance.length;
    const present = workerAttendance.filter(a => a.status === "present").length;
    const absent = workerAttendance.filter(a => a.status === "absent").length;
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, total, presentPercentage };
  };

  // Calculate statistics for all workers
  const calculateAllStats = () => {
    // This would require fetching all attendance data
    // For now, we'll show placeholder or fetch from an endpoint
    return { totalWorkers: workers.length };
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const stats = calculateWorkerStats();
  const allStats = calculateAllStats();

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
          {/* MAIN CONTENT */}
          <div>
            {/* Header with Back button when viewing worker details */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedWorker ? `${selectedWorker.name}'s Attendance Records` : "Total Attendance Overview"}
                </h1>
                <p className="text-gray-600">
                  {selectedWorker 
                    ? "View detailed attendance history for this worker" 
                    : "View and analyze attendance records for all workers"}
                </p>
              </div>
              
              {selectedWorker && (
                <button
                  onClick={handleBackToList}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <FaArrowLeft /> Back to Workers List
                </button>
              )}
            </div>

            {/* Date Range Selector (when viewing worker details) */}
            {selectedWorker && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCalendarDay /> Select Date Range
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => fetchWorkerAttendance(selectedWorker._id)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Worker Statistics (when viewing worker details) */}
            {selectedWorker && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Days</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <FaCalendarDay className="text-3xl text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Present Days</p>
                      <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                    </div>
                    <FaCheckCircle className="text-3xl text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Absent Days</p>
                      <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                    </div>
                    <FaTimesCircle className="text-3xl text-red-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Attendance Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.presentPercentage}%</p>
                    </div>
                    <FaChartBar className="text-3xl text-purple-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Worker List View */}
            {!selectedWorker ? (
              <>
                {/* Search and Stats Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="w-full md:w-auto">
                      <div className="flex items-center space-x-3">
                        <FaSearch className="text-gray-400 text-lg" />
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Search Workers</label>
                          <input
                            type="text"
                            placeholder="Search by name, ID, phone, designation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">{allStats.totalWorkers}</div>
                      <div className="text-sm text-blue-600">Total Workers</div>
                    </div>
                  </div>

                  {/* Workers Table */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <p className="mt-2 text-gray-600">Loading workers...</p>
                    </div>
                  ) : (
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
                                  <button
                                    onClick={() => handleWorkerSelect(worker)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                  >
                                    <FaEye /> View Attendance
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                {searchTerm 
                                  ? "No workers found with your search criteria." 
                                  : "No workers found. Add some workers in the Attendance section."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Summary Note */}
                <div className="mt-6 text-sm text-gray-500 text-center">
                  <p>Click "View Attendance" on any worker to see their detailed attendance history.</p>
                </div>
              </>
            ) : (
              /* Worker Attendance Details View */
              <>
                {/* Attendance Records Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaCalendarAlt /> Attendance Records ({dateRange.startDate} to {dateRange.endDate})
                    </h3>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <p className="mt-2 text-gray-600">Loading attendance records...</p>
                    </div>
                  ) : workerAttendance.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Day
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Marked At
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {workerAttendance.map((record, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatDate(record.date)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'long' })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  record.status === "present" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {record.status === "present" ? "Present" : "Absent"}
                                  {record.status === "present" ? <FaCheckCircle className="inline ml-1" /> : <FaTimesCircle className="inline ml-1" />}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(record.createdAt).toLocaleString('en-IN')}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                      <p>No attendance records found for the selected date range.</p>
                      <p className="text-sm mt-1">Try adjusting the date range or check if attendance was marked.</p>
                    </div>
                  )}
                </div>

                {/* Export/Print Options */}
                <div className="flex justify-end gap-3 mb-6">
                  <button
                    onClick={() => window.print()}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Print Report
                  </button>
                  <button
                    onClick={() => alert("Export feature coming soon!")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Export to Excel
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}