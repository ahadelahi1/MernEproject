import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import '../AddEx.css';

const AddBooth = () => {
  const [stallNumber, setStallNumber] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [hallId, setHallId] = useState("");
  const [availability, setAvailability] = useState("");
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/halls/all")
      .then(res => setHalls(res.data))
      .catch(() => toast.error("Error loading halls"));
  }, []);

  useEffect(() => {
    // Auto-update the name when stallNumber changes
    if (stallNumber.trim() !== "") {
      setName(stallNumber + "A");
    } else {
      setName("");
    }
  }, [stallNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/api/booths/add", {
      stallNumber,
      name,
      capacity,
      hall: hallId,
      availability
    })
      .then(() => {
        toast.success("Booth added successfully");
        setStallNumber(""); setName(""); setCapacity(""); setHallId(""); setAvailability("");
      })
      .catch(() => toast.error("Failed to add booth"));
  };

  return (
    <div className="expo-form-wrapper">
      <h2 className="expo-form-heading">Add Booth</h2>
      <form onSubmit={handleSubmit} className="expo-form">
        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label">Stall Number</label>
            <input
              type="text"
              className="form-control"
              value={stallNumber}
              onChange={(e) => setStallNumber(e.target.value)}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Booth Name (Auto)</label>
            <input
              type="text"
              className="form-control"
              value={name}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              className="form-control"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">Select Hall</label>
            <select
              className="form-select"
              value={hallId}
              onChange={(e) => setHallId(e.target.value)}
              required
            >
              <option value="">-- Select Hall --</option>
              {halls.map(hall => (
                <option key={hall._id} value={hall._id}>
                  {hall.hallNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Availability</label>
            <select
              className="form-select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
            >
              <option value="">-- Select Status --</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary px-5">
          Add Booth
        </button>
      </form>
    </div>
  );
};

export default AddBooth;
