import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../AddEx.css';

const EditHall = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hallNumber, setHallNumber] = useState("");
  const [boothCount, setBoothCount] = useState("");
  const [expoId, setExpoId] = useState("");
  const [expos, setExpos] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/halls/${id}`).then((res) => {
      const { hallNumber, numberOfBooths, expo } = res.data;
      setHallNumber(hallNumber);
      setBoothCount(numberOfBooths);
      setExpoId(expo);
    });

    axios.get("http://localhost:4000/api/expos/all")
      .then((res) => setExpos(res.data))
      .catch(() => toast.error("Error loading expos"));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:4000/api/halls/${id}`, {
      hallNumber,
      numberOfBooths: boothCount,
      expoId: expoId
    })
      .then(() => {
        toast.success("Hall updated successfully");
        navigate("/halls");
      })
      .catch(() => toast.error("Error updating hall"));
  };

  return (
    <div className="expo-form-wrapper">
      {/* Header Section */}
      <div className="expo-header">
        <div className="expo-header-decoration"></div>
        <h2 className="expo-form-heading">
          <span className="heading-icon">🏗️</span>
          Edit Hall
        </h2>
        <p className="expo-header-subtitle">
          Update hall configuration and booth arrangements
        </p>
      </div>

      {/* Form Container */}
      <div className="expo-form-container">
        <form onSubmit={handleUpdate} className="expo-form">

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
            
            <div className="upload-hint">
              <span className="hint-icon">💡</span>
              <span className="hint-text">Select the event this hall belongs to</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <span className="btn-icon">🔄</span>
              Update Hall
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHall;