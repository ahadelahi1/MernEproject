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
      {/* Header Section */}
      <div className="expo-header">
        <div className="expo-header-decoration"></div>
        <h2 className="expo-form-heading">
          <span className="heading-icon">✨</span>
          Add New Event
        </h2>
        <p className="expo-header-subtitle">
          Create an amazing expo experience for your audience
        </p>
      </div>

      {/* Form Container */}
      <div className="expo-form-container">
        <form onSubmit={handleSubmit} className="expo-form">

          {/* Title & Location */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span>
                Event Title
              </label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title..."
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📍</span>
                Location
              </label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter event location..."
                required
              />
            </div>
          </div>

          {/* Theme & Dates */}
          <div className="form-row">
            <div className="form-group form-group-large">
              <label className="form-label">
                <span className="label-icon">🎨</span>
                Theme
              </label>
              <input
                type="text"
                className="form-control"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Enter event theme..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📅</span>
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) {
                    setEndDate("");
                  }
                }}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📅</span>
                End Date
              </label>
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
          <div className="form-group full-width">
            <label className="form-label">
              <span className="label-icon">📄</span>
              Description
            </label>
            <textarea
              className="form-control form-textarea"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event in detail..."
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-group full-width">
            <label className="form-label">
              <span className="label-icon">🖼️</span>
              Event Image
            </label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                className="form-control file-input"
                onChange={handleImageChange}
                accept="image/*"
                required
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="file-upload-label">
                <span className="file-upload-icon">📁</span>
                <span className="file-upload-text">
                  {image ? image.name : "Choose an image file"}
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <span className="btn-icon">💾</span>
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpo;