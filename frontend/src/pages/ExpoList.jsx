import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ExpoList = () => {
  const [expos, setExpos] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [theme, setTheme] = useState("");

  const fetchExpos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/expos/all", {
        params: { search, startDate, endDate, theme }
      });
      setExpos(res.data);
    } catch (error) {
      toast.error("Error fetching expos");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo?")) {
      try {
        await axios.delete(`http://localhost:4000/api/expos/${id}`);
        toast.success("Expo deleted successfully");
        fetchExpos();
      } catch (error) {
        toast.error("Error deleting expo");
      }
    }
  };

  useEffect(() => {
    fetchExpos();
  }, [search, startDate, endDate, theme]);

  return (
    <div className="expo-list-wrapper">
      <h2 className="expo-list-heading">Expo List</h2>

      {/* Filters */}
      <div className="filters mb-4">
        <input
          type="text"
          placeholder="Search by Title"
          className="form-control mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="d-flex gap-2 mb-2">
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Filter by Theme"
          className="form-control mb-3"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/expos/add" className="btn btn-primary shadow">
          <i className="bi bi-plus-circle me-2"></i> Add Expo
        </Link>
      </div>

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover table-bordered align-middle bg-white expo-list-table">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Location</th>
              <th>Start</th>
              <th>End</th>
              <th>Theme</th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expos.length > 0 ? (
              expos.map((expo) => (
                <tr key={expo._id}>
                  <td className="text-center">
                    {expo.image ? (
                      <img
                        src={`http://localhost:4000/uploads/${expo.image}`}
                        alt={expo.title}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "6px"
                        }}
                      />
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>
                  <td className="fw-semibold">{expo.title}</td>
                  <td>{expo.location}</td>
                  <td>{new Date(expo.startDate).toLocaleDateString()}</td>
                  <td>{new Date(expo.endDate).toLocaleDateString()}</td>
                  <td>{expo.theme}</td>
                  <td style={{ maxWidth: "200px" }}>{expo.description}</td>
                  <td className="text-center">
                    <Link
                      to={`/expos/edit/${expo._id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(expo._id)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No expos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpoList;
