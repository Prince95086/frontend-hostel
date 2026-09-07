import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaBook,
  FaDoorClosed,
  FaIdCard,
  FaCamera,
  FaSignature,
  FaUserGraduate,
  FaBuilding,
  FaUpload,
  FaCheck,
  FaLock,
  FaIdBadge,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaSpinner
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// UPDATED: Using Render URL
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com/api";

const StudentSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    year: "",
    dept: "",
    branch: "",
    category: "",
    hostel: "",
    block: "",
    roomNo: "",
    rollNo: "",
    photo: null,
    signature: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState({ photo: "", signature: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  // Availability states
  const [availability, setAvailability] = useState({
    email: { available: null, checking: false, message: "" },
    phone: { available: null, checking: false, message: "" },
    rollNo: { available: null, checking: false, message: "" }
  });

  // Get verified email from storage on component mount
  useEffect(() => {
    const verifiedEmail = localStorage.getItem("verifiedEmail") || sessionStorage.getItem("verifiedEmail");
    if (verifiedEmail) {
      setFormData(prev => ({ ...prev, email: verifiedEmail }));
      // Check email availability immediately when component mounts
      if (verifiedEmail) {
        checkFieldAvailability('email', verifiedEmail);
      }
    } else {
      // If no verified email found, redirect back to email verification
      toast.warning("Please verify your email first");
      navigate("/emailverify");
    }
  }, [navigate]);

  // Check field availability in database
  const checkFieldAvailability = async (field, value) => {
    // Don't check if value is empty
    if (!value) return;

    // Set minimum length requirements
    if (field === 'phone' && value.length < 10) return;
    if (field === 'rollNo' && value.length < 4) return;
    if (field === 'email' && value.length < 5) return;

    setAvailability(prev => ({
      ...prev,
      [field]: { ...prev[field], checking: true, message: "" }
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/students/check-field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value })
      });

      const data = await response.json();

      if (data.exists) {
        setAvailability(prev => ({
          ...prev,
          [field]: {
            available: false,
            checking: false,
            message: `❌ This ${field} is already registered`
          }
        }));
        
        // Set error for the field
        setErrors(prev => ({
          ...prev,
          [field]: `This ${field} is already registered`
        }));

        // Show toast notification immediately
        toast.error(`❌ This ${field} is already registered!`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        setAvailability(prev => ({
          ...prev,
          [field]: {
            available: true,
            checking: false,
            message: `✅ This ${field} is available`
          }
        }));
        
        // Clear error if it exists
        if (errors[field]) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }

        // Show success toast for available field
        toast.success(`✅ This ${field} is available!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(`Error checking ${field}:`, error);
      setAvailability(prev => ({
        ...prev,
        [field]: {
          available: null,
          checking: false,
          message: "Error checking availability"
        }
      }));
    }
  };

  // Immediate check for phone as user types
  useEffect(() => {
    if (formData.phone && formData.phone.length === 10) {
      checkFieldAvailability('phone', formData.phone);
    } else if (formData.phone && formData.phone.length < 10) {
      // Reset availability if phone is incomplete
      setAvailability(prev => ({
        ...prev,
        phone: { available: null, checking: false, message: "" }
      }));
    }
  }, [formData.phone]);

  // Immediate check for rollNo as user types
  useEffect(() => {
    if (formData.rollNo && formData.rollNo.length === 4) {
      checkFieldAvailability('rollNo', formData.rollNo);
    } else if (formData.rollNo && formData.rollNo.length < 4) {
      // Reset availability if rollNo is incomplete
      setAvailability(prev => ({
        ...prev,
        rollNo: { available: null, checking: false, message: "" }
      }));
    }
  }, [formData.rollNo]);

  // Show loading toast
  const showLoadingToast = (message) => {
    return toast.loading(message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Show success toast
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Show error toast
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // Validation for roomNo and rollNo
      if (name === "roomNo" && value.length > 3) return;
      if (name === "rollNo" && value.length > 4) return;
      if ((name === "roomNo" || name === "rollNo") && !/^\d*$/.test(value)) return;

      setFormData({ ...formData, [name]: value });

      // Clear error for this field as user is typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      // For phone and rollNo, reset availability when user starts typing again
      if (name === 'phone' || name === 'rollNo') {
        if (value.length < (name === 'phone' ? 10 : 4)) {
          setAvailability(prev => ({
            ...prev,
            [name]: { available: null, checking: false, message: "" }
          }));
        }
      }
    }
  };

  const validateStep = (step) => {
    let newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      
      // Email validation
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      else if (availability.email.available === false) {
        newErrors.email = "Email already registered";
      }
      
      // Password validation
      if (!formData.password.trim()) newErrors.password = "Password is required";
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) 
        newErrors.password = "Must include uppercase, lowercase, and number";
      
      // Phone validation
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Enter valid 10-digit number";
      else if (availability.phone.available === false) {
        newErrors.phone = "Phone number already registered";
      }
    }
    
    if (step === 2) {
      if (!formData.year.trim()) newErrors.year = "Year is required";
      if (!formData.dept.trim()) newErrors.dept = "Department is required";
      if (!formData.branch.trim()) newErrors.branch = "Branch is required";
      if (!formData.category.trim()) newErrors.category = "Category is required";
    }
    
    if (step === 3) {
      if (!formData.hostel.trim()) newErrors.hostel = "Hostel is required";
      if (!formData.block.trim()) newErrors.block = "Block is required";
      if (!formData.roomNo.trim()) newErrors.roomNo = "Room No is required";
      else if (!/^[0-9]{1,3}$/.test(formData.roomNo)) newErrors.roomNo = "Max 3 digits";
      
      // Roll number validation
      if (!formData.rollNo.trim()) newErrors.rollNo = "Roll No is required";
      else if (!/^[0-9]{1,4}$/.test(formData.rollNo)) newErrors.rollNo = "Max 4 digits";
      else if (availability.rollNo.available === false) {
        newErrors.rollNo = "Roll number already registered";
      }
    }
    
    if (step === 4) {
      if (!formData.photo) newErrors.photo = "Photo required";
      else if (formData.photo.size > 5 * 1024 * 1024) newErrors.photo = "Photo must be less than 5MB";
      if (!formData.signature) newErrors.signature = "Signature required";
      else if (formData.signature.size > 5 * 1024 * 1024) newErrors.signature = "Signature must be less than 5MB";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submit
    if (!validateStep(4)) {
      return;
    }

    // Check if any fields are still being checked
    if (availability.email.checking || availability.phone.checking || availability.rollNo.checking) {
      showErrorToast("Please wait while we verify your information");
      return;
    }

    // Check if any fields are unavailable
    if (availability.email.available === false || 
        availability.phone.available === false || 
        availability.rollNo.available === false) {
      showErrorToast("Please fix the errors before submitting");
      return;
    }

    const loadingToastId = showLoadingToast("Registering... Please wait");
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataObj = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'photo' && key !== 'signature') {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Append files
      if (formData.photo) {
        formDataObj.append('photo', formData.photo);
      }
      if (formData.signature) {
        formDataObj.append('signature', formData.signature);
      }

      // Make API call
      const response = await fetch(`${API_BASE_URL}/students/register`, {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details?.join(', ') || 'Registration failed');
      }

      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show success toast
      showSuccessToast(`🎉 Registration Successful! Welcome ${data.data.name}`);
      
      // Clear verified email from storage
      localStorage.removeItem("verifiedEmail");
      sessionStorage.removeItem("verifiedEmail");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        year: "",
        dept: "",
        branch: "",
        category: "",
        hostel: "",
        block: "",
        roomNo: "",
        rollNo: "",
        photo: null,
        signature: null,
      });
      
      setPreview({ photo: "", signature: "" });
      setCurrentStep(1);
      setShowPassword(false);
      setAvailability({
        email: { available: null, checking: false, message: "" },
        phone: { available: null, checking: false, message: "" },
        rollNo: { available: null, checking: false, message: "" }
      });

      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show error toast
      showErrorToast(error.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAcademicYears = () => {
    const years = [];
    for (let year = 2024; year <= 2050; year++) {
      years.push(`${year}-${year + 1}`);
    }
    return years;
  };

  const academicYears = generateAcademicYears();

  const boysHostels = Array.from({ length: 8 }, (_, i) => `BH${i + 1}`);
  const girlsHostels = Array.from({ length: 10 }, (_, i) => `GH${i + 1}`);

  const steps = [
    { number: 1, title: "Personal Info", icon: FaUser },
    { number: 2, title: "Academic Info", icon: FaUniversity },
    { number: 3, title: "Hostel Details", icon: FaBuilding },
    { number: 4, title: "Documents", icon: FaIdBadge }
  ];

  const inputClass = "w-full border-2 border-gray-200 p-4 rounded-2xl pl-14 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white shadow-sm text-gray-700 font-medium";
  const iconStyle = "absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide";

  // Helper function to render field status
  const renderFieldStatus = (field) => {
    const status = availability[field];
    
    if (status.checking) {
      return (
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <FaSpinner className="animate-spin text-blue-500" />
        </div>
      );
    }
    
    if (status.available === true) {
      return (
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <FaCheck className="text-green-500" />
        </div>
      );
    }
    
    if (status.available === false) {
      return (
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
          <FaExclamationTriangle className="text-red-500" />
        </div>
      );
    }
    
    return null;
  };

  // Helper function to render field message
  const renderFieldMessage = (field) => {
    const status = availability[field];
    
    if (status.checking) {
      return (
        <p className="text-blue-500 text-sm mt-2 flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          Checking availability...
        </p>
      );
    }
    
    if (status.available === true) {
      return (
        <p className="text-green-500 text-sm mt-2 flex items-center gap-2">
          <FaCheck />
          {status.message}
        </p>
      );
    }
    
    if (status.available === false) {
      return (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-2 font-semibold">
          <FaExclamationTriangle />
          {status.message}
        </p>
      );
    }
    
    return null;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaUser className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
              <p className="text-gray-600 mt-2">Tell us about yourself</p>
            </div>

            <div className="grid gap-6">
              {/* Name Field */}
              <div className="relative">
                <label className={labelClass}>Full Name</label>
                <FaUser className={iconStyle} />
                <br />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field - Read Only with immediate check */}
              <div className="relative">
                <label className={labelClass}>Email Address (Verified)</label>
                <FaEnvelope className={iconStyle} />
                 <br />
                <input
                  type="email"
                  name="email"
                  placeholder="Verified email"
                  value={formData.email}
                  readOnly
                  className={`${inputClass} ${availability.email.available === false ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-200 text-green-700'} cursor-not-allowed`}
                />
                {availability.email.checking ? (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <FaSpinner className="animate-spin text-blue-500" />
                  </div>
                ) : availability.email.available === false ? (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <FaExclamationTriangle className="text-red-500" />
                  </div>
                ) : (
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                    <FaCheck className="text-green-500" />
                  </div>
                )}
                {availability.email.available === false && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2 font-semibold">
                    <FaExclamationTriangle /> {availability.email.message || "❌ This email is already registered"}
                  </p>
                )}
                {availability.email.available === true && (
                  <p className="text-green-500 text-sm mt-2 flex items-center gap-2">
                    <FaCheck /> {availability.email.message || "✅ Email is available"}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                
                <label className={labelClass}>Create Password</label>
                
               
                
                  
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.password}
                  </p>
                )}
                {!errors.password && formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-1/3 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`w-1/3 h-2 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`w-1/3 h-2 rounded-full ${/(?=.*\d)/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use 8+ chars with uppercase, lowercase & number
                    </p>
                  </div>
                )}
              </div>

              {/* Phone Field with Immediate Availability Check */}
              <div className="relative">
                <label className={labelClass}>Phone Number</label>
                <FaPhone className={iconStyle} />
                 <br />
                <input
                  type="text"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    availability.phone.available === false ? 'border-red-500 bg-red-50' : 
                    availability.phone.available === true ? 'border-green-500 bg-green-50' : ''
                  }`}
                  maxLength={10}
                />
                {renderFieldStatus('phone')}
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.phone}
                  </p>
                )}
                {!errors.phone && renderFieldMessage('phone')}
                {formData.phone && formData.phone.length < 10 && (
                  <p className="text-gray-500 text-sm mt-2">
                    {10 - formData.phone.length} digits remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaUniversity className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Academic Information</h3>
              <p className="text-gray-600 mt-2">Your educational background</p>
            </div>

            <div className="grid gap-6">
              <div className="relative">
                <label className={labelClass}>Academic Year</label>
                <FaUniversity className={iconStyle} />
                <br />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.year}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className={labelClass}>Department</label>
                <FaBook className={iconStyle} />
                <br />
                <input
                  type="text"
                  name="dept"
                  placeholder="Enter your department"
                  value={formData.dept}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.dept && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.dept}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className={labelClass}>Branch</label>
                <FaBook className={iconStyle} />
                <br />
                <input
                  type="text"
                  name="branch"
                  placeholder="e.g., B.Tech Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.branch && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.branch}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className={labelClass}>Category</label>
                <FaUserGraduate className={iconStyle} />
                <br />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  <option value="GEN">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaBuilding className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Hostel Details</h3>
              <p className="text-gray-600 mt-2">Your accommodation information</p>
            </div>

            <div className="grid gap-6">
              <div className="relative">
                <label className={labelClass}>Select Hostel</label>
                <FaBuilding className={iconStyle} />
                 <br />
                <select
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Your Hostel</option>
                  <optgroup label="Boys Hostels">
                    {boysHostels.map((hostel) => (
                      <option key={hostel} value={hostel}>
                        {hostel} - Boys Hostel
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Girls Hostels">
                    {girlsHostels.map((hostel) => (
                      <option key={hostel} value={hostel}>
                        {hostel} - Girls Hostel
                      </option>
                    ))}
                  </optgroup>
                </select>
                {errors.hostel && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.hostel}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className={labelClass}>Hostel Block</label>
                <FaBuilding className={iconStyle} />
                 <br />
                <select
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Hostel Block</option>
                  <option value="1">Block 1</option>
                  <option value="2">Block 2</option>
                  <option value="3">Block 3</option>
                  <option value="4">Block 4</option>
                  <option value="5">Block 5</option>
                  <option value="6">Block 6</option>
                  <option value="7">Block 7</option>
                </select>
                {errors.block && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.block}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className={labelClass}>Room Number</label>
                <FaDoorClosed className={iconStyle} />
                 <br />
                <input
                  type="text"
                  name="roomNo"
                  placeholder="3-digit room number"
                  value={formData.roomNo}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={3}
                />
                {errors.roomNo && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.roomNo}
                  </p>
                )}
              </div>

              {/* Roll Number Field with Immediate Availability Check */}
              <div className="relative">
                <label className={labelClass}>Hostel Roll No</label>
                <FaIdCard className={iconStyle} />
                 <br />
                  <br />
                <input
                  type="text"
                  name="rollNo"
                  placeholder="4-digit roll number"
                  value={formData.rollNo}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    availability.rollNo.available === false ? 'border-red-500 bg-red-50' : 
                    availability.rollNo.available === true ? 'border-green-500 bg-green-50' : ''
                  }`}
                  maxLength={4}
                />
                {renderFieldStatus('rollNo')}
                {errors.rollNo && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle /> {errors.rollNo}
                  </p>
                )}
                {!errors.rollNo && renderFieldMessage('rollNo')}
                {formData.rollNo && formData.rollNo.length < 4 && (
                  <p className="text-gray-500 text-sm mt-2">
                    {4 - formData.rollNo.length} digits remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaIdBadge className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Documents Upload</h3>
              <p className="text-gray-600 mt-2">Upload required documents (Max 5MB each)</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border-2 border-dashed border-blue-200">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaCamera className="text-white text-lg" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">Photograph</h4>
                  <p className="text-gray-600 text-sm">Passport size photo</p>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  {preview.photo ? (
                    <div className="w-40 h-40 border-4 border-blue-300 rounded-2xl bg-white shadow-lg overflow-hidden">
                      <img 
                        src={preview.photo} 
                        alt="Applicant" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 border-4 border-dashed border-blue-300 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-blue-400">
                      <FaCamera className="text-2xl mb-2" />
                      <span className="text-sm font-medium">Upload Photo</span>
                    </div>
                  )}
                  
                  <label className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                    <FaUpload />
                    Choose Photo
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors.photo && (
                  <p className="text-red-500 text-sm mt-3 text-center flex items-center justify-center gap-2">
                    <FaExclamationTriangle /> {errors.photo}
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border-2 border-dashed border-green-200">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaSignature className="text-white text-lg" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">Signature</h4>
                  <p className="text-gray-600 text-sm">Your digital signature</p>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  {preview.signature ? (
                    <div className="w-64 h-24 border-4 border-green-300 rounded-2xl bg-white shadow-lg overflow-hidden">
                      <img 
                        src={preview.signature} 
                        alt="Signature" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-24 border-4 border-dashed border-green-300 rounded-2xl bg-green-50 flex flex-col items-center justify-center text-green-400">
                      <FaSignature className="text-xl mb-2" />
                      <span className="text-sm font-medium">Upload Signature</span>
                    </div>
                  )}
                  
                  <label className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                    <FaUpload />
                    Choose Signature
                    <input
                      type="file"
                      name="signature"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors.signature && (
                  <p className="text-red-500 text-sm mt-3 text-center flex items-center justify-center gap-2">
                    <FaExclamationTriangle /> {errors.signature}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      {/* Toast Container */}
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
        theme="colored"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl shadow-2xl mb-6">
            <GiGraduateCap className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-blue-500  mb-4">
            Student Registration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join Panjab University Hostel - Complete your registration in simple steps
          </p>
          {formData.email && (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              availability.email.available === false 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {availability.email.available === false ? (
                <FaExclamationTriangle className="text-red-600" />
              ) : (
                <FaCheck className="text-green-600" />
              )}
              <span className="font-medium">
                {availability.email.available === false 
                  ? `❌ Email already registered: ${formData.email}`
                  : `✅ Verified: ${formData.email}`
                }
              </span>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 ${
                    currentStep > step.number 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : currentStep === step.number
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : 'bg-gray-200'
                  }`}>
                    {currentStep > step.number ? (
                      <FaCheck className="text-sm" />
                    ) : (
                      <step.icon className="text-lg" />
                    )}
                  </div>
                  <span className="text-xs font-semibold">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 rounded-full ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
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

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={availability.email.available === false || availability.phone.available === false}
                    className={`px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      availability.email.available === false || availability.phone.available === false
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    Next Step
                    <FaCheck />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || availability.email.checking || availability.phone.checking || availability.rollNo.checking || availability.email.available === false || availability.phone.available === false || availability.rollNo.available === false}
                    className={`px-12 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      isSubmitting || availability.email.checking || availability.phone.checking || availability.rollNo.checking || availability.email.available === false || availability.phone.available === false || availability.rollNo.available === false
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-xl cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : availability.email.checking || availability.phone.checking || availability.rollNo.checking ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Verifying...
                      </>
                    ) : availability.email.available === false || availability.phone.available === false || availability.rollNo.available === false ? (
                      <>
                        <FaExclamationTriangle />
                        Fix Errors
                      </>
                    ) : (
                      <>
                        <FaLock />
                        Complete Registration
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
            🔒 Your information is secure and protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignupPage;