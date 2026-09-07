import React from "react";
import {
  FaCertificate,
  FaIdCard,
  FaFileAlt,
  FaCheckCircle,
  FaDownload,
  FaPrint
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";


const Requirements = () => {
  const documentCategories = [
    {
      category: "Academic Documents",
      icon: FaCertificate,
      items: [
        "10th Grade Marksheet & Certificate",
        "12th Grade Marksheet & Certificate", 
        "Graduation Marksheets (if applicable)",
        "Transfer Certificate",
        "Migration Certificate",
        "Character Certificate"
      ]
    },
    {
      category: "Identity Proof",
      icon: FaIdCard,
      items: [
        "Aadhar Card / Passport",
        "PAN Card",
        "Recent Passport Size Photographs (4 copies)",
        "Signature Scan",
        "Birth Certificate"
      ]
    },
    {
      category: "Additional Documents",
      icon: FaFileAlt,
      items: [
        "Caste Certificate (if applicable)",
        "Income Certificate", 
        "Medical Fitness Certificate",
        "Anti-Ragging Affidavit",
        "Gap Certificate (if applicable)"
      ]
    }
  ];

  return (
   <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Admission Requirements</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Ensure you have all the necessary documents ready before starting your application
        </p>
      </div>

      {/* Document Categories */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {documentCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <category.icon className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{category.category}</h3>
            </div>
            
            <ul className="space-y-3">
              {category.items.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Important Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Document Specifications:</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• All documents must be scanned in PDF format</li>
              <li>• File size should not exceed 2MB per document</li>
              <li>• Ensure documents are clear and readable</li>
              <li>• Photos should be recent and passport-sized</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Verification Process:</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Original documents must be presented during verification</li>
              <li>• Self-attested copies are required</li>
              <li>• Documents should be in English or Hindi</li>
              <li>• Keep digital copies ready for upload</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors">
          <FaDownload />
          <span>Download Checklist</span>
        </button>
        <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors">
          <FaPrint />
          <span>Print Requirements</span>
        </button>
      </div>
    </div>
    </div>
  );
};

export default Requirements;