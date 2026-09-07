import React, { useState } from "react";
import axios from "axios";

import {
  FaFan, FaBolt, FaBroom, FaPaintRoller, FaCouch,
  FaUtensils, FaFaucet, FaWifi, FaTshirt
} from "react-icons/fa";

// UPDATED: Using Render URL as fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://hostel-backend-1-vc4l.onrender.com/api";

const categories = [
  { id: "fan", name: "Fan Issue", icon: FaFan },
  { id: "electricity", name: "Electricity", icon: FaBolt },
  { id: "cleaning", name: "Cleaning", icon: FaBroom },
  { id: "painting", name: "Painting", icon: FaPaintRoller },
  { id: "furniture", name: "Furniture", icon: FaCouch },
  { id: "food", name: "Food Services", icon: FaUtensils },
  { id: "water", name: "Water Supply", icon: FaFaucet },
  { id: "wifi", name: "WiFi Management", icon: FaWifi },
  { id: "laundry", name: "Laundry Services", icon: FaTshirt },
];

const AdminComplaints = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async (category) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/complaints/category/${category}`
      );
      setComplaints(res.data.data);
      setSelectedCategory(category);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Complaint Categories</h1>

      {/* CATEGORY BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => fetchComplaints(cat.id)}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:bg-blue-50 transition"
          >
            <cat.icon className="text-2xl mb-2 text-blue-600" />
            <span className="font-semibold">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* COMPLAINT LIST */}
      {selectedCategory && (
        <>
          <h2 className="text-2xl font-bold mb-4 capitalize">
            {selectedCategory} Complaints
          </h2>

          {complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="grid gap-6">
              {complaints.map((c) => (
                <div key={c._id} className="bg-white p-6 rounded-xl shadow">
                  <p><b>Hostel:</b> {c.hostel}</p>
                  <p><b>Room:</b> {c.block}, {c.roomNo}</p>
                  <p><b>Roll No:</b> {c.rollNo}</p>
                  <p><b>Mobile:</b> {c.mobileNo}</p>
                  <p><b>Description:</b> {c.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminComplaints;