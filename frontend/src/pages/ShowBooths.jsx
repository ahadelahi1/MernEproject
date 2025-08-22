import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ShowBooths = () => {
  const [hallData, setHallData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchBooths = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/booths/all");
      const booths = res.data;

      // Group booths by hall
      const grouped = booths.reduce((acc, booth) => {
        const hallName = booth.hall?.name || "Unknown Hall";
        if (!acc[hallName]) acc[hallName] = [];
        acc[hallName].push(booth);
        return acc;
      }, {});

      setHallData(grouped);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load booths");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooths();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading booths...</p>;

  return (
    <div className="container my-4">
      {Object.keys(hallData).length === 0 && (
        <p className="text-center">No booths available.</p>
      )}

      {Object.entries(hallData).map(([hallName, booths]) => (
        <div key={hallName} className="mb-5">
          {/* Hall Name Heading */}
          <h2 className="fw-bold mb-1">{hallName}</h2>

          {/* Total booths */}
          <p className="text-muted mb-3">Total Booths: {booths.length}</p>

          {/* Booth Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Booth Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {booths.map((booth) => (
                    <tr key={booth._id}>
                      <td>{booth.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            booth.availability === "available"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {booth.availability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowBooths;
