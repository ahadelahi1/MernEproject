import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../AddEx.css"

const AddExpo = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/expos/add", {
        title, location, theme, startDate, endDate, description
      }).then((a)=>{
        toast.success("Expo successfully added!");
        navigate("/expos");
      }).catch((e)=>{
        toast.error(e.data.msg);
      });

     // ✅ no timeout
    } catch (error) {
      toast.error(error.response?.data.msg);
    }
  };

  return (
<div className="expo-form-wrapper">
  <h2 className="expo-form-heading">Add New Expo</h2>
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
      Save Expo
    </button>
  </form>
</div>

  );
};

export default AddExpo;
