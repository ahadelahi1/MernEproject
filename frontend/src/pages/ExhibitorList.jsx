import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExhibitorList.css"; // 👈 separate CSS import

const ExhibitorList = () => {
  const [exhibitors, setExhibitors] = useState([]);

  const fetchExhibitors = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/exhibitors");
      setExhibitors(res.data);
    } catch (error) {
      toast.error("Failed to load exhibitors");
    }
  };

  useEffect(() => {
    fetchExhibitors();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`http://localhost:4000/api/exhibitors/${id}/status`, { status: newStatus });
      toast.success(`Status changed to ${newStatus}`);
      fetchExhibitors();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-heading mb-4">Exhibitors</h2>
      <div className="row g-4">
        {exhibitors.map((exhibitor) => (
          <div className="col-md-3 col-sm-6" key={exhibitor._id}>
            <div
              className={`exhibitor-card shadow-sm text-center p-3 ${
                exhibitor.status === "active" ? "active-card" : "inactive-card"
              }`}
            >
              <h5 className="mb-1">{exhibitor.name}</h5>
              <small className="text-muted d-block">{exhibitor.email}</small>
              <small className="text-muted d-block">{exhibitor.phone}</small>
              <p
                className={`mt-2 mb-2 status-text ${
                  exhibitor.status === "active" ? "text-success" : "text-danger"
                }`}
              >
                {exhibitor.status}
              </p>
              <button
                className={`btn btn-sm ${
                  exhibitor.status === "active" ? "btn-danger" : "btn-success"
                }`}
                onClick={() => toggleStatus(exhibitor._id, exhibitor.status)}
              >
                {exhibitor.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitorList;
