import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaFilter,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { GiGraduateCap } from "react-icons/gi";
import axios from "axios";
import pulogo from "../assets/puimages/pulogo.jpeg";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllData, setShowAllData] = useState(false);
  
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

  /* ---------- FETCH STUDENTS ---------- */
  useEffect(() => {
    if (location.pathname === "/admin-student") {
      fetchStudents();
    }
  }, [location.pathname]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students`);
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE STUDENT ================= */
  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/students/${studentId}`);
      
      // Update UI instantly
      setStudents((prev) =>
        prev.filter((student) => student._id !== studentId)
      );
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete student");
    }
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

  /* ---------- RENDER STUDENTS CONTENT ---------- */
  const renderStudentsContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Students Management</h2>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {isMobile && (
              <button 
                onClick={() => setShowAllData(!showAllData)}
                className={`px-4 py-2 rounded-lg flex items-center justify-center space-x-2 mt-2 md:mt-0 ${
                  showAllData ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <FaEye />
                <span>{showAllData ? "Show Less" : "Show All Data"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students by name, room, or roll no..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
            <FaFilter />
            <span>Filters</span>
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
            <FaDownload />
            <span>Export</span>
          </button>
        </div>

        {/* Students Table - SCROLLABLE VERSION */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-xl">
            Loading student details...
          </div>
        ) : students.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            No students found
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Table container with horizontal and vertical scroll */}
            <div 
              className={`overflow-auto ${
                isMobile && !showAllData ? 'max-h-[400px]' : 
                isMobile && showAllData ? 'max-h-[70vh]' : 
                'max-h-[500px]'
              }`}
            >
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Room No</th>
                    <th className="py-3 px-4 text-left">Roll No</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(student => 
                      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.roomNo?.toString().includes(searchTerm) ||
                      student.rollNo?.toString().includes(searchTerm)
                    )
                    .map((student) => (
                      <tr key={student._id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <GiGraduateCap className="text-blue-600" />
                            </div>
                            <div className="font-medium">{student.name}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="whitespace-nowrap">{student.phone || "N/A"}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap">
                            Room {student.roomNo}
                          </span>
                        </td>
                        <td className="py-3 px-4">{student.rollNo}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
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
            
            {/* Summary footer */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t">
              <p className="text-gray-600 mb-2 md:mb-0">
                Showing {students.filter(student => 
                  student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  student.roomNo?.toString().includes(searchTerm) ||
                  student.rollNo?.toString().includes(searchTerm)
                ).length} of {students.length} students
              </p>
              {isMobile && (
                <p className="text-sm text-gray-500">
                  {showAllData ? "Showing all data" : "Limited view. Click 'Show All Data' to see everything"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
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
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3
              px-3 py-3 mb-1
              text-lg font-semibold
              rounded-lg
              hover:bg-green-700
              transition-all text-left
              ${location.pathname === item.path ? 'bg-green-800' : ''}`}
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
          {/* Check if current route is /admin-student */}
          {location.pathname === "/admin-student" ? renderStudentsContent() : <Outlet />}
        </section>
      </main>
    </div>
  );
}