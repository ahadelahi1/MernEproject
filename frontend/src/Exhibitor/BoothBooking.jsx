import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/BoothBooking.css"; // We'll create this CSS file

export default function BoothBooking() {
  const [formData, setFormData] = useState({
    boothName: "",
    boothSize: "",
    bookingDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.boothName || !formData.boothSize || !formData.bookingDate) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:4000/api/exhibitor/book-booth", formData);
      toast.success("Booth booked successfully!");
      setFormData({
        boothName: "",
        boothSize: "",
        bookingDate: "",
        description: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exhibitor-page">
      <ExhibitorSidebar />

      <main className="exhibitor-main">
        <div className="form-card">
          <h2 className="form-title">Book Your Booth</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="boothName"
              placeholder="Booth Name"
              value={formData.boothName}
              onChange={handleChange}
            />

            <select
              name="boothSize"
              value={formData.boothSize}
              onChange={handleChange}
            >
              <option value="">Select Booth Size</option>
              <option value="Small">Small (2x2 m)</option>
              <option value="Medium">Medium (3x3 m)</option>
              <option value="Large">Large (5x5 m)</option>
            </select>

            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Describe your booth purpose (optional)"
              value={formData.description}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book Booth"}
            </button>
          </form>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </main>
    </div>
  );
}
