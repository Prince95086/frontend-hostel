import React from "react";
import {
  FaFutbol,
  FaBasketballBall,
  FaRunning,
  FaSwimmer,
  FaTableTennis,
  FaDumbbell,
  FaTrophy,
  FaUsers
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";

const SportsFacilities = () => {
  const sports = [
    {
      icon: FaFutbol,
      name: "Football",
      description: "Professional football ground with floodlights",
      timing: "6:00 AM - 9:00 PM",
      coach: "Available"
    },
    {
      icon: FaBasketballBall,
      name: "Basketball",
      description: "Indoor basketball court with professional flooring",
      timing: "7:00 AM - 10:00 PM",
      coach: "Available"
    },
    {
      icon: FaRunning,
      name: "Athletics",
      description: "400m synthetic track with field events facilities",
      timing: "5:00 AM - 8:00 PM",
      coach: "Available"
    },
    {
      icon: FaSwimmer,
      name: "Swimming",
      description: "Olympic-size swimming pool with trained lifeguards",
      timing: "6:00 AM - 7:00 PM",
      coach: "Available"
    },
    {
      icon: FaTableTennis,
      name: "Table Tennis",
      description: "International standard tables in indoor hall",
      timing: "8:00 AM - 10:00 PM",
      coach: "Available"
    },
    {
      icon: FaDumbbell,
      name: "Gymnasium",
      description: "Modern gym with cardio and weight training equipment",
      timing: "5:00 AM - 11:00 PM",
      coach: "Available"
    }
  ];

  const achievements = [
    { year: "2023", achievement: "Inter-University Football Champions" },
    { year: "2022", achievement: "State Level Basketball Winners" },
    { year: "2021", achievement: "National Athletics Medalists" }
  ];

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaTrophy className="text-6xl text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Sports Facilities</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            World-class sports infrastructure to nurture champions and promote fitness
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Sports Facilities Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Sports Facilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              State-of-the-art facilities with professional coaching support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <sport.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{sport.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{sport.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Timing:</span>
                    <span className="font-semibold text-orange-600">{sport.timing}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Coach:</span>
                    <span className="font-semibold text-green-600">{sport.coach}</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition-colors duration-300">
                  Book Slot
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Achievements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white/20 rounded-xl p-6 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold text-yellow-300 mb-2">{achievement.year}</div>
                  <div className="text-white font-semibold">{achievement.achievement}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership & Training */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
              <FaUsers className="text-orange-500" />
              <span>Sports Membership</span>
            </h3>
            <div className="space-y-4">
              {[
                { type: "Student Membership", price: "₹1,000/year", features: ["All facilities access", "Basic training"] },
                { type: "Premium Membership", price: "₹2,500/year", features: ["Priority booking", "Personal coaching"] }
              ].map((plan, index) => (
                <div key={index} className="border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-gray-800">{plan.type}</h4>
                    <span className="text-orange-600 font-bold">{plan.price}</span>
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600">• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              {[
                { event: "Annual Sports Day", date: "March 15, 2024" },
                { event: "Inter-College Tournament", date: "April 5, 2024" },
                { event: "Summer Training Camp", date: "May 1, 2024" }
              ].map((event, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-semibold text-gray-800">{event.event}</span>
                  <span className="text-orange-600 font-bold">{event.date}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 rounded-xl font-semibold transition-colors">
              View All Events
            </button>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default SportsFacilities;