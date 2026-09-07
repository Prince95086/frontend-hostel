import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaPrint, FaDownload } from "react-icons/fa";
import axios from "axios";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function ViewStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/students/${id}`);
      setStudent(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch student:", err);
      setError("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading student details...</div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error || "Student not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-student")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Student Details: {student.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/edit-student/${id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaEdit />
            Edit Student
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaPrint />
            Print
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaDownload />
            Download
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Personal Information</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Full Name:</span>
                <span>{student.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span>{student.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Phone:</span>
                <span>{student.phone}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Roll Number:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {student.rollNo}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Academic Information</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Year:</span>
                <span>{student.year}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Department:</span>
                <span>{student.dept}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Branch:</span>
                <span>{student.branch}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Category:</span>
                <span>{student.category}</span>
              </div>
            </div>
          </div>

          {/* Hostel Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Hostel Information</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Hostel:</span>
                <span>{student.hostel}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Block:</span>
                <span>{student.block}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Room Number:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  Room {student.roomNo}
                </span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Documents</h2>
            
            <div className="space-y-3">
              {student.photo && (
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-600">Photo:</span>
                  <img 
                    src={`${API_BASE_URL}/${student.photo.replace(/\\/g, '/')}`} 
                    alt="Student" 
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              {student.signature && (
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-600">Signature:</span>
                  <img 
                    src={`${API_BASE_URL}/${student.signature.replace(/\\/g, '/')}`} 
                    alt="Signature" 
                    className="w-24 h-8 object-contain border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Registration Date:</span>
            <span>
              {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}