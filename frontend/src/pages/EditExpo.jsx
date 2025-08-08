import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditExpo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:4000/api/expos/single/${id}`).then((res) => {
      const expo = res.data;
      setTitle(expo.title);
      setLocation(expo.location);
      setTheme(expo.theme);
      setStartDate(expo.startDate.substring(0, 10));
      setEndDate(expo.endDate.substring(0, 10));
      setDescription(expo.description);
    }).catch(() => {
      toast.error("Expo not found");
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/expos/update/${id}`, {
        title, location, theme, startDate, endDate, description
      });
      toast.success("Expo updated successfully!");
      setTimeout(() => navigate("/expos"), 1500);
    } catch (error) {
      toast.error("Error updating expo");
    }
  };

  return (
      <div className="expo-form-wrapper">
      <h2 className="expo-form-heading">Edit Expo</h2>
      <form onSubmit={handleSubmit} className="expo-form">
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">Theme</label>
            <input
              type="text"
              className="form-control"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary px-5">
          Update Expo
        </button>
      </form>
    </div>  );
};

export default EditExpo;
