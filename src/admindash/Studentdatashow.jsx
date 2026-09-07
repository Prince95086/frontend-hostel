// import React, { useState } from "react";
// import axios from "axios";

// export default function Studentdatashow() {
//   const [phone, setPhone] = useState("");
//   const [fees, setFees] = useState([]);
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setError("");
//     setFees([]);
//     setStudent(null);

//     if (phone.length < 10) {
//       setError("Enter valid phone number");
//       return;
//     }

//     setLoading(true);
//     try {
//       // 1️⃣ Get student by phone
//       const studentRes = await axios.get(
//         `http://localhost:5000/api/students/phone/${phone}`
//       );
//       setStudent(studentRes.data);

//       // 2️⃣ Get mess fee records
//       const feeRes = await axios.get(
//         `http://localhost:5000/api/students/${studentRes.data._id}/mess-fees`
//       );
//       setFees(feeRes.data);

//     } catch (err) {
//       setError("Student not found or no records available");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">

//         <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
//           Student Mess Fee Portal
//         </h1>

//         {/* Search */}
//         <form onSubmit={handleSearch} className="flex gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="Enter Phone Number"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="flex-1 border px-4 py-2 rounded"
//           />
//           <button className="bg-green-600 text-white px-6 py-2 rounded">
//             Search
//           </button>
//         </form>

//         {loading && <p>Loading...</p>}
//         {error && <p className="text-red-600">{error}</p>}

//         {/* Student Info */}
//         {student && (
//           <div className="bg-white p-5 rounded shadow mb-6">
//             <h2 className="text-xl font-bold">{student.name}</h2>
//             <p><b>Phone:</b> {student.phone}</p>
//             <p><b>Room No:</b> {student.roomNo}</p>
//             <p><b>Roll No:</b> {student.rollNo}</p>
//           </div>
//         )}

//         {/* Fee Records */}
//         {fees.length > 0 && (
//           <div className="bg-white rounded shadow p-5 overflow-x-auto">
//             <table className="w-full border text-center">
//               <thead className="bg-green-100">
//                 <tr>
//                   <th>Month</th>
//                   <th>Year</th>
//                   <th>Total</th>
//                   <th>Paid</th>
//                   <th>Due</th>
//                   <th>Payment Date</th>
//                   <th>Method</th>
//                   <th>Status</th>
//                   <th>Receipt</th>
//                   <th>Remarks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fees.map((f) => (
//                   <tr key={f._id} className="border-t">
//                     <td>{f.month}</td>
//                     <td>{f.year}</td>
//                     <td>₹{f.totalAmount}</td>
//                     <td className="text-green-600">₹{f.paidAmount}</td>
//                     <td className="text-red-600">₹{f.dueAmount}</td>
//                     <td>
//                       {f.paymentDate
//                         ? new Date(f.paymentDate).toLocaleDateString()
//                         : "—"}
//                     </td>
//                     <td>{f.paymentMethod || "—"}</td>
//                     <td>
//                       <span className={`px-2 py-1 rounded ${
//                         f.status === "Paid"
//                           ? "bg-green-200 text-green-800"
//                           : f.status === "Partial"
//                           ? "bg-yellow-200 text-yellow-800"
//                           : "bg-red-200 text-red-800"
//                       }`}>
//                         {f.status}
//                       </span>
//                     </td>
//                     <td>{f.receiptNo || "—"}</td>
//                     <td>{f.remarks || "—"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import axios from "axios";
import { FaPhone, FaSignInAlt, FaMoneyBillWave } from "react-icons/fa";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function Studentdatashow() {
  const [phone, setPhone] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!phone) return setError("Enter phone number");

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/canteen-fees/by-phone/${phone}`
      );

      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "No data found");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-5xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Student Canteen Fee Portal
        </h2>

        {/* LOGIN BOX */}
        <div className="flex gap-3 mb-6">
          <div className="flex items-center border rounded px-3 w-full">
            <FaPhone className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 outline-none"
            />
          </div>
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaSignInAlt /> View
          </button>
        </div>

        {loading && <p className="text-center text-blue-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* TABLE */}
        {records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Month</th>
                  <th className="p-2">Year</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Paid</th>
                  <th className="p-2">Due</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="text-center border-t">
                    <td className="p-2">{r.month}</td>
                    <td className="p-2">{r.year}</td>
                    <td className="p-2 text-blue-700 font-bold">₹{r.totalAmount}</td>
                    <td className="p-2 text-green-600 font-bold">₹{r.paidAmount}</td>
                    <td className="p-2 text-red-600 font-bold">₹{r.dueAmount}</td>
                    <td className="p-2">{r.status}</td>
                    <td className="p-2">
                      {r.paymentDate
                        ? new Date(r.paymentDate).toLocaleDateString()
                        : "Not Paid"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}