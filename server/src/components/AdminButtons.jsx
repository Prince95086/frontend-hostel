import React from "react";
import { Link } from "react-router-dom";
import { FaUserShield, FaUserTie, FaUniversity, FaArrowRight, FaShieldAlt } from "react-icons/fa";

const SignInOptions = () => {
  const options = [
    {
      title: "Admin Portal",
      description: "Manage hostel operations, student records, and daily activities",
      path: "/admin-signin",
      icon: FaUserTie,
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      bgColor: "blue",
      features: ["Student Management", "Room Allocation", "Daily Operations"]
    },
    {
      title: "Super Admin",
      description: "Full system control with highest security privileges",
      path: "/superadmin-signin",
      icon: FaUserShield,
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      bgColor: "green",
      features: ["System Settings", "User Management", "Security Controls"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full blur-xl opacity-20 animate-bounce"></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-500">
            <FaUniversity className="text-white text-4xl" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Choose your role to access the Panjab University Hostel Management System
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {options.map((option, index) => (
            <div key={index} className="group relative">
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${option.color} rounded-3xl blur opacity-30 group-hover:opacity-70 transition-all duration-500`}></div>
              
              <Link
                to={option.path}
                className="relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden block"
              >
                <div className="p-8">
                  {/* Icon & Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <option.icon className="text-white text-2xl" />
                    </div>
                    <div className={`bg-${option.bgColor}-100 text-${option.bgColor}-600 px-4 py-2 rounded-full text-sm font-semibold`}>
                      {option.bgColor === 'blue' ? 'Administrator' : 'Super Admin'}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {option.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 bg-${option.bgColor}-500 rounded-full`}></div>
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <div className={`flex items-center justify-between bg-gradient-to-r from-${option.bgColor}-50 to-${option.bgColor}-100 rounded-2xl p-5 group-hover:from-${option.bgColor}-100 group-hover:to-${option.bgColor}-200 transition-all duration-500`}>
                    <div>
                      <div className={`text-${option.bgColor}-600 font-bold text-lg`}>
                        {option.title} Login
                      </div>
                      <div className={`text-${option.bgColor}-500 text-sm`}>
                        Access your dashboard
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-${option.bgColor}-500 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                      <FaArrowRight className={`text-${option.bgColor}-600 group-hover:text-white text-lg transition-colors duration-300`} />
                    </div>
                  </div>
                </div>
                
                {/* Animated Bottom Border */}
                <div className={`h-2 bg-gradient-to-r ${option.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}></div>
              </Link>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-center space-x-3">
              <FaShieldAlt className="text-green-500 text-xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Secure Access</h3>
                <p className="text-gray-600 text-sm">
                  All access is logged and monitored for security purposes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Panjab University Hostel Management System • v2.4.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInOptions;