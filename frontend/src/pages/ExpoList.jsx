import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import '../ExpoList.css'

const ExpoList = () => {
  const [expos, setExpos] = useState([]);

  const fetchExpos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/expos/all");
      setExpos(res.data);
    } catch (error) {
      toast.error("Error fetching expos");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo?")) {
      try {
        await axios.delete(`http://localhost:4000/api/expos/delete/${id}`);
        toast.success("Expo deleted successfully");
        fetchExpos();
      } catch (error) {
        toast.error("Error deleting expo");
      }
    }
  };

  useEffect(() => {
    fetchExpos();
  }, []);

  return (
   <div className="expo-list-wrapper">
  <h2 className="expo-list-heading">Expo List</h2>

  <div className="d-flex justify-content-end mb-3">
    <Link to="/expos/add" className="btn btn-primary shadow">
      <i className="bi bi-plus-circle me-2"></i> Add Expo
    </Link>
  </div>

  <div className="table-responsive rounded shadow-sm">
    <table className="table table-hover table-bordered align-middle bg-white expo-list-table">
      <thead className="table-dark">
        <tr>
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
        {expos.map((expo) => (
          <tr key={expo._id}>
            <td className="fw-semibold">{expo.title}</td>
            <td>{expo.location}</td>
            <td>{new Date(expo.startDate).toLocaleDateString()}</td>
            <td>{new Date(expo.endDate).toLocaleDateString()}</td>
            <td>{expo.theme}</td>
            <td>{expo.description}</td>
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
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default ExpoList;
