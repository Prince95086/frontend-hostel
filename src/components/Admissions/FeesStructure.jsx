import React from "react";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCreditCard,
  FaShieldAlt,
  FaDownload
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";

const FeesStructure = () => {
  const feeCategories = [
    {
      category: "Admission Fees",
      fees: [
        { name: "Application Fee", amount: "₹1,000", type: "One-time", description: "Non-refundable application processing fee" },
        { name: "Registration Fee", amount: "₹5,000", type: "One-time", description: "Student registration and enrollment fee" },
        { name: "Security Deposit", amount: "₹10,000", type: "Refundable", description: "Refundable security deposit" }
      ]
    },
    {
      category: "Academic Fees",
      fees: [
        { name: "Tuition Fee", amount: "₹25,000/semester", type: "Per Semester", description: "Course tuition fees per semester" },
        { name: "Exam Fee", amount: "₹2,000/semester", type: "Per Semester", description: "Examination fees per semester" },
        { name: "Library Fee", amount: "₹1,500/semester", type: "Per Semester", description: "Library and resource charges" }
      ]
    },
    {
      category: "Hostel Fees",
      fees: [
        { name: "Hostel Rent", amount: "₹15,000/semester", type: "Per Semester", description: "Accommodation charges" },
        { name: "Mess Charges", amount: "₹12,000/semester", type: "Per Semester", description: "Food and mess charges" },
        { name: "Maintenance", amount: "₹2,000/semester", type: "Per Semester", description: "Hostel maintenance fee" }
      ]
    }
  ];

  const paymentMethods = [
    { name: "Credit Card", icon: "💳", description: "Visa, MasterCard, RuPay" },
    { name: "Debit Card", icon: "💳", description: "All major bank cards" },
    { name: "Net Banking", icon: "🏦", description: "150+ supported banks" },
    { name: "UPI", icon: "📱", description: "PhonePe, GPay, Paytm" }
  ];

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Fees Structure</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transparent and affordable fee structure with flexible payment options
        </p>
      </div>

      {/* Fee Categories */}
      <div className="space-y-8 mb-12">
        {feeCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
              <FaMoneyBillWave className="text-blue-500" />
              <span>{category.category}</span>
            </h2>
            
            <div className="space-y-4">
              {category.fees.map((fee, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{fee.name}</h3>
                    <p className="text-gray-600 text-sm">{fee.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{fee.amount}</div>
                    <div className="text-sm text-gray-500">{fee.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center">Total Fee Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-4 bg-white/20 rounded-xl">
            <span>One-time Fees</span>
            <span className="font-bold">₹16,000</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/20 rounded-xl">
            <span>Per Semester Fees</span>
            <span className="font-bold">₹55,500</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/30 rounded-xl border-2 border-yellow-400">
            <span className="font-bold text-lg">Total First Semester</span>
            <span className="font-bold text-2xl">₹71,500</span>
          </div>
        </div>

        <div className="text-center text-blue-100">
          <p>* Security deposit of ₹10,000 is refundable upon completion of course</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
          <FaCreditCard className="text-green-500" />
          <span>Accepted Payment Methods</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="text-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <div className="text-3xl mb-2">{method.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-1">{method.name}</h4>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors">
          <FaMoneyBillWave />
          <span>Pay Fees Now</span>
        </button>
        <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors">
          <FaDownload />
          <span>Download Fee Structure</span>
        </button>
      </div>
    </div>
    </div>
  );
};

export default FeesStructure;