import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../AddEx.css";

const AddExpo = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  // ✅ Image file validation (frontend)
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, PNG, or GIF images are allowed.");
        e.target.value = null; // Clear file input
        setImage(null);
        return;
      }

      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a valid image file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("theme", theme);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("description", description);
      formData.append("image", image);

      await axios.post("http://localhost:4000/api/expos/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Expo successfully added!");
      navigate("/expos");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="expo-form-wrapper">
      <h2 className="expo-form-heading">Add New Event</h2>
      <form onSubmit={handleSubmit} className="expo-form">

        {/* Title & Location */}
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

        {/* Theme, Dates */}
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
    min={new Date().toISOString().split("T")[0]} // Disable past dates
    onChange={(e) => {
      setStartDate(e.target.value);
      if (endDate && e.target.value > endDate) {
        setEndDate("");
      }
    }}
    required
  />
</div>

          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              min={startDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              required
              disabled={!startDate}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="form-label">Event Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary px-5">
          Save Event
        </button>
      </form>
    </div>
  );
};

export default AddExpo;
