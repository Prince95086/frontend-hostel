
import React from "react";
import {
  FaFileAlt,
  FaUpload,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUserGraduate,
  FaClock,
  FaArrowRight
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";


const ApplicationProcess = () => {
  const steps = [
    {
      step: 1,
      icon: FaFileAlt,
      title: "Online Application",
      description: "Fill out the digital application form with personal and academic details",
      duration: "15-20 minutes",
      status: "active"
    },
    {
      step: 2,
      icon: FaUpload,
      title: "Document Upload",
      description: "Upload required documents including photo, ID proof, and academic certificates",
      duration: "10 minutes",
      status: "pending"
    },
    {
      step: 3,
      icon: FaCheckCircle,
      title: "Application Review",
      description: "Our team verifies your documents and application details",
      duration: "2-3 working days",
      status: "pending"
    },
    {
      step: 4,
      icon: FaMoneyBillWave,
      title: "Fee Payment",
      description: "Pay the admission fee through secure online payment methods",
      duration: "5 minutes",
      status: "pending"
    },
    {
      step: 5,
      icon: FaUserGraduate,
      title: "Admission Confirmation",
      description: "Receive admission confirmation and hostel allocation details",
      duration: "24 hours",
      status: "pending"
    }
  ];

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Application Process</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Follow these simple steps to complete your admission process smoothly
        </p>
      </div>

      {/* Process Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-start space-x-6">
            {/* Step Number */}
            <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${
              step.status === 'active' 
                ? 'bg-green-500 shadow-lg shadow-green-200' 
                : 'bg-gray-300'
            }`}>
              {step.step}
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <step.icon className={`text-2xl ${
                  step.status === 'active' ? 'text-green-500' : 'text-gray-400'
                }`} />
                <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                {step.status === 'active' && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Current Step
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-500">
                  <FaClock />
                  <span className="text-sm">Estimated time: {step.duration}</span>
                </div>
                
                {step.status === 'active' && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors">
                    <span>Start Now</span>
                    <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Application?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our admission counselors are available to guide you through every step of the process
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Contact Support
          </button>
          <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Download Guide
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ApplicationProcess;