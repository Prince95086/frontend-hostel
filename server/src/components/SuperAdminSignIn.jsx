import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaUserTie, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight,
  FaShieldAlt,
  FaUniversity 
} from "react-icons/fa";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email,
        password,
      });

      // save token
      localStorage.setItem("adminToken", res.data.token);

      // Show success toast
      toast.success("Login Successful ✅", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate after showing toast
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);

    } catch (err) {
      // Show error toast
      toast.error(err.response?.data?.message || "Login failed ❌", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Toast Container MUST be at the root level */}
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
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full blur-xl opacity-20 animate-bounce"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-500">
            <FaUserTie className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold bg-purple-500 bg-clip-text text-transparent mb-4">
           Super Admin Access
          </h1>
          <p className="text-gray-600 text-lg">
            Panjab University Hostel Management
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Security Badge */}
          <div className="flex items-center justify-center mb-6">
            <FaShieldAlt className="text-green-500 text-lg mr-2" />
            <span className="text-green-600 font-semibold text-sm">Secure Admin Portal</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              </div>
              <input
                type="email"
                placeholder="Admin Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-300"
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-white"
                />
                <span className="text-gray-600 text-sm">Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="block w-full bg-green-500 text-white py-4 rounded-2xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl font-semibold text-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Access Admin Panel
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              )}
            </button>
          </form>

          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-blue-600 font-bold text-lg">1000+</div>
                <div className="text-gray-500 text-xs">Students</div>
              </div>
              <div>
                <div className="text-green-600 font-bold text-lg">7</div>
                <div className="text-gray-500 text-xs">Block</div>
              </div>
              <div>
                <div className="text-purple-600 font-bold text-lg">24/7</div>
                <div className="text-gray-500 text-xs">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <FaUniversity className="mr-2" />
            Panjab University Admin System
          </div>
          <p className="text-gray-400 text-xs">
            Restricted Access • Authorized Personnel Only
          </p>
          <Link 
            to="/signin-options" 
            className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 mt-2"
          >
            ← Back to Sign In Options
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;