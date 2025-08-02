import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
      await axios.post("http://localhost:5000/api/expos/add", {
        title, location, theme, startDate, endDate, description
      });

      toast.success("Expo successfully added!");
      navigate("/expos"); // ✅ no timeout
    } catch (error) {
      toast.error("Error adding expo");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Expo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Title</label>
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Location</label>
          <input type="text" className="form-control" value={location} onChange={e => setLocation(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Theme</label>
          <input type="text" className="form-control" value={theme} onChange={e => setTheme(e.target.value)} />
        </div>
        <div className="mb-2">
          <label>Start Date</label>
          <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>End Date</label>
          <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-success">Save Expo</button>
      </form>
    </div>
  );
};

export default AddExpo;
