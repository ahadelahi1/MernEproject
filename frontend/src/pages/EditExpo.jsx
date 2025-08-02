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
    axios.get(`http://localhost:5000/api/expos/single/${id}`).then((res) => {
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
      await axios.put(`http://localhost:5000/api/expos/update/${id}`, {
        title, location, theme, startDate, endDate, description
      });
      toast.success("Expo updated successfully!");
      setTimeout(() => navigate("/expos"), 1500);
    } catch (error) {
      toast.error("Error updating expo");
    }
  };

  return (
    <div>
      <h2>Edit Expo</h2>
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
        <button type="submit" className="btn btn-primary">Update Expo</button>
      </form>
    </div>
  );
};

export default EditExpo;
