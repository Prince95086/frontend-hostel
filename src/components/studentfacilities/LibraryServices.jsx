import React from "react";
import {
  FaBook,
  FaLaptop,
  FaUsers,
  FaSearch,
  FaClock,
  FaPrint,
  FaWifi,
  FaHeadphones
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";

const LibraryServices = () => {
  const libraryStats = [
    { number: "50,000+", label: "Books Collection" },
    { number: "100+", label: "Research Journals" },
    { number: "24/7", label: "Digital Access" },
    { number: "500+", label: "Study Spaces" }
  ];

  const services = [
    {
      icon: FaBook,
      title: "Book Lending",
      description: "Borrow books for up to 15 days with renewal options",
      features: ["15-day lending period", "Online renewal", "No late fees for first week"]
    },
    {
      icon: FaLaptop,
      title: "Digital Library",
      description: "Access e-books, journals, and online resources",
      features: ["E-book access", "Online journals", "Research databases"]
    },
    {
      icon: FaUsers,
      title: "Group Study Rooms",
      description: "Book private rooms for collaborative study sessions",
      features: ["4-8 person capacity", "Whiteboards", "Presentation screens"]
    },
    {
      icon: FaSearch,
      title: "Research Support",
      description: "Get assistance with research and academic projects",
      features: ["Librarian support", "Citation help", "Research guides"]
    }
  ];

  const timing = [
    { day: "Monday - Friday", time: "8:00 AM - 10:00 PM" },
    { day: "Saturday", time: "9:00 AM - 8:00 PM" },
    { day: "Sunday", time: "10:00 AM - 6:00 PM" }
  ];

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaBook className="text-6xl text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Library Services</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Your gateway to knowledge with extensive resources and modern facilities
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Statistics */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {libraryStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive library services to support your academic journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-gray-700">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Facilities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Additional Facilities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FaPrint, name: "Printing & Scanning", desc: "High-quality printing services" },
              { icon: FaWifi, name: "WiFi Access", desc: "High-speed internet throughout" },
              { icon: FaHeadphones, name: "Audio Library", desc: "Audiobooks and podcasts" }
            ].map((facility, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <facility.icon className="text-3xl text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">{facility.name}</h3>
                <p className="text-gray-600 text-sm">{facility.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timing & Contact */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <FaClock className="text-green-500" />
                <span>Library Hours</span>
              </h3>
              <div className="space-y-4">
                {timing.map((slot, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-800">{slot.day}</span>
                    <span className="text-green-600 font-bold">{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Links</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors">
                  Online Catalog
                </button>
                <button className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-xl font-semibold transition-colors">
                  Book Study Room
                </button>
                <button className="w-full border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white py-3 rounded-xl font-semibold transition-colors">
                  Contact Librarian
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default LibraryServices;