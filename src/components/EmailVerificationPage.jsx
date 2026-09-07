import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaUniversity,
  FaLock,
} from "react-icons/fa";

// UPDATED: Using Render URL
const API_BASE = "https://hostel-backend-1-vc4l.onrender.com/api/auth";

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  /* ================= SEND OTP ================= */
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCodeSent(true); // ✅ OTP sent to Gmail
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: inputCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setVerified(true);
      
      // Store email in localStorage/sessionStorage for signup page
      localStorage.setItem("verifiedEmail", email);
      sessionStorage.setItem("verifiedEmail", email);
      
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/resend-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= GO TO SIGNUP ================= */
  const handleContinueToSignup = () => {
    navigate("/studentsignup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-2xl mb-6">
            <FaUniversity className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold bg-blue-500 bg-clip-text text-transparent mb-4">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-lg">
            Secure access to Panjab University Hostel Portal
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* STEP 1 - Email Input */}
          {!codeSent && !verified && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {/* STEP 2 - OTP Verification */}
          {codeSent && !verified && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center">
                <FaShieldAlt className="mx-auto text-green-500 text-3xl mb-2" />
                <p className="text-gray-600">OTP sent to</p>
                <p className="font-semibold text-blue-600 break-all">{email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Check your email inbox (or spam)
                </p>
              </div>

              <div className="relative">
                <input
                  type={showOtp ? "text" : "password"}
                  maxLength="6"
                  value={inputCode}
                  onChange={(e) =>
                    setInputCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full text-center tracking-widest text-xl py-4 border rounded-2xl pr-12"
                  placeholder="Enter OTP"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  {showOtp ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || inputCode.length !== 6}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="w-full text-blue-600 text-sm hover:underline"
              >
                Didn't receive code? Resend
              </button>
            </form>
          )}

          {/* STEP 3 - Verified Success */}
          {verified && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <FaCheckCircle className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Email Verified!
              </h3>
              <p className="text-gray-600">
                Your email <span className="font-semibold text-blue-600">{email}</span> has been successfully verified.
              </p>
              <button
                onClick={handleContinueToSignup}
                className="block w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Continue to Sign Up
                <FaArrowRight className="inline ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        {!verified && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/signin-options" className="text-blue-600 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;