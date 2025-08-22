import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ShowBooths = () => {
  const [hallData, setHallData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState("All"); // 🔹 selected hall

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchBooths = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/booths/all");
      const booths = res.data;

      // Group booths by hall
      const grouped = booths.reduce((acc, booth) => {
        const hallName =
          booth.hall?.name || booth.hall?.hallNumber || "Unknown Hall";
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

  if (loading)
    return (
      <p className="text-center mt-5 fs-5 fw-semibold text-muted">
        Loading booths...
      </p>
    );

  const halls = Object.keys(hallData); // 🔹 halls list for dropdown

  return (
    <div className="container my-5">
      {/* ====== Search + Filter Bar ====== */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            placeholder="🔍 Search booths by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select form-select-lg shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Booths</option>
            <option value="Available">Available Only</option>
            <option value="Booked">Booked Only</option>
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select form-select-lg shadow-sm"
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
          >
            <option value="All">All Halls</option>
            {halls.map((hall) => (
              <option key={hall} value={hall}>
                {hall}
              </option>
            ))}
          </select>
        </div>
      </div>

      {halls.length === 0 && (
        <p className="text-center text-muted">No booths available.</p>
      )}

      {Object.entries(hallData)
        .filter(([hallName]) => selectedHall === "All" || selectedHall === hallName)
        .map(([hallName, booths]) => {
          // Apply filters
          let filteredBooths = booths.filter((booth) =>
            booth.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (statusFilter === "Available") {
            filteredBooths = filteredBooths.filter(
              (booth) => booth.availability === "Available"
            );
          } else if (statusFilter === "Booked") {
            filteredBooths = filteredBooths.filter(
              (booth) => booth.availability !== "Available"
            );
          }

          // Split into available/booked
          const availableBooths = filteredBooths.filter(
            (booth) => booth.availability === "Available"
          );
          const bookedBooths = filteredBooths.filter(
            (booth) => booth.availability !== "Available"
          );

          if (filteredBooths.length === 0) return null;

          return (
            <div key={hallName} className="mb-5">
              {/* Hall Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-dark mb-0">🏛️ Hall {hallName}</h2>
                <span
                  className="badge rounded-pill bg-gradient text-white px-3 py-2 fs-6"
                  style={{ background: "linear-gradient(45deg,#4e54c8,#8f94fb)" }}
                >
                  {filteredBooths.length} Booths
                </span>
              </div>

              {/* Two Column Layout */}
              <div className="row g-4">
                {/* Available Booths */}
                <div className="col-md-6">
                  <div className="card shadow-lg border-0 h-100 rounded-4">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="fw-bold text-success mb-0">
                        ✅ Available Booths ({availableBooths.length})
                      </h5>
                    </div>
                    <div className="card-body">
                      {availableBooths.length === 0 ? (
                        <p className="text-muted">No available booths</p>
                      ) : (
                        <div className="d-flex flex-wrap gap-3">
                          {availableBooths.map((booth) => (
                            <div
                              key={booth._id}
                              className="booth-card p-3 rounded-3 shadow-sm text-center"
                              style={{ background: "#e9f9ef", minWidth: "120px" }}
                            >
                              <h6 className="fw-bold mb-2">{booth.name}</h6>
                              <span className="badge bg-success-subtle text-success">
                                Available
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booked Booths */}
                <div className="col-md-6">
                  <div className="card shadow-lg border-0 h-100 rounded-4">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="fw-bold text-danger mb-0">
                        ❌ Booked Booths ({bookedBooths.length})
                      </h5>
                    </div>
                    <div className="card-body">
                      {bookedBooths.length === 0 ? (
                        <p className="text-muted">No booked booths</p>
                      ) : (
                        <div className="d-flex flex-wrap gap-3">
                          {bookedBooths.map((booth) => (
                            <div
                              key={booth._id}
                              className="booth-card p-3 rounded-3 shadow-sm text-center"
                              style={{ background: "#fdeaea", minWidth: "120px" }}
                            >
                              <h6 className="fw-bold mb-2">{booth.name}</h6>
                              <span className="badge bg-danger-subtle text-danger">
                                Booked
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ShowBooths;
