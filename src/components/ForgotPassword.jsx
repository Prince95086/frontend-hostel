import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaCheckCircle,
  FaLock,
  FaArrowLeft,
  FaShieldAlt,
  FaSpinner,
  FaRegClock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { toast, Toaster } from "react-hot-toast";

// UPDATED: Using Render URL
const API_BASE = "https://hostel-backend-1-vc4l.onrender.com/api/auth/forgot-password";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isResendAvailable, setIsResendAvailable] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;

      case 2:
        if (!/^\d{6}$/.test(formData.otp.trim())) {
          newErrors.otp = "OTP must be 6 digits";
        }
        break;

      case 3:
        if (formData.newPassword.length < 8) {
          newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
          newErrors.newPassword = "Include uppercase, lowercase, and numbers";
        }
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Progress steps
  const steps = [
    { id: 1, label: "Email", icon: <FaEnvelope /> },
    { id: 2, label: "OTP", icon: <FaShieldAlt /> },
    { id: 3, label: "New Password", icon: <FaLock /> },
    { id: 4, label: "Complete", icon: <FaCheckCircle /> },
  ];

  const handleSendOtp = async () => {
    if (!validateStep(1)) return;

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE}/send-otp`, { email: formData.email });
      setCurrentStep(2);
      setCountdown(60);
      setIsResendAvailable(false);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateStep(2)) return;

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE}/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      setCurrentStep(3);
      toast.success("OTP verified successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateStep(3)) return;

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE}/reset-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
      });
      setCurrentStep(4);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (!isResendAvailable) return;
    
    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE}/send-otp`, { email: formData.email });
      setCountdown(60);
      setIsResendAvailable(false);
      toast.success("New OTP sent!");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
            <button
              onClick={handleSendOtp}
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                <FaShieldAlt className="text-orange-500 text-xl" />
              </div>
              <h3 className="text-lg t font-semibold">Enter Verification Code</h3>
              <p className="text-gray-600 text-sm">
                We've sent a 6-digit code to {formData.email}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaShieldAlt className="text-gray-400" />
              </div>
              <input
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="6"
                placeholder="000000"
                value={formData.otp}
                onChange={handleChange}
                className="w-full pl-10 p-3 text-center text-xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoComplete="one-time-code"
              />
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm">{errors.otp}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleVerifyOtp}
                disabled={isSubmitting || formData.otp.length !== 6}
                className="flex-1 bg-purple-500 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>
              <button
                onClick={resendOtp}
                disabled={!isResendAvailable || isSubmitting}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {countdown > 0 ? (
                  <>
                    <FaRegClock />
                    {countdown}s
                  </>
                ) : (
                  "Resend"
                )}
              </button>
            </div>
          </div>
        );

      case 3:
        const passwordStrength = getPasswordStrength(formData.newPassword);
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  name="newPassword"
                  type={showPassword.newPassword ? "text" : "password"}
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword.newPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength >= 75
                        ? "bg-green-500"
                        : passwordStrength >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {passwordStrength >= 75
                    ? "Strong password"
                    : passwordStrength >= 50
                    ? "Medium strength"
                    : "Weak password"}
                </p>
              </div>

              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword.confirmPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={isSubmitting}
              className="w-full bg-green-500 to-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Password Reset Successful!
            </h3>
            <p className="text-gray-600">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <div className="space-y-2">
              <a
                href="/student-signin-complain"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Go to Sign In
              </a>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setFormData({
                    email: "",
                    otp: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Reset Another Password
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-orange-400 p-6 text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GiGraduateCap className="text-4xl" />
              <div>
                <h1 className="text-2xl font-bold">PU Hostel Portal</h1>
                <p className="text-orange-100">Forgot Password</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-orange-400/30 -z-10" />
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-white text-orange-500"
                        : "bg-orange-400/30 text-white"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <FaCheckCircle />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="text-xs mt-2 font-medium">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Back Button (except first and last steps) */}
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={handleGoBack}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft />
                <span>Back</span>
              </button>
            )}

            {renderStep()}

            {/* Additional Help */}
            {currentStep < 4 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-center text-gray-500 text-sm">
                  Need help?{" "}
                  <a
                    href="mailto:support@puhostel.edu"
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;