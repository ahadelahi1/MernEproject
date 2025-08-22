import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import '../AddEx.css';

const AddHall = () => {
  const [hallNumber, setHallNumber] = useState('');
  const [boothCount, setBoothCount] = useState('');
  const [expoId, setExpoId] = useState('');
  const [expos, setExpos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:4000/api/expos/all")
      .then((res) => setExpos(res.data))
      .catch(() => toast.error("Error fetching expos"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/api/halls/add", {
      hallNumber,
      numberOfBooths: boothCount,
      expoId
    })
      .then(() => {
        toast.success("Hall added successfully");
        navigate("/halls");
      })
      .catch((err) => {
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Error adding hall");
        }
      });
  };

  return (
    <div className="expo-form-wrapper">
      {/* Header Section */}
      <div className="expo-header">
        <div className="expo-header-decoration"></div>
        <h2 className="expo-form-heading">
          <span className="heading-icon">🏢</span>
          Add New Hall
        </h2>
        <p className="expo-header-subtitle">
          Configure exhibition halls and booth arrangements
        </p>
      </div>

      {/* Form Container */}
      <div className="expo-form-container">
        <form onSubmit={handleSubmit} className="expo-form">

          {/* Hall Number & Booth Count */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏛️</span>
                Hall Number
              </label>
              <input
                type="text"
                className="form-control"
                value={hallNumber}
                onChange={(e) => setHallNumber(e.target.value)}
                placeholder="Enter hall number (e.g., A1, B2)"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📊</span>
                Number of Booths
              </label>
              <input
                type="number"
                className="form-control"
                value={boothCount}
                onChange={(e) => setBoothCount(e.target.value)}
                placeholder="Enter total booth count"
                min="1"
                required
              />
            </div>
          </div>

          {/* Select Event */}
          <div className="form-group full-width">
            <label className="form-label">
              <span className="label-icon">🎯</span>
              Select Event
            </label>
            <div className="select-wrapper">
              <select
                className="form-control form-select"
                value={expoId}
                onChange={(e) => setExpoId(e.target.value)}
                required
              >
                <option value="">-- Choose an Event --</option>
                {expos.map((expo) => (
                  <option key={expo._id} value={expo._id}>
                    {expo.title}
                  </option>
                ))}
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <span className="btn-icon">🏢</span>
              Add Hall
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHall;