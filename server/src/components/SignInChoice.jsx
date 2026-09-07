import React from "react";
import { Link } from "react-router-dom";
import { 
  FaUserGraduate, 
  FaUserShield, 
  FaUniversity, 
  FaArrowRight, 
  FaShieldAlt,
  FaStar,
  FaClock,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from "react-icons/fa";
import Footer from "./Footer";

const SignInChoice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full blur-xl opacity-20 animate-bounce"></div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-500">
              <FaUniversity className="text-white text-4xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-purple-500 to-indigo-600 bg-clip-text text-transparent mb-6">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Choose your role to access the Panjab University Hostel Management System
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
            {[
              { icon: FaUsers, number: "2,500+", label: "Students" },
              { icon: FaUniversity, number: "7", label: "Hostel Blocks" },
              { icon: FaStar, number: "4.8/5", label: "Rating" },
              { icon: FaClock, number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                <stat.icon className="text-blue-600 text-2xl mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Student Card */}
            <div className="group relative">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl  opacity-50 group-hover:opacity-30 transition-all duration-500"></div>
              <Link
                to="/signinasstudent"
                className="relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
              >
                <div className="p-10">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <FaUserGraduate className="text-white text-3xl" />
                    </div>
                    <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                      For Students
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Student Portal
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Access your personalized hostel dashboard with room details, mess services, and academic resources
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { name: "Room Allocation", emoji: "🏠" },
                      { name: "Fee Payment", emoji: "💳" },
                      { name: "Complaint Portal", emoji: "📝" },
                      { name: "Mess Services", emoji: "🍽️" },
                      { name: "Academic Calendar", emoji: "📅" },
                      { name: "Study Resources", emoji: "📚" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                        <span className="text-xl">{feature.emoji}</span>
                        <span className="text-gray-700 font-medium text-sm">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Button */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-500">
                    <div>
                      <div className="text-blue-600 font-bold text-lg">Student Login</div>
                      <div className="text-blue-500 text-sm">Access your account</div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <FaArrowRight className="text-blue-600 group-hover:text-white text-lg transition-colors duration-300" />
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Border */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </Link>
            </div>

            {/* Admin Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl  opacity-50 group-hover:opacity-30 transition-all duration-500"></div>
              <Link
                to="/signinasadmin"
                className="relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
              >
                <div className="p-10">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <FaUserShield className="text-white text-3xl" />
                    </div>
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                      For Administrators
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Admin Portal
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Manage hostel operations, student records, and administrative functions with powerful tools
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { name: "Student Management", emoji: "👨‍🎓" },
                      { name: "Room Allocation", emoji: "🏢" },
                      { name: "Fee Management", emoji: "💰" },
                      { name: "Admin Dashboard", emoji: "📊" },
                      { name: "Reports & Analytics", emoji: "📈" },
                      { name: "System Settings", emoji: "⚙️" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
                        <span className="text-xl">{feature.emoji}</span>
                        <span className="text-gray-700 font-medium text-sm">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Button */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-500">
                    <div>
                      <div className="text-green-600 font-bold text-lg">Admin Login</div>
                      <div className="text-green-500 text-sm">Manage system</div>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-500 shadow-lg">
                      <FaArrowRight className="text-green-600 group-hover:text-white text-lg transition-colors duration-300" />
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Border */}
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <FaShieldAlt className="text-green-500 text-2xl mr-3" />
                <h3 className="text-xl font-bold text-gray-800">Secure & Protected</h3>
              </div>
              <p className="text-gray-600 text-center">
                Your data is protected with enterprise-grade security. All information is encrypted and securely stored.
              </p>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default SignInChoice;