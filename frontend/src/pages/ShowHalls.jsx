import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css"; // Reuse the same styling

const ShowHalls = () => {
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = () => {
    axios
      .get("http://localhost:4000/api/halls/get")
      .then((res) => setHalls(res.data))
      .catch(() => toast.error("Error loading halls"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hall?")) {
      axios.delete(`http://localhost:4000/api/halls/delete/${id}`)
        .then(() => {
          toast.success("Hall deleted successfully");
          fetchHalls();
        })
        .catch(() => toast.error("Error deleting hall"));
    }
  };

  return (
    <div className="expo-list-wrapper">
      <h2 className="expo-list-heading">Hall List</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/halls/add" className="btn btn-primary shadow">
          <i className="bi bi-plus-circle me-2"></i> Add Hall
        </Link>
      </div>

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover table-bordered align-middle bg-white expo-list-table">
          <thead className="table-dark">
            <tr>
              <th>Hall Number</th>
              <th>Booth Count</th>
              <th>Expo Title</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {halls.map((hall) => (
              <tr key={hall._id}>
                <td className="fw-semibold">{hall.hallNumber}</td>
                <td>{hall.numberOfBooths}</td>
                <td>{hall.expoId?.title}</td>
                <td className="text-center">
                  <Link
                    to={`/halls/edit/${hall._id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(hall._id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowHalls;
