import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";

const ImportantDates = () => {
  const admissionDates = [
    {
      event: "Application Start Date",
      date: "June 1, 2024",
      status: "upcoming",
      description: "Online application portal opens for new admissions",
      priority: "high"
    },
    {
      event: "Last Date for Application",
      date: "July 15, 2024",
      status: "upcoming", 
      description: "Final date to submit online applications",
      priority: "high"
    },
    {
      event: "Document Verification",
      date: "July 16-20, 2024",
      status: "upcoming",
      description: "Verification of submitted documents",
      priority: "medium"
    },
    {
      event: "Merit List Announcement",
      date: "July 22, 2024",
      status: "upcoming",
      description: "First merit list will be published",
      priority: "high"
    },
    {
      event: "Fee Payment Deadline",
      date: "July 25, 2024",
      status: "upcoming",
      description: "Last date for admission fee payment",
      priority: "high"
    },
    {
      event: "Hostel Allocation",
      date: "August 1, 2024", 
      status: "upcoming",
      description: "Hostel room allocation announcement",
      priority: "medium"
    },
    {
      event: "Orientation Program",
      date: "August 5, 2024",
      status: "upcoming",
      description: "New student orientation program",
      priority: "medium"
    },
    {
      event: "Classes Commence",
      date: "August 10, 2024",
      status: "upcoming",
      description: "Beginning of academic session",
      priority: "high"
    }
  ];

  const getStatusColor = (status, priority) => {
    if (priority === "high") return "bg-red-100 text-red-800 border-red-200";
    if (status === "upcoming") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "high") return <FaExclamationTriangle className="text-red-500" />;
    return <FaCheckCircle className="text-blue-500" />;
  };

  return (
    <div>
      <Abovenavbar/>
    <NavbarMenu/>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Important Dates</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Mark your calendar and stay updated with crucial admission deadlines
        </p>
      </div>

      {/* Dates Timeline */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {admissionDates.map((date, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${
              date.priority === "high" ? "border-red-200" : "border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getPriorityIcon(date.priority)}
                <h3 className="text-lg font-bold text-gray-800">{date.event}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                getStatusColor(date.status, date.priority)
              }`}>
                {date.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-2 text-blue-600">
                <FaCalendarAlt />
                <span className="font-semibold">{date.date}</span>
              </div>
              {date.priority === "high" && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                  <FaExclamationTriangle />
                  <span>High Priority</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{date.description}</p>
            
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm">
                <FaBell />
                <span>Set Reminder</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700 text-sm">
                Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">High Priority - Don't Miss</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Upcoming Deadline</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Completed</span>
          </div>
        </div>
      </div>

      {/* Reminder Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
        <FaClock className="text-4xl mx-auto mb-4 text-yellow-300" />
        <h3 className="text-2xl font-bold mb-4">Never Miss a Deadline!</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Subscribe to get reminders and updates about important admission dates
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors">
            Subscribe to Alerts
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Download Calendar
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ImportantDates;