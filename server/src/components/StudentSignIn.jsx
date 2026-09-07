import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserPlus,
  FaUniversity,
  FaShieldAlt,
  FaArrowRight,
  FaIdCard,
  FaUtensils,
  FaExclamationTriangle,
  FaClock
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

const StudentSignIn = () => {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Phone validation function
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s/g, '');
    return /^\d{10}$/.test(cleaned);
  };

  // Roll number validation function - 1-4 digits
  const validateRollNo = (rollNo) => {
    const cleaned = rollNo.trim();
    return /^\d{1,4}$/.test(cleaned);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate based on login method
    if (loginMethod === "email") {
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }
      if (!validateEmail(email.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else if (loginMethod === "phone") {
      if (!phone.trim()) {
        toast.error("Phone number is required");
        return;
      }
      const cleanedPhone = phone.replace(/\s/g, '');
      if (!validatePhone(cleanedPhone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
    } else if (loginMethod === "rollNo") {
      if (!rollNo.trim()) {
        toast.error("Roll Number is required");
        return;
      }
      if (!validateRollNo(rollNo)) {
        toast.error("Roll Number must be 1-4 digits (e.g., 99, 1234)");
        return;
      }
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        password: password.trim(),
        loginMethod: loginMethod
      };

      if (loginMethod === "email") {
        payload.email = email.trim().toLowerCase();
      } else if (loginMethod === "phone") {
        payload.phone = phone.replace(/\s/g, '');
      } else if (loginMethod === "rollNo") {
        payload.rollNo = rollNo.trim();
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/student/signin`,
        payload
      );

      // Save student data based on login method
      const studentData = {
        ...res.data.student,
        loginMethod: loginMethod,
        rollNo: loginMethod === "rollNo" ? rollNo.trim() : res.data.student.rollNo,
        loginId: loginMethod === "email" ? email.trim() : 
                 loginMethod === "phone" ? phone.replace(/\s/g, '') : 
                 rollNo.trim()
      };

      // Save to localStorage or sessionStorage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      
      storage.setItem("token", res.data.token);
      storage.setItem("student", JSON.stringify(studentData));
      storage.setItem("studentId", loginMethod === "rollNo" ? rollNo.trim() : res.data.student.rollNo || res.data.student._id);
      storage.setItem("studentInfo", JSON.stringify(studentData));
      
      // Save phone number for complaints access
      if (loginMethod === "phone") {
        storage.setItem("studentPhone", phone.replace(/\s/g, ''));
      } else if (studentData.phone) {
        storage.setItem("studentPhone", studentData.phone);
      }
      
      // Save roll number for complaints access
      if (loginMethod === "rollNo") {
        storage.setItem("studentRollNo", rollNo.trim());
      } else if (studentData.rollNo) {
        storage.setItem("studentRollNo", studentData.rollNo);
      }

      // Show success toast
      toast.success("Login successful! Redirecting to your account...", { autoClose: 1500 });

      // Navigate to My Account for ALL login methods
      setTimeout(() => {
        navigate("/my-account");
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (loginMethod === "email") {
        errorMessage = "Invalid email or password";
      } else if (loginMethod === "phone") {
        errorMessage = "Invalid phone number or password";
      } else if (loginMethod === "rollNo") {
        errorMessage = "Invalid Roll Number or password";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    if (value.length > 6) {
      value = `${value.slice(0, 5)} ${value.slice(5, 10)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 5)} ${value.slice(5)}`;
    }
    
    setPhone(value);
    setErrorMsg("");
  };

  // Format roll number - only allow digits, max 4
  const handleRollNoChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setRollNo(value);
    setErrorMsg("");
  };

  // Reset form when switching methods
  const handleMethodChange = (method) => {
    setLoginMethod(method);
    setErrorMsg("");
    if (method === "email") {
      setPhone("");
      setRollNo("");
    } else if (method === "phone") {
      setEmail("");
      setRollNo("");
    } else if (method === "rollNo") {
      setEmail("");
      setPhone("");
    }
  };

  // Auto-fill demo credentials
  const fillDemoCredentials = () => {
    if (loginMethod === "email") {
      setEmail("student@example.com");
      setPassword("password123");
    } else if (loginMethod === "phone") {
      setPhone("9876543210");
      setPassword("password123");
    } else if (loginMethod === "rollNo") {
      setRollNo("99");
      setPassword("password123");
    }
    toast.info("Demo credentials filled!", { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
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
      
      <div className="max-w-md w-full relative z-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl mb-6">
            <FaUniversity className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-600 mb-3">
            Student Portal
          </h1>
          <p className="text-gray-600">
            Sign in with Email, Phone Number, or Roll Number
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          
          {/* Login Method Toggle */}
          <div className="mb-6">
            <div className="flex border-2 border-gray-200 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => handleMethodChange("email")}
                className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  loginMethod === "email"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaEnvelope />
                Email
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange("phone")}
                className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  loginMethod === "phone"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaPhone />
                Phone
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange("rollNo")}
                className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  loginMethod === "rollNo"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaIdCard />
                Roll No
              </button>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">

            {/* Email/Phone/RollNo Input */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                {loginMethod === "email" ? "Email Address" : 
                 loginMethod === "phone" ? "Phone Number" : 
                 "Roll Number"}
              </label>
              <div className="relative mt-2">
                {loginMethod === "email" ? (
                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                ) : loginMethod === "phone" ? (
                  <FaPhone className="absolute left-4 top-4 text-gray-400" />
                ) : (
                  <FaIdCard className="absolute left-4 top-4 text-gray-400" />
                )}
                {loginMethod === "email" ? (
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="student@panjabuniversity.ac.in"
                    className="w-full border-2 border-gray-200 rounded-2xl pl-12 py-4 focus:border-blue-500 outline-none transition-all duration-300"
                  />
                ) : loginMethod === "phone" ? (
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98XXX XXXXX"
                    className="w-full border-2 border-gray-200 rounded-2xl pl-12 py-4 focus:border-blue-500 outline-none transition-all duration-300"
                  />
                ) : (
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={handleRollNoChange}
                    placeholder="e.g., 99 or 1234"
                    className="w-full border-2 border-gray-200 rounded-2xl pl-12 py-4 focus:border-blue-500 outline-none transition-all duration-300"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {loginMethod === "email" 
                  ? "Use your registered university email" 
                  : loginMethod === "phone"
                  ? "Enter your 10-digit phone number"
                  : "Enter your 1-4 digit Roll Number"}
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Fill demo credentials
                </button>
              </div>
              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Enter your password"
                  className="w-full border-2 border-gray-200 rounded-2xl pl-12 pr-12 py-4 focus:border-blue-500 outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-blue-500 transition-colors duration-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Password must be at least 6 characters
              </p>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                />
                Remember this device
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-lg">
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">QUICK ACCESS</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Quick Login Suggestions */}
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600 mb-4">
              <p>Choose your preferred login method:</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaIdCard className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Roll Number</p>
                      <p className="text-xs text-gray-600">1-4 digit number</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMethodChange("rollNo")}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-xs text-gray-600">University email</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMethodChange("email")}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaPhone className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <p className="text-xs text-gray-600">10-digit number</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMethodChange("phone")}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Signup */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              New to Panjab University Hostels?
            </p>
            <Link
              to="/emailverify"
              className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold flex justify-center gap-2 items-center hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <FaUserPlus /> Create Student Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <FaShieldAlt className="inline text-green-500 mr-2" />
          Secure & Encrypted • Login via {loginMethod === "email" ? "Email" : 
                                        loginMethod === "phone" ? "Phone" : 
                                        "Roll Number"}
        </div>

        {/* Quick Demo Info */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <div className="space-y-1">
            <p>• <span className="font-medium">Email:</span> student@example.com</p>
            <p>• <span className="font-medium">Phone:</span> 9876543210</p>
            <p>• <span className="font-medium">Roll No:</span> 99 (1-4 digits)</p>
            <p>• <span className="font-medium">Password:</span> password123</p>
            <p className="text-xs mt-1 italic">Click "Fill demo credentials" button to auto-fill</p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <p className="font-semibold mb-1">Need help with login?</p>
          <p className="mb-1">• Roll Number: Use your 1-4 digit hostel roll number (e.g., 99, 1234)</p>
          <p>• Contact hostel administration if you forget your credentials</p>
          <p className="mt-1 text-xs">Technical support: support@panjabuniversity.ac.in</p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignIn;