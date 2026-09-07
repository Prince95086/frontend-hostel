import React, { useEffect, useState } from "react";
import axios from "axios";

// ADD YOUR RENDER URL HERE
const API_BASE_URL = "https://hostel-backend-1-vc4l.onrender.com";

export default function WorkerReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/worker-reports`);
        const workers = res.data.map(r => ({
          _id: r._id,
          name: r.workerName,
          id: r.workerId,
          issueType: r.issueType,
          severity: r.severity,
          date: r.date,
        }));
        setReports(workers);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Worker Reports</h2>

      <table className="w-full border rounded-lg">
        <thead className="bg-green-100">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Worker ID</th>
            <th className="p-3">Issue</th>
            <th className="p-3">Severity</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r._id} className="border-b">
              <td className="p-3">{r.name}</td>
              <td className="p-3">{r.id}</td>
              <td className="p-3">{r.issueType}</td>
              <td className="p-3 text-red-600 font-bold">{r.severity}</td>
              <td className="p-3">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}