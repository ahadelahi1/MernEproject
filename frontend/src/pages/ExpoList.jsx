import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ExpoList = () => {
  const [expos, setExpos] = useState([]);

  const fetchExpos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expos/all");
      setExpos(res.data);
    } catch (error) {
      toast.error("Error fetching expos");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expo?")) {
      try {
        await axios.delete(`http://localhost:5000/api/expos/delete/${id}`);
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
    <div className="container mt-4">
      <h2>Manage Expos</h2>
      <Link to="/expos/add" className="btn btn-primary mb-3">Add Expo</Link>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>Theme</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expos.map((expo) => (
            <tr key={expo._id}>
              <td>{expo.title}</td>
              <td>{expo.location}</td>
              <td>{new Date(expo.startDate).toLocaleDateString()}</td>
              <td>{new Date(expo.endDate).toLocaleDateString()}</td>
              <td>{expo.theme}</td>
              <td>{expo.description}</td>
              <td>
                <Link to={`/expos/edit/${expo._id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(expo._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpoList;
