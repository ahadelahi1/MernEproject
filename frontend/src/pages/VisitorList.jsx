// src/pages/VisitorList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css"; // existing theme

const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/visitors");
      setVisitors(res.data);
    } catch (err) {
      toast.error("Failed to load visitors");
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <div className="expo-list-wrapper">
      <h2 className="expo-list-heading">Visitor List</h2>

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover table-bordered align-middle bg-white expo-list-table">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Address</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td className="fw-semibold">{v.name}</td>
                <td>{v.email}</td>
                <td>{v.age ?? "-"}</td>
                <td>{v.address ?? "-"}</td>
                <td>{v.gender ?? "-"}</td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No visitors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorList;
