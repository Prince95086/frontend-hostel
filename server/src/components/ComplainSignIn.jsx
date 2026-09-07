import React, { useState } from "react";
import axios from "axios";

import {
  FaFan,
  FaBolt,
  FaBroom,
  FaPaintRoller,
  FaCouch,
  FaUtensils,
  FaFaucet,
  FaWifi,
  FaTshirt,
  FaBuilding,
  FaDoorClosed,
  FaIdCard,
  FaPhone,
  FaEdit,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { Link } from "react-router-dom";

// UPDATED: Using Render URL as fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://hostel-backend-1-vc4l.onrender.com/api";


const ComplainSignIn = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    hostel: "",
    block: "",
    roomNo: "",
    rollNo: "",
    mobileNo: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const complaintCategories = [
    {
      id: "fan",
      name: "Fan Issue",
      icon: FaFan,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "electricity",
      name: "Electricity",
      icon: FaBolt,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      id: "cleaning",
      name: "Cleaning",
      icon: FaBroom,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "painting",
      name: "Painting",
      icon: FaPaintRoller,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "furniture",
      name: "Furniture",
      icon: FaCouch,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      id: "food",
      name: "Food Services",
      icon: FaUtensils,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: "water",
      name: "Water Supply",
      icon: FaFaucet,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    {
      id: "wifi",
      name: "WiFi Management",
      icon: FaWifi,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      id: "laundry",
      name: "Laundry Services",
      icon: FaTshirt,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    }
  ];

  const hostels = {
    boys: Array.from({ length: 8 }, (_, i) => `BH${i + 1}`),
    girls: Array.from({ length: 10 }, (_, i) => `GH${i + 1}`)
  };

  const blocks = Array.from({ length: 7 }, (_, i) => `Block ${i + 1}`);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setCurrentStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Input validation for numeric fields
    if ((name === "roomNo" || name === "rollNo" || name === "mobileNo") && value.length > 0) {
      if (!/^\d*$/.test(value)) return; // Only allow numbers
    }
    
    // Input validation for name field (allow only letters and spaces)
    if (name === "name" && value.length > 0) {
      if (!/^[A-Za-z\s]*$/.test(value)) return; // Only allow letters and spaces
    }
    
    // Field length limits
    if (name === "roomNo" && value.length > 4) return;
    if (name === "rollNo" && value.length > 10) return;
    if (name === "mobileNo" && value.length > 10) return;
    if (name === "name" && value.length > 50) return;

    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.category) {
        newErrors.category = "Please select a complaint category";
      }
    }

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      else if (!/^[A-Za-z\s]{2,50}$/.test(formData.name.trim())) newErrors.name = "Enter valid name (2-50 letters only)";
      if (!formData.hostel) newErrors.hostel = "Hostel is required";
      if (!formData.block) newErrors.block = "Block is required";
      if (!formData.roomNo.trim()) newErrors.roomNo = "Room number is required";
      else if (!/^\d{1,4}$/.test(formData.roomNo)) newErrors.roomNo = "Room number must be 1-4 digits";
      if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";
      else if (!/^\d{1,10}$/.test(formData.rollNo)) newErrors.rollNo = "Roll number must be 1-10 digits";
      if (!formData.mobileNo.trim()) newErrors.mobileNo = "Mobile number is required";
      else if (!/^[0-9]{10}$/.test(formData.mobileNo)) newErrors.mobileNo = "Enter valid 10-digit number";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      else if (formData.description.trim().length < 10) newErrors.description = "Please provide more details (min. 10 characters)";
      else if (formData.description.trim().length > 500) newErrors.description = "Description too long (max 500 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(2)) return;

    try {
      setIsSubmitting(true);

      const res = await axios.post(
        `${API_BASE_URL}/complaints`,
        formData
      );

      if (res.data?.success) {
        setSubmitted(true);
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Complaint submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      name: "",
      hostel: "",
      block: "",
      roomNo: "",
      rollNo: "",
      mobileNo: "",
      description: ""
    });
    setSelectedCategory("");
    setCurrentStep(1);
    setSubmitted(false);
  };

  const inputClass = "w-full border-2 border-gray-200 p-4 rounded-2xl pl-14 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white shadow-sm text-gray-700 font-medium";
  const iconStyle = "absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide";

  const getCategoryInfo = (categoryId) => {
    return complaintCategories.find(cat => cat.id === categoryId);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaEdit className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">What's the Issue?</h3>
              <p className="text-gray-600 mt-2">Select the category that best describes your complaint</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {complaintCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `border-blue-500 bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : `${category.borderColor} ${category.bgColor} hover:shadow-md`
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <category.icon className={`text-2xl ${
                      selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-semibold text-center ${
                      selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {errors.category && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <FaExclamationTriangle className="text-red-500 text-xl" />
                <p className="text-red-700 font-medium">{errors.category}</p>
              </div>
            )}

            {selectedCategory && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-4">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold text-blue-800">
                      Selected: {getCategoryInfo(selectedCategory)?.name}
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      Please proceed to provide details about your issue
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        const categoryInfo = getCategoryInfo(formData.category);

        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaBuilding className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Complaint Details</h3>
              <p className="text-gray-600 mt-2">Provide specific information about your issue</p>
              
              {categoryInfo && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full mt-3">
                  <categoryInfo.icon className="text-gray-600" />
                  <span className="font-semibold text-gray-700">{categoryInfo.name}</span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field - Full width on mobile, half on desktop */}
              <div className="relative md:col-span-2">
                <label className={labelClass}>Full Name</label>
                <FaUser className="absolute left-5 top-1/3 transform -translate-y-1/2 text-gray-400 text-2xl" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={50}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠</span> {errors.name}
                </p>}
              </div>

              <div className="relative">
                <label className={labelClass}>Hostel</label>
                <FaBuilding className="absolute left-5 top-1/3 transform -translate-y-1/2 text-gray-400 text-2xl" />
                <select
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Hostel</option>
                  <optgroup label="Boys Hostel">
                    {hostels.boys.map(hostel => (
                      <option key={hostel} value={hostel}>{hostel}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Girls Hostel">
                    {hostels.girls.map(hostel => (
                      <option key={hostel} value={hostel}>{hostel}</option>
                    ))}
                  </optgroup>
                </select>
                {errors.hostel && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠</span> {errors.hostel}
                </p>}
              </div>

              <div className="relative">
                <label className={labelClass}>Block No</label>
                <FaBuilding className="absolute left-5 top-1/3 transform -translate-y-1/2 text-gray-400 text-2xl" />
                <select
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Block</option>
                  {blocks.map(block => (
                    <option key={block} value={block}>{block}</option>
                  ))}
                </select>
                {errors.block && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠</span> {errors.block}
                </p>}
              </div>

              <div className="relative">
                <label className={labelClass}>Room No</label>
                <FaDoorClosed className="absolute left-5 top-1/3 transform -translate-y-1/2 text-gray-400 text-2xl" />
                <input
                  type="text"
                  name="roomNo"
                  placeholder="Enter room number"
                  value={formData.roomNo}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={4}
                />
                {errors.roomNo && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠</span> {errors.roomNo}
                </p>}
              </div>

              <div className="relative">
                <label className={labelClass}>Roll No</label>
                <FaIdCard className="absolute left-5 top-1/3 transform -translate-y-1/2 text-gray-400 text-2xl" />
                <input
                  type="text"
                  name="rollNo"
                  placeholder="Enter roll number"
                  value={formData.rollNo}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={10}
                />
                {errors.rollNo && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠</span> {errors.rollNo}
                </p>}
              </div>

              <div className="relative md:col-span-2">
                <label className={labelClass}>Mobile Number</label>
                <FaPhone className="absolute left-5 top-1/3 transform -translate-y-1/2 text-gray-400 text-2xl" />
                <input
                  type="text"
                  name="mobileNo"
                  placeholder="10-digit mobile number"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={10}
                />
                {errors.mobileNo && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠</span> {errors.mobileNo}
                </p>}
              </div>

              <div className="relative md:col-span-2">
                <label className={labelClass}>
                  Description <span className="text-gray-500 text-xs font-normal">(Minimum 10 characters)</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Please describe your issue in detail. Include specific problems, when it started, and any other relevant information..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border-2 border-gray-200 p-4 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white shadow-sm text-gray-700 font-medium resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Be specific and detailed</span>
                  <span>{formData.description.length}/500 characters</span>
                </div>
                {errors.description && <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠</span> {errors.description}
                </p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-100 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Complaint Submitted!</h3>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Your complaint has been successfully registered. We'll address it within 24-48 hours.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <div className="text-left space-y-2">
                <p><span className="font-semibold">Name:</span> {formData.name}</p>
                <p><span className="font-semibold">Category:</span> {getCategoryInfo(formData.category)?.name}</p>
                <p><span className="font-semibold">Hostel:</span> {formData.hostel}</p>
                <p><span className="font-semibold">Location:</span> {formData.block}, Room {formData.roomNo}</p>
                <p><span className="font-semibold">Roll No:</span> {formData.rollNo}</p>
                <p><span className="font-semibold">Reference ID:</span> PUH{Date.now().toString().slice(-6)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={resetForm}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Submit Another Complaint
              </button>
              
              <Link
                to="/"
                className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 cursor-pointer text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl shadow-2xl mb-6">
            <GiGraduateCap className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-4">
            Hostel Complaint System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Report issues and get them resolved quickly
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex flex-col items-center ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 ${
                    currentStep > step 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : currentStep === step
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : 'bg-gray-200'
                  }`}>
                    {currentStep > step ? (
                      <FaCheckCircle className="text-sm" />
                    ) : (
                      <span className="font-semibold">{step}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold">
                    {step === 1 ? 'Category' : 'Details'}
                  </span>
                </div>
                {step < 2 && (
                  <div className={`w-12 h-1 rounded-full ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    currentStep === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-500 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl cursor-pointer'
                  }`}
                >
                  Previous
                </button>

                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedCategory}
                    className={`px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      !selectedCategory
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer'
                    }`}
                  >
                    Next Step
                    <FaCheckCircle />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-12 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Submit Complaint
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ⚡ Emergency? Call Hostel Office: +91-XXXXX-XXXXX
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplainSignIn;