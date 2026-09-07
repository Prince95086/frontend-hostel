import React from "react";
import {
  FaHeartbeat,
  FaAmbulance,
  FaUserMd,
  FaClock,
  FaPhone,
  FaFirstAid,
  FaStethoscope,
  FaHospital
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";

const MedicalServices = () => {
  const services = [
    {
      icon: FaUserMd,
      title: "Doctor Consultation",
      description: "Regular check-ups and medical consultations",
      timing: "9:00 AM - 5:00 PM",
      emergency: false
    },
    {
      icon: FaFirstAid,
      title: "First Aid",
      description: "Immediate medical assistance for minor injuries",
      timing: "24/7 Available",
      emergency: true
    },
    {
      icon: FaAmbulance,
      title: "Emergency Services",
      description: "Ambulance and critical care support",
      timing: "24/7 Available",
      emergency: true
    },
    {
      icon: FaStethoscope,
      title: "Specialist Referral",
      description: "Referral to specialized doctors and hospitals",
      timing: "During working hours",
      emergency: false
    }
  ];

  const medicalStaff = [
    { name: "Dr. Sharma", designation: "Chief Medical Officer", availability: "Mon-Fri, 9AM-5PM" },
    { name: "Dr. Patel", designation: "Resident Doctor", availability: "24/7 Rotation" },
    { name: "Ms. Gupta", designation: "Head Nurse", availability: "24/7 Rotation" }
  ];

  const emergencyContacts = [
    { name: "Medical Emergency", number: "+91-9876543210", type: "emergency" },
    { name: "Ambulance", number: "+91-9876543211", type: "emergency" },
    { name: "Appointment", number: "+91-9876543212", type: "general" },
    { name: "Pharmacy", number: "+91-9876543213", type: "general" }
  ];

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-500 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaHospital className="text-6xl text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Medical Services</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive healthcare services for students with 24/7 emergency support
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Emergency Banner */}
        <section className="mb-12">
          <div className="bg-red-600 text-white rounded-2xl p-6 text-center shadow-lg">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <FaAmbulance className="text-3xl animate-pulse" />
              <h2 className="text-3xl font-bold">Emergency Hotline</h2>
              <FaAmbulance className="text-3xl animate-pulse" />
            </div>
            <div className="text-4xl font-bold mb-2">+91-9876543210</div>
            <p className="text-red-100">Available 24/7 for medical emergencies</p>
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete medical care and support for all health-related needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className={`rounded-2xl p-6 shadow-lg border-2 ${
                service.emergency 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    service.emergency ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    <service.icon className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaClock className={service.emergency ? 'text-red-500' : 'text-blue-500'} />
                      <span className={service.emergency ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                        {service.timing}
                      </span>
                    </div>
                  </div>
                </div>
                {service.emergency && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                    Emergency Service
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Medical Staff */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Medical Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {medicalStaff.map((staff, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserMd className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{staff.name}</h3>
                <div className="text-blue-600 font-semibold mb-3">{staff.designation}</div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <FaClock />
                  <span>{staff.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contacts & Information */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
              <FaPhone className="text-red-500" />
              <span>Important Contacts</span>
            </h3>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className={`p-4 rounded-xl ${
                  contact.type === 'emergency' ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{contact.name}</div>
                      {contact.type === 'emergency' && (
                        <div className="text-red-600 text-sm font-semibold">Emergency</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{contact.number}</div>
                      <button className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors">
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Health Tips</h3>
            <div className="space-y-4">
              {[
                "Stay hydrated and drink plenty of water",
                "Maintain a balanced diet with fruits and vegetables",
                "Get adequate sleep (7-8 hours daily)",
                "Exercise regularly for physical and mental health",
                "Wash hands frequently to prevent infections"
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <FaHeartbeat className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-colors">
              Download Health Guide
            </button>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default MedicalServices;