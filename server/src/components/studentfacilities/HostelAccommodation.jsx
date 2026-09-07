import React from "react";
import {
  FaBed,
  FaWifi,
  FaSnowflake,
  FaTint,
  FaShieldAlt,
  FaUtensils,
  FaTv,
  FaBroom,
  FaUsers,
  FaStar
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";

const HostelAccommodation = () => {
  const roomTypes = [
    {
      type: "Single Occupancy",
      price: "₹15,000/semester",
      description: "Private room with attached bathroom",
      features: ["Single Bed", "Study Table", "Wardrobe", "Attached Bathroom"],
      available: 25
    },
    {
      type: "Double Occupancy",
      price: "₹10,000/semester",
      description: "Shared room for two students",
      features: ["Two Beds", "Study Tables", "Shared Wardrobe", "Attached Bathroom"],
      available: 50
    },
    {
      type: "Triple Occupancy",
      price: "₹7,000/semester",
      description: "Shared room for three students",
      features: ["Three Beds", "Study Tables", "Storage Space", "Common Bathroom"],
      available: 75
    }
  ];

  const amenities = [
    { icon: FaWifi, name: "High-Speed WiFi", description: "24/7 internet connectivity" },
    { icon: FaSnowflake, name: "Air Conditioning", description: "Centralized AC in all rooms" },
    { icon: FaTint, name: "24/7 Water Supply", description: "Hot & cold water available" },
    { icon: FaShieldAlt, name: "Security", description: "CCTV surveillance & guards" },
    { icon: FaUtensils, name: "Mess Facility", description: "Hygienic food services" },
    { icon: FaTv, name: "Common Room", description: "TV & recreation area" },
    { icon: FaBroom, name: "Housekeeping", description: "Daily cleaning service" },
    { icon: FaUsers, name: "Warden Support", description: "24/7 warden availability" }
  ];

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaBed className="text-6xl text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Hostel Accommodation</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Comfortable, secure, and modern living spaces designed for student success
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Room Types */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Room Types & Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our variety of accommodation options to suit your needs and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roomTypes.map((room, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.type}</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">{room.price}</div>
                    <p className="text-gray-600">{room.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {room.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-gray-700">
                        <FaStar className="text-yellow-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Available Rooms</div>
                    <div className="text-2xl font-bold text-blue-600">{room.available}</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Hostel Amenities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern facilities designed for your comfort and convenience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <amenity.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{amenity.name}</h3>
                <p className="text-gray-600 text-sm">{amenity.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Hostel Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                Room {item}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
              View Full Gallery
            </button>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default HostelAccommodation;