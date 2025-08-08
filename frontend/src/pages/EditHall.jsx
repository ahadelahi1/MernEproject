import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../AddEx.css'

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
      <h2 className="expo-form-heading">Edit Hall</h2>
      <form onSubmit={handleUpdate} className="expo-form">
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
          <label className="form-label">Select Expo</label>
          <select
            className="form-select"
            value={expoId}
            onChange={(e) => setExpoId(e.target.value)}
            required
          >
            <option value="">-- Select Expo --</option>
            {expos.map((expo) => (
              <option key={expo._id} value={expo._id}>
                {expo.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary px-5">
          Update Hall
        </button>
      </form>
    </div>
  );
};

export default EditHall;
