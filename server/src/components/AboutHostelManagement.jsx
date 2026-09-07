import React from "react";
import {
  FaUsers,
  FaShieldAlt,
  FaTools,
  FaChartLine,
  FaHeart,
  FaAward,
  FaClock,
  FaMobileAlt,
  FaBuilding,
  FaUserCheck,
  FaLock,
  FaWifi,
  FaUtensils,
  FaTint,
  FaSnowflake,
  FaBroom,
  FaFirstAid,
  
  FaInfoCircle
} from "react-icons/fa";
import Abovenavbar from "./Abovenavbar";
import NavbarMenu from "./NavbarMenu";

const AboutHostelManagement = () => {
  const features = [
    {
      icon: FaUserCheck,
      title: "Digital Registration",
      description: "Streamlined online registration process with instant verification and approval"
    },
    {
      icon: FaLock,
      title: "Secure Access",
      description: "Advanced security systems with biometric and digital access control"
    },
    {
      icon: FaWifi,
      title: "High-Speed Internet",
      description: "Campus-wide WiFi coverage with 24/7 connectivity"
    },
    {
      icon: FaUtensils,
      title: "Modern Mess Facility",
      description: "Hygienic and nutritious meals with diverse menu options"
    },
    {
      icon: FaTint,
      title: "24/7 Water Supply",
      description: "Round-the-clock hot and cold water availability"
    },
    {
      icon: FaSnowflake,
      title: "Air Conditioning",
      description: "Centralized AC systems in all hostel blocks"
    },
    {
      icon: FaBroom,
      title: "Housekeeping",
      description: "Daily cleaning and maintenance services"
    },
    {
      icon: FaFirstAid,
      title: "Medical Support",
      description: "24/7 medical room with trained staff and ambulance service"
    },
   
  ];

  const stats = [
    { number: "5000+", label: "Students Accommodated", icon: FaUsers },
    { number: "15+", label: "Hostel Blocks", icon: FaBuilding },
    { number: "24/7", label: "Security & Support", icon: FaShieldAlt },
    { number: "99%", label: "Student Satisfaction", icon: FaHeart }
  ];

  const managementTeam = [
    {
      name: "Dr. Rajesh Kumar",
      position: "Chief Warden",
      qualification: "Ph.D. in Campus Administration",
      experience: "15+ years in hostel management"
    },
    {
      name: "Ms. Priya Sharma",
      position: "Deputy Warden",
      qualification: "M.A. in Student Affairs",
      experience: "10+ years in student welfare"
    },
    {
      name: "Mr. Amit Singh",
      position: "Technical Head",
      qualification: "M.Tech in Computer Science",
      experience: "8+ years in digital systems"
    },
    {
      name: "Dr. Sunita Verma",
      position: "Medical Officer",
      qualification: "M.B.B.S., M.D.",
      experience: "12+ years in healthcare"
    }
  ];

  const values = [
    {
      icon: FaHeart,
      title: "Student-Centric Approach",
      description: "We prioritize student comfort, safety, and overall development"
    },
    {
      icon: FaAward,
      title: "Excellence in Service",
      description: "Committed to providing world-class hostel facilities and services"
    },
    {
      icon: FaClock,
      title: "24/7 Availability",
      description: "Round-the-clock support staff and emergency services"
    },
    {
      icon: FaMobileAlt,
      title: "Digital Innovation",
      description: "Leveraging technology for seamless hostel management"
    }
  ];

  // Add navigation handlers
  const handleApplyForHostel = () => {
    // Navigate to registration page or show modal
    window.location.href = "/register";
  };

  const handleContactAdmin = () => {
    // Navigate to contact page or show contact modal
    window.location.href = "/contact";
  };

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaInfoCircle className="text-6xl text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Hostel Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Creating a home away from home with world-class facilities, 
            robust security, and a nurturing environment for academic excellence.
          </p>
          <div className="w-24 h-2 bg-yellow-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Welcome to Our Hostel Community
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our hostel management system is designed to provide a safe, comfortable, 
                and conducive living environment for students. We understand that a good 
                living space is crucial for academic success and personal growth.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With state-of-the-art facilities, dedicated staff, and a student-centric 
                approach, we ensure that every resident feels at home while focusing on 
                their educational journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                  🎯 Mission Driven
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                  💡 Innovation Focused
                </div>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                  🤝 Community Building
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Hostel Building" 
                className="rounded-2xl shadow-lg h-64 w-full object-cover"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%236b7280'%3EHostel Building%3C/text%3E%3C/svg%3E";
                }}
              />
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Student Room" 
                className="rounded-2xl shadow-lg h-64 w-full object-cover mt-8"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%236b7280'%3EStudent Room%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                  <stat.icon className="text-3xl mx-auto mb-4 text-yellow-300" />
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              World-Class Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive amenities to ensure a comfortable and productive 
              stay for all our residents.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="bg-blue-500 group-hover:bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Management Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to providing the best hostel experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managementTeam.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:transform hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                  {member.position}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  <strong className="text-gray-800">Qualification:</strong> {member.qualification}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong className="text-gray-800">Experience:</strong> {member.experience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our operations and service delivery
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-green-500 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <value.icon className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <FaChartLine className="text-4xl mx-auto mb-4 text-yellow-300" />
                <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg leading-relaxed">
                  To be the leading provider of student accommodation, setting benchmarks 
                  in comfort, security, and holistic development through innovative 
                  hostel management solutions.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                <FaTools className="text-4xl mx-auto mb-4 text-yellow-300" />
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg leading-relaxed">
                  To create a safe, inclusive, and stimulating living environment that 
                  supports academic excellence, personal growth, and community building 
                  among students from diverse backgrounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Join Our Hostel Community?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of comfort, security, and community living. 
            Register today and become part of our growing family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleApplyForHostel}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Apply for Hostel
            </button>
            <button 
              onClick={handleContactAdmin}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
            >
              Contact Administration
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <FaUsers className="text-2xl text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer" />
            <FaShieldAlt className="text-2xl text-green-400 hover:text-green-300 transition-colors duration-300 cursor-pointer" />
            <FaHeart className="text-2xl text-red-400 hover:text-red-300 transition-colors duration-300 cursor-pointer" />
            <FaAward className="text-2xl text-yellow-400 hover:text-yellow-300 transition-colors duration-300 cursor-pointer" />
          </div>
          <p className="text-gray-400">
            © 2024 Hostel Management System. All rights reserved. | 
            Creating Better Living Spaces for Students
          </p>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default AboutHostelManagement;