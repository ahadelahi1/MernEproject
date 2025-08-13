import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ShowBooths = () => {
  const [booths, setBooths] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const fetchBooths = () => {
    axios
      .get(`http://localhost:4000/api/booths/all`, {
        params: { search, sort }
      })
      .then((res) => setBooths(res.data))
      .catch(() => toast.error("Failed to load booths"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this booth?")) {
      axios
        .delete(`http://localhost:4000/api/booths/${id}`)
        .then(() => {
          toast.success("Booth deleted");
          fetchBooths();
        })
        .catch(() => toast.error("Failed to delete booth"));
    }
  };

  useEffect(() => {
    fetchBooths();
  }, [search, sort]);

  return (
    <div className="expo-list-wrapper">
      <h2 className="expo-list-heading">Booth List</h2>

      {/* 🔍 Search & Sort Controls */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50 shadow-sm"
          placeholder="Search by Booth Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select w-auto shadow-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by Availability</option>
          <option value="asc">Available First</option>
          <option value="desc">Unavailable First</option>
        </select>

       
      </div>

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover table-bordered align-middle bg-white expo-list-table">
          <thead className="table-dark">
            <tr>
              <th>Stall Number</th>
              <th>Booth Name</th>
              <th>Capacity</th>
              <th>Hall Number</th>
              <th>Availability</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {booths.map((booth) => (
              <tr key={booth._id}>
                <td className="fw-semibold">{booth.stallNumber}</td>
                <td>{booth.name}</td>
                <td>{booth.capacity}</td>
                <td>{booth.hall?.hallNumber || "N/A"}</td>
                <td>{booth.availability}</td>
                <td className="text-center">
                  <Link
                    to={`/booths/edit/${booth._id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(booth._id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
            {booths.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No booths found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowBooths;
