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
  FaArrowLeft,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaReceipt,
  FaSave,
  FaTimes,
  FaCreditCard,
  FaPhone
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { GiGraduateCap } from "react-icons/gi";
import axios from "axios";
import pulogo from "../assets/puimages/pulogo.jpeg";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function MessFeeRecord() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllData, setShowAllData] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMessFeeData, setStudentMessFeeData] = useState([]);
  const [loadingMessFee, setLoadingMessFee] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  
  const [formData, setFormData] = useState({
    month: "",
    year: new Date().getFullYear(),
    totalAmount: 3500,
    paidAmount: 0,
    dueAmount: 3500,
    paymentDate: "",
    paymentMethod: "Cash",
    status: "Pending",
    receiptNo: "",
    remarks: "",
    studentPhone: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    paidAmount: 0,
    paymentDate: "",
    paymentMethod: "Cash",
    receiptNo: "",
    remarks: ""
  });
  
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
    fetchStudents();
  }, [location.pathname]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      console.log("Fetching students from API...");
      const res = await axios.get(`${API_BASE_URL}/api/students`);
      console.log("Students data received:", res.data);
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
      alert("Error fetching students: " + error.message);
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
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete student");
    }
  };

  /* ================= FETCH STUDENT MESS FEE DETAILS ================= */
  const fetchStudentMessFeeDetails = async (studentId) => {
    setLoadingMessFee(true);
    try {
      // Fetch student info
      console.log("Fetching student info for ID:", studentId);
      const studentRes = await axios.get(`${API_BASE_URL}/api/students/${studentId}`);
      setStudentInfo(studentRes.data);
      
      // Fetch mess fee data
      console.log("Fetching mess fee data...");
      try {
        const messFeeRes = await axios.get(`${API_BASE_URL}/api/mess-fees/student/${studentId}`);
        setStudentMessFeeData(messFeeRes.data);
        console.log("Mess fee data from API:", messFeeRes.data);
      } catch (apiError) {
        console.log("Using mock data, API endpoint not available", apiError);
        // Try alternative endpoint
        try {
          const altRes = await axios.get(`${API_BASE_URL}/api/students/${studentId}/mess-fees`);
          setStudentMessFeeData(altRes.data);
        } catch (altError) {
          console.log("Using mock data");
          const mockMessFeeData = [
            {
              _id: "1",
              month: "January 2024",
              year: 2024,
              totalAmount: 3500,
              paidAmount: 3500,
              dueAmount: 0,
              paymentDate: "2024-01-05",
              paymentMethod: "Online",
              status: "Paid",
              receiptNo: "REC001",
              studentPhone: "9876543210"
            },
            {
              _id: "2",
              month: "February 2024",
              year: 2024,
              totalAmount: 3500,
              paidAmount: 0,
              dueAmount: 3500,
              paymentDate: "",
              paymentMethod: "",
              status: "Pending",
              receiptNo: "",
              studentPhone: "9876543210"
            },
            {
              _id: "3",
              month: "March 2024",
              year: 2024,
              totalAmount: 3500,
              paidAmount: 1500,
              dueAmount: 2000,
              paymentDate: "2024-03-10",
              paymentMethod: "Cash",
              status: "Partial",
              receiptNo: "REC003",
              studentPhone: "9876543210"
            },
          ];
          setStudentMessFeeData(mockMessFeeData);
        }
      }
      
      setSelectedStudent(studentId);
      setShowAddForm(false); // Reset form when viewing details
    } catch (error) {
      console.error("Failed to fetch mess fee details", error);
      alert("Failed to load mess fee details: " + error.message);
    } finally {
      setLoadingMessFee(false);
    }
  };

  /* ================= ADD NEW MESS FEE RECORD ================= */
  const handleAddMessFeeRecord = () => {
    setShowAddForm(true);
    setShowPaymentSummary(false);
    // Reset form data with phone number
    setFormData({
      month: "",
      year: new Date().getFullYear(),
      totalAmount: 3500,
      paidAmount: 0,
      dueAmount: 3500,
      paymentDate: "",
      paymentMethod: "Cash",
      status: "Pending",
      receiptNo: "",
      remarks: "",
      studentPhone: studentInfo?.phone || studentInfo?.phoneNo || "" // Initialize with phone number
    });
  };

  /* ================= SHOW PAYMENT SUMMARY ================= */
  const handleShowPaymentSummary = () => {
    setShowPaymentSummary(true);
    setShowAddForm(false);
  };

  /* ================= HANDLE PAYMENT BUTTON CLICK ================= */
  const handlePaymentClick = (record) => {
    setSelectedRecord(record);
    // Initialize payment form with record data
    setPaymentForm({
      paidAmount: record.paidAmount || 0,
      paymentDate: record.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: record.paymentMethod || "Cash",
      receiptNo: record.receiptNo || "",
      remarks: record.remarks || ""
    });
    setShowPaymentModal(true);
  };

  /* ================= PROCESS PAYMENT ================= */
  const processPayment = async () => {
    if (!selectedRecord) return;
    
    // Validate payment amount
    if (paymentForm.paidAmount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }
    
    if (paymentForm.paidAmount > selectedRecord.totalAmount) {
      alert("Payment amount cannot exceed total amount");
      return;
    }
    
    // Calculate new values
    const newPaidAmount = parseFloat(paymentForm.paidAmount);
    const totalAmount = parseFloat(selectedRecord.totalAmount);
    const newDueAmount = totalAmount - newPaidAmount;
    
    // Determine new status
    let newStatus = "Pending";
    if (newPaidAmount === 0) {
      newStatus = "Pending";
    } else if (newPaidAmount === totalAmount) {
      newStatus = "Paid";
    } else if (newPaidAmount > 0 && newPaidAmount < totalAmount) {
      newStatus = "Partial";
    }
    
    // Generate receipt number if not provided
    let receiptNo = paymentForm.receiptNo;
    if ((newStatus === "Paid" || newStatus === "Partial") && !receiptNo) {
      receiptNo = generateReceiptNumber();
    }
    
    const updatedRecord = {
      ...selectedRecord,
      paidAmount: newPaidAmount,
      dueAmount: newDueAmount,
      status: newStatus,
      paymentDate: paymentForm.paymentDate || (newPaidAmount > 0 ? new Date().toISOString().split('T')[0] : ""),
      paymentMethod: paymentForm.paymentMethod,
      receiptNo: receiptNo,
      remarks: paymentForm.remarks,
      studentId: selectedStudent, // Ensure studentId is included
      studentPhone: studentInfo?.phone || studentInfo?.phoneNo || "" // Add phone number
    };
    
    setProcessingPayment(true);
    try {
      // Update in MongoDB via API
      const response = await axios.put(`${API_BASE_URL}/api/mess-fees/${selectedRecord._id}`, updatedRecord);
      
      // Update local state with response data
      setStudentMessFeeData(prev => 
        prev.map(record => 
          record._id === selectedRecord._id ? response.data : record
        )
      );
      
      alert(`Payment processed successfully! Status: ${newStatus}`);
      setShowPaymentModal(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error("Failed to process payment:", error);
      alert("Failed to process payment: " + error.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  /* ================= DELETE MESS FEE RECORD ================= */
  const handleDeleteMessFeeRecord = async (recordId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this mess fee record?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/mess-fees/${recordId}`);
      
      setStudentMessFeeData(prev => prev.filter(record => record._id !== recordId));
      alert("Mess fee record deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete mess fee record");
    }
  };

  /* ================= EDIT MESS FEE RECORD ================= */
  const handleEditMessFeeRecord = (record) => {
    setSelectedRecord(record);
    // Pre-fill form with existing data
    setFormData({
      month: record.month || "",
      year: record.year || new Date().getFullYear(),
      totalAmount: record.totalAmount || 3500,
      paidAmount: record.paidAmount || 0,
      dueAmount: record.dueAmount || 3500,
      paymentDate: record.paymentDate || "",
      paymentMethod: record.paymentMethod || "Cash",
      status: record.status || "Pending",
      receiptNo: record.receiptNo || "",
      remarks: record.remarks || "",
      studentPhone: record.studentPhone || studentInfo?.phone || studentInfo?.phoneNo || "" // Add phone number
    });
    setShowAddForm(true);
    setShowPaymentSummary(false);
  };

  /* ================= UPDATE MESS FEE RECORD ================= */
  const handleUpdateMessFeeRecord = async (e) => {
    e.preventDefault();
    
    if (!formData.month) {
      alert("Please select a month");
      return;
    }
    
    if (!formData.year) {
      alert("Please select a year");
      return;
    }
    
    if (formData.totalAmount <= 0) {
      alert("Total amount must be greater than 0");
      return;
    }
    
    const finalFormData = { ...formData };
    finalFormData.studentId = selectedStudent;
    
    // Add phone number automatically from studentInfo
    if (selectedStudent && studentInfo) {
      finalFormData.studentPhone = studentInfo.phone || studentInfo.phoneNo || "";
    }
    
    setSaving(true);
    try {
      if (selectedRecord) {
        // Update existing record
        const response = await axios.put(`${API_BASE_URL}/api/mess-fees/${selectedRecord._id}`, finalFormData);
        
        // Update local state
        setStudentMessFeeData(prev => 
          prev.map(record => 
            record._id === selectedRecord._id ? response.data : record
          )
        );
        alert("Mess fee record updated successfully!");
      } else {
        // Create new record
        const response = await axios.post(`${API_BASE_URL}/api/mess-fees`, finalFormData);
        
        // Add new record to the list
        const newRecord = response.data;
        setStudentMessFeeData(prev => [newRecord, ...prev]);
        alert("Mess fee record added successfully!");
      }
      
      setShowAddForm(false);
      setSelectedRecord(null);
      setFormData({
        month: "",
        year: new Date().getFullYear(),
        totalAmount: 3500,
        paidAmount: 0,
        dueAmount: 3500,
        paymentDate: "",
        paymentMethod: "Cash",
        status: "Pending",
        receiptNo: "",
        remarks: "",
        studentPhone: ""
      });
    } catch (error) {
      console.error("Failed to save mess fee record", error);
      alert("Failed to save mess fee record: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  /* ---------- FORM HANDLING ---------- */
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const paymentMethods = ["Cash", "Online", "Cheque", "Bank Transfer"];
  const statusOptions = ["Pending", "Paid", "Partial"];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "totalAmount" || name === "paidAmount") {
      const total = name === "totalAmount" ? parseFloat(value) || 0 : parseFloat(formData.totalAmount) || 0;
      const paid = name === "paidAmount" ? parseFloat(value) || 0 : parseFloat(formData.paidAmount) || 0;
      const due = total - paid;
      
      let status = "Pending";
      if (paid === 0) {
        status = "Pending";
      } else if (paid === total) {
        status = "Paid";
      } else if (paid > 0 && paid < total) {
        status = "Partial";
      }

      setFormData(prev => ({
        ...prev,
        [name]: value,
        dueAmount: due,
        status: status
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC${year}${month}${day}${random}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.month) {
      alert("Please select a month");
      return;
    }
    
    if (!formData.year) {
      alert("Please select a year");
      return;
    }
    
    if (formData.totalAmount <= 0) {
      alert("Total amount must be greater than 0");
      return;
    }
    
    const finalFormData = { ...formData };
    
    // Add phone number automatically from studentInfo
    if (selectedStudent && studentInfo) {
      finalFormData.studentPhone = studentInfo.phone || studentInfo.phoneNo || "";
    }
    
    if ((formData.status === "Paid" || formData.status === "Partial") && !formData.receiptNo) {
      finalFormData.receiptNo = generateReceiptNumber();
    }
    
    finalFormData.studentId = selectedStudent;
    
    setSaving(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mess-fees`, finalFormData);
      
      // Add new record to the list
      const newRecord = response.data;
      setStudentMessFeeData(prev => [newRecord, ...prev]);
      setShowAddForm(false);
      alert("Mess fee record added successfully!");
      
      // Reset form
      setFormData({
        month: "",
        year: new Date().getFullYear(),
        totalAmount: 3500,
        paidAmount: 0,
        dueAmount: 3500,
        paymentDate: "",
        paymentMethod: "Cash",
        status: "Pending",
        receiptNo: "",
        remarks: "",
        studentPhone: ""
      });
    } catch (error) {
      console.error("Failed to add mess fee record", error);
      alert("Failed to add mess fee record: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  /* ---------- GET PAYMENT METHOD ICON ---------- */
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash":
        return <FaMoneyBillWave className="text-green-600" />;
      case "Online":
        return <FaCreditCard className="text-blue-600" />;
      case "Cheque":
        return <FaReceipt className="text-purple-600" />;
      case "Bank Transfer":
        return <FaCreditCard className="text-indigo-600" />;
      default:
        return <FaMoneyBillWave className="text-gray-600" />;
    }
  };

  /* ---------- GET PAYMENT METHOD COLOR ---------- */
  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "Cash":
        return "bg-green-100 text-green-800";
      case "Online":
        return "bg-blue-100 text-blue-800";
      case "Cheque":
        return "bg-purple-100 text-purple-800";
      case "Bank Transfer":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ---------- GET STATUS COLOR ---------- */
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Partial":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ---------- RENDER PAYMENT MODAL ---------- */
  const renderPaymentModal = () => {
    if (!selectedRecord) return null;

    const remainingAmount = selectedRecord.totalAmount - selectedRecord.paidAmount;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
          {/* Modal Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Process Payment - {selectedRecord.month}
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRecord(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Student: <span className="font-semibold">{studentInfo?.name}</span>
              <br />
              Phone: <span className="font-semibold">{studentInfo?.phone || studentInfo?.phoneNo || "N/A"}</span>
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {/* Payment Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-bold">₹{selectedRecord.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Already Paid</p>
                  <p className="text-lg font-bold text-green-600">₹{selectedRecord.paidAmount}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Remaining Amount</p>
                  <p className="text-xl font-bold text-red-600">₹{remainingAmount}</p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              {/* Payment Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaMoneyBillWave className="inline mr-2" />
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={paymentForm.paidAmount}
                  onChange={handlePaymentFormChange}
                  min="0"
                  max={remainingAmount + selectedRecord.paidAmount}
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter amount (max: ₹${remainingAmount + selectedRecord.paidAmount})`}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentForm(prev => ({ 
                      ...prev, 
                      paidAmount: remainingAmount 
                    }))}
                    className="flex-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200"
                  >
                    Pay Full (₹{remainingAmount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentForm(prev => ({ 
                      ...prev, 
                      paidAmount: selectedRecord.paidAmount + (remainingAmount / 2) 
                    }))}
                    className="flex-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded hover:bg-yellow-200"
                  >
                    Pay Half (₹{(remainingAmount / 2).toFixed(2)})
                  </button>
                </div>
              </div>

              {/* Payment Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="inline mr-2" />
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentForm.paymentDate}
                  onChange={handlePaymentFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaCreditCard className="inline mr-2" />
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={paymentForm.paymentMethod}
                  onChange={handlePaymentFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receipt Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <FaReceipt className="inline mr-2" />
                  Receipt Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="receiptNo"
                    value={paymentForm.receiptNo}
                    onChange={handlePaymentFormChange}
                    placeholder="Auto-generate if empty"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPaymentForm(prev => ({ 
                      ...prev, 
                      receiptNo: generateReceiptNumber() 
                    }))}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Remarks (Optional)
                </label>
                <textarea
                  name="remarks"
                  value={paymentForm.remarks}
                  onChange={handlePaymentFormChange}
                  rows="2"
                  placeholder="Payment notes..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedRecord(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={processPayment}
              disabled={processingPayment}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Process Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
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

  /* ---------- RENDER ADD FORM ---------- */
  const renderAddForm = () => {
    return (
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {selectedRecord ? "Edit Mess Fee Record" : "Add New Mess Fee Record"}
          </h3>
          <button
            onClick={() => {
              setShowAddForm(false);
              setSelectedRecord(null);
              setFormData({
                month: "",
                year: new Date().getFullYear(),
                totalAmount: 3500,
                paidAmount: 0,
                dueAmount: 3500,
                paymentDate: "",
                paymentMethod: "Cash",
                status: "Pending",
                receiptNo: "",
                remarks: "",
                studentPhone: ""
              });
            }}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={selectedRecord ? handleUpdateMessFeeRecord : handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Phone Number (Read-only) */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaPhone className="inline mr-2" />
                Student Phone Number (Auto-filled)
              </label>
              <input
                type="text"
                value={studentInfo?.phone || studentInfo?.phoneNo || "N/A"}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
              />
              <p className="text-xs text-gray-500">This will be automatically saved with the record</p>
            </div>

            {/* Month and Year */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaCalendarAlt className="inline mr-2" />
                Month *
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaCalendarAlt className="inline mr-2" />
                Year *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Fields */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaMoneyBillWave className="inline mr-2" />
                Total Amount (₹) *
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleFormChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaMoneyBillWave className="inline mr-2" />
                Paid Amount (₹)
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleFormChange}
                min="0"
                max={formData.totalAmount}
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaMoneyBillWave className="inline mr-2" />
                Due Amount (₹)
              </label>
              <input
                type="number"
                name="dueAmount"
                value={formData.dueAmount}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaCalendarAlt className="inline mr-2" />
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaCreditCard className="inline mr-2" />
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Receipt Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <FaReceipt className="inline mr-2" />
                Receipt Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleFormChange}
                  placeholder="Auto-generate if empty"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, receiptNo: generateReceiptNumber() }))}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Remarks */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Remarks (Optional)
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleFormChange}
                rows="2"
                placeholder="Any additional notes or comments..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setSelectedRecord(null);
                setFormData({
                  month: "",
                  year: new Date().getFullYear(),
                  totalAmount: 3500,
                  paidAmount: 0,
                  dueAmount: 3500,
                  paymentDate: "",
                  paymentMethod: "Cash",
                  status: "Pending",
                  receiptNo: "",
                  remarks: "",
                  studentPhone: ""
                });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {selectedRecord ? "Update Record" : "Save Record"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  /* ---------- RENDER PAYMENT SUMMARY ---------- */
  const renderPaymentSummary = () => {
    // Calculate pending payments
    const pendingPayments = studentMessFeeData.filter(record => 
      record.status === "Pending" || record.status === "Partial"
    );

    const totalPendingAmount = pendingPayments.reduce((sum, record) => 
      sum + (record.dueAmount || 0), 0
    );

    return (
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Payment Summary
          </h3>
          <button
            onClick={() => setShowPaymentSummary(false)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-blue-600">{studentMessFeeData.length}</p>
                </div>
                <FaCalendarAlt className="text-blue-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{studentMessFeeData.reduce((sum, record) => sum + (record.paidAmount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <FaMoneyBillWave className="text-green-500 text-2xl" />
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Payment Methods</p>
                  <p className="text-2xl font-bold text-yellow-600">{paymentMethods.length}</p>
                </div>
                <FaCreditCard className="text-yellow-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Records Table */}
          {studentMessFeeData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Month/Year</th>
                    <th className="py-3 px-4 text-left">Phone</th>
                    <th className="py-3 px-4 text-left">Total Amount</th>
                    <th className="py-3 px-4 text-left">Paid Amount</th>
                    <th className="py-3 px-4 text-left">Due Amount</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMessFeeData.map((record) => (
                    <tr key={record._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{record.month || "Unknown Month"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-600">
                          {record.studentPhone || "N/A"}
                        </div>
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
                        <div className="font-bold text-red-600">
                          ₹{record.dueAmount?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {record.paymentMethod ? (
                            <>
                              <span className="text-lg">
                                {getPaymentMethodIcon(record.paymentMethod)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentMethodColor(record.paymentMethod)}`}>
                                {record.paymentMethod}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500">Not specified</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaMoneyBillWave className="text-4xl text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No payment records found</p>
            </div>
          )}

          {/* Payment Methods Information */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Available Payment Methods</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paymentMethods.map((method) => {
                const methodRecords = studentMessFeeData.filter(record => 
                  record.paymentMethod === method
                );
                const methodAmount = methodRecords.reduce((sum, record) => 
                  sum + (record.paidAmount || 0), 0
                );

                return (
                  <div key={method} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">
                        {getPaymentMethodIcon(method)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentMethodColor(method)}`}>
                        {method}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Records: {methodRecords.length}</p>
                    <p className="text-lg font-bold text-gray-800">₹{methodAmount.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <FaReceipt />
                <span>Print Summary</span>
              </button>
              <button
                onClick={() => {
                  // Generate payment report
                  alert("Generating payment report...");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <FaDownload />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ---------- RENDER STUDENTS CONTENT ---------- */
  const renderStudentsContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Student Mess Fee Management</h2>
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
              placeholder="Search students by name, phone, room, or roll no..." 
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
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading student details...</p>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <div className="text-center">
              <FaUsers className="text-4xl mb-4 mx-auto" />
              <p className="text-xl">No students found</p>
              <button 
                onClick={fetchStudents}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Click to retry
              </button>
            </div>
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
                    .filter(student => {
                      if (!searchTerm) return true;
                      const term = searchTerm.toLowerCase();
                      return (
                        (student.name && student.name.toLowerCase().includes(term)) ||
                        (student.phone && student.phone.toLowerCase().includes(term)) ||
                        (student.phoneNo && student.phoneNo.toLowerCase().includes(term)) ||
                        (student.roomNo && student.roomNo.toString().includes(term)) ||
                        (student.rollNo && student.rollNo.toString().includes(term))
                      );
                    })
                    .map((student) => (
                      <tr key={student._id || student.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <GiGraduateCap className="text-blue-600" />
                            </div>
                            <div className="font-medium">{student.name || "No Name"}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="whitespace-nowrap">{student.phone || student.phoneNo || "N/A"}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap">
                            Room {student.roomNo || student.room || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">{student.rollNo || student.rollNumber || "N/A"}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => fetchStudentMessFeeDetails(student._id || student.id)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded" 
                              title="Mess Fee Details"
                            >
                              <FaUtensils />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student._id || student.id)}
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
                Showing {students.filter(student => {
                  if (!searchTerm) return true;
                  const term = searchTerm.toLowerCase();
                  return (
                    (student.name && student.name.toLowerCase().includes(term)) ||
                    (student.phone && student.phone.toLowerCase().includes(term)) ||
                    (student.phoneNo && student.phoneNo.toLowerCase().includes(term)) ||
                    (student.roomNo && student.roomNo.toString().includes(term)) ||
                    (student.rollNo && student.rollNo.toString().includes(term))
                  );
                }).length} of {students.length} students
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

  /* ---------- RENDER STUDENT MESS FEE DETAILS ---------- */
  const renderStudentMessFeeDetails = () => {
    if (loadingMessFee) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading mess fee details...</p>
          </div>
        </div>
      );
    }

    if (!selectedStudent || !studentInfo) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaUtensils className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No student selected</p>
            <button
              onClick={() => navigate("/messfee-record")}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Back to Students List
            </button>
          </div>
        </div>
      );
    }

    // Calculate totals
    const totalRecords = studentMessFeeData.length;
    const totalPaid = studentMessFeeData.reduce((sum, record) => sum + (record.paidAmount || 0), 0);
    const totalDue = studentMessFeeData.reduce((sum, record) => sum + (record.dueAmount || 0), 0);
    const totalAmount = studentMessFeeData.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
    const paidRecords = studentMessFeeData.filter(record => record.status === "Paid").length;

    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <button
              onClick={() => {
                setSelectedStudent(null);
                setStudentMessFeeData([]);
                setStudentInfo(null);
                setShowAddForm(false);
                setShowPaymentSummary(false);
                navigate("/messfee-record");
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Students List
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Mess Fee Details</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            {!showAddForm && !showPaymentSummary && (
              <>
                <button 
                  onClick={handleAddMessFeeRecord}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <FaPlus />
                  <span>Add New Record</span>
                </button>
                <button 
                  onClick={handleShowPaymentSummary}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                >
                  <FaChartLine />
                  <span>View Summary</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <GiGraduateCap className="text-blue-600 text-3xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{studentInfo.name || "No Name"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-gray-600 text-sm">Roll Number</p>
                  <p className="font-semibold">{studentInfo.rollNo || studentInfo.rollNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Room Number</p>
                  <p className="font-semibold">Room {studentInfo.roomNo || studentInfo.room || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-semibold">{studentInfo.phone || studentInfo.phoneNo || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && renderAddForm()}

        {/* Payment Summary */}
        {showPaymentSummary && renderPaymentSummary()}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaMoneyBillWave className="text-blue-600 text-xl" />
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
                <FaReceipt className="text-green-600 text-xl" />
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
                <FaMoneyBillWave className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Records</p>
                <p className="text-2xl font-bold text-orange-600">
                  {paidRecords}/{totalRecords}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Mess Fee Records Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Monthly Mess Fee Records</h3>
                <p className="text-gray-600 mt-1">
                  Payment status and details
                </p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Month/Year</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Total Amount</th>
                  <th className="py-3 px-4 text-left">Paid Amount</th>
                  <th className="py-3 px-4 text-left">Due Amount</th>
                  <th className="py-3 px-4 text-left">Payment Date</th>
                  <th className="py-3 px-4 text-left">Payment Method</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentMessFeeData.length > 0 ? (
                  studentMessFeeData.map((record) => (
                    <tr key={record._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{record.month || "Unknown Month"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-600">
                          {record.studentPhone || "N/A"}
                        </div>
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
                          {record.paymentMethod ? (
                            <>
                              <span className="text-lg">
                                {getPaymentMethodIcon(record.paymentMethod)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentMethodColor(record.paymentMethod)}`}>
                                {record.paymentMethod}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500">Not specified</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditMessFeeRecord(record)}
                            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Edit Record"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteMessFeeRecord(record._id)}
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          {record.receiptNo && (
                            <button 
                              onClick={() => {
                                // View receipt functionality
                                alert(`Receipt Number: ${record.receiptNo}\nAmount: ₹${record.paidAmount}\nDate: ${record.paymentDate}\nPhone: ${record.studentPhone}`);
                              }}
                              className="p-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200" 
                              title="View Receipt"
                            >
                              <FaReceipt />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-500">
                      No mess fee records found for this student
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600">
                <span className="font-semibold">Summary:</span> {paidRecords} Paid Records
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                >
                  <FaReceipt />
                  <span>Print Summary</span>
                </button>
                <button 
                  onClick={() => {
                    // Download report functionality
                    alert("Downloading report...");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <FaDownload />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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
          {/* Check current view */}
          {selectedStudent ? renderStudentMessFeeDetails() : 
           location.pathname === "/messfee-record" ? renderStudentsContent() : <Outlet />}
        </section>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && renderPaymentModal()}
    </div>
  );
}