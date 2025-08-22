import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../AddEx.css";

const EditExpo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/expos/${id}`)
      .then((res) => {
        const expo = res.data;
        setTitle(expo.title);
        setLocation(expo.location);
        setTheme(expo.theme);
        setStartDate(expo.startDate.substring(0, 10));
        setEndDate(expo.endDate.substring(0, 10));
        setDescription(expo.description);
        if (expo.image) {
          setPreview(`http://localhost:4000/uploads/${expo.image}`);
        }
      })
      .catch(() => {
        toast.error("Expo not found");
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, PNG, or GIF images are allowed.");
        e.target.value = null;
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("theme", theme);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        `http://localhost:4000/api/expos/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Expo updated successfully!");
      setTimeout(() => navigate("/expos"), 1500);
    } catch (error) {
      toast.error("Error updating expo");
    }
  };

  return (
    <div className="expo-form-wrapper">
      {/* Header Section */}
      <div className="expo-header">
        <div className="expo-header-decoration"></div>
        <h2 className="expo-form-heading">
          <span className="heading-icon">✏️</span>
          Edit Event
        </h2>
        <p className="expo-header-subtitle">
          Update event details and make your expo even better
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

          {/* Image Upload with Preview */}
          <div className="form-group full-width">
            <label className="form-label">
              <span className="label-icon">🖼️</span>
              Change Event Image
            </label>
            
            {/* Current/Preview Image */}
            {preview && (
              <div className="image-preview-container">
                <div className="image-preview-wrapper">
                  <img
                    src={preview}
                    alt="Event Preview"
                    className="image-preview"
                  />
                  <div className="image-preview-overlay">
                    <span className="preview-text">Current Image</span>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="file-upload-wrapper">
              <input
                type="file"
                className="form-control file-input"
                onChange={handleImageChange}
                accept="image/*"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="file-upload-label">
                <span className="file-upload-icon">🔄</span>
                <span className="file-upload-text">
                  {image ? image.name : "Choose new image (optional)"}
                </span>
              </label>
            </div>
            
            <div className="upload-hint">
              <span className="hint-icon">💡</span>
              <span className="hint-text">Leave blank to keep current image</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <span className="btn-icon">💾</span>
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpo;