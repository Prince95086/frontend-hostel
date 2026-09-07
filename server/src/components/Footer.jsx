import React from "react";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaYoutube,
  FaUniversity,
  FaWifi,
  FaShieldAlt,
  FaHeart
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <FaUniversity className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  PU Hostels
                </h3>
                <p className="text-blue-300 text-sm">Panjab University</p>
              </div>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Providing world-class accommodation and facilities for students at 
              Panjab University since 1947. Experience comfortable living and 
              excellent learning environment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-all duration-300 transform hover:scale-110">
                <FaFacebook className="text-white text-lg" />
              </a>
              <a href="#" className="bg-sky-500 hover:bg-sky-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110">
                <FaTwitter className="text-white text-lg" />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition-all duration-300 transform hover:scale-110">
                <FaInstagram className="text-white text-lg" />
              </a>
              <a href="#" className="bg-blue-700 hover:bg-blue-800 p-3 rounded-lg transition-all duration-300 transform hover:scale-110">
                <FaLinkedin className="text-white text-lg" />
              </a>
              <a href="#" className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-all duration-300 transform hover:scale-110">
                <FaYoutube className="text-white text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold mb-6 text-blue-500 border-l-4 border-blue-500 pl-3">
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                { name: "Hostel Admission", path: "/admission" },
                { name: "Room Allocation", path: "/rooms" },
                { name: "Fee Payment", path: "/fees" },
                { name: "Complaint Portal", path: "/complaint" },
                { name: "Mess Menu", path: "/mess" },
                { name: "Rules & Regulations", path: "/rules" },
                { name: "Emergency Contacts", path: "/emergency" },
                { name: "Student Portal", path: "/portal" }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="block text-gray-500 hover:text-white transition-all duration-300 hover:translate-x-2 hover:bg-blue-400 py-2 px-3 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Hostel Facilities */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold mb-6 text-green-500 border-l-4 border-green-500 pl-3">
              Our Facilities
            </h4>
            <div className="space-y-3">
              {[
                "24/7 WiFi Campus",
                "Modern Library",
                "Sports Complex",
                "Medical Center",
                "Cafeteria & Mess",
                "Laundry Services",
                "Security & CCTV",
                "Study Rooms",
                "Common Areas",
                "Parking Facility"
              ].map((facility, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-500 group">
                  <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="group-hover:text-green-400 transition-colors duration-300">
                    {facility}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold mb-6 text-yellow-500 border-l-4 border-yellow-500 pl-3">
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="bg-yellow-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-gray-500 group-hover:text-yellow-400 transition-colors duration-300">
                    Panjab University Hostels
                  </p>
                  <p className="text-gray-400 text-sm">
                    Sector 14, Chandigarh 160014
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 group">
                <div className="bg-green-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <FaPhone className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-gray-500 group-hover:text-yellow-400 transition-colors duration-300">
                    +91 172 253 4000
                  </p>
                  <p className="text-gray-400 text-sm">
                    Mon-Sun: 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 group">
                <div className="bg-blue-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-gray-500 group-hover:text-yellow-400 transition-colors duration-300">
                    hostel@puchd.ac.in
                  </p>
                  <p className="text-gray-400 text-sm">
                    Quick response guaranteed
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FaShieldAlt className="text-red-400" />
                  <span className="text-red-400 font-semibold">Emergency Contact</span>
                </div>
                <p className="text-gray-500 font-bold text-lg">+91 172 253 4111</p>
                <p className="text-red-300 text-sm">24/7 Emergency Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
          {[
            { icon: FaWifi, title: "High-Speed WiFi", desc: "Campus-wide coverage" },
            { icon: FaShieldAlt, title: "24/7 Security", desc: "Safe environment" },
            { icon: FaUniversity, title: "Quality Education", desc: "Learning focus" },
            { icon: FaHeart, title: "Student Care", desc: "Supportive staff" }
          ].map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-white text-2xl" />
              </div>
              <h5 className="font-semibold text-white mb-1">{feature.title}</h5>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © {currentYear} Panjab University Hostels. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Cookie Policy", path: "/cookies" },
                { name: "Disclaimer", path: "/disclaimer" }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="text-gray-500 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>for students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-white text-sm font-medium">
              🎓 Need help with hostel admission?
            </div>
            <div className="flex space-x-4">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors duration-300">
                Apply Now
              </button>
              <button className="border border-white text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;