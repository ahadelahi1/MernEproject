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
      <h2 className="expo-form-heading">Add Hall</h2>
      <form onSubmit={handleSubmit} className="expo-form">
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">Hall Number</label>
            <input
              type="text"
              className="form-control"
              value={hallNumber}
              onChange={(e) => setHallNumber(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Number of Booths</label>
            <input
              type="number"
              className="form-control"
              value={boothCount}
              onChange={(e) => setBoothCount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Select Event</label>
          <select
            className="form-select"
            value={expoId}
            onChange={(e) => setExpoId(e.target.value)}
            required
          >
            <option value="">-- Select Event --</option>
            {expos.map((expo) => (
              <option key={expo._id} value={expo._id}>
                {expo.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary px-5">
          Add Hall
        </button>
      </form>
    </div>
  );
};

export default AddHall;
