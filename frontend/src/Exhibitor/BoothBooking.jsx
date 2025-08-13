import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/BoothBooking.css";

export default function BoothBooking() {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [formData, setFormData] = useState({
    boothName: "",
    boothSize: "",
    bookingDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all expos on load
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/expos/all")
      .then((res) => setExpos(res.data))
      .catch(() => toast.error("Error fetching expos"));
  }, []);

  // ✅ When expo is clicked, fetch details and pre-fill form
  const handleExpoClick = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/expos/${id}`);
      setSelectedExpo(res.data);

      setFormData({
        boothName: `${res.data.title} Booth`,
        boothSize: "",
        bookingDate: res.data.startDate?.split("T")[0] || "",
        description: `Booth for ${res.data.title} at ${res.data.location}`,
      });
    } catch {
      toast.error("Error fetching expo details");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit booth booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.boothName || !formData.boothSize || !formData.bookingDate) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (!selectedExpo) {
      toast.error("Please select an expo first!");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:4000/api/exhibitor/book-booth", {
        ...formData,
        expoId: selectedExpo._id,
      });
      toast.success("Booth booked successfully!");
      setFormData({
        boothName: "",
        boothSize: "",
        bookingDate: "",
        description: "",
      });
      setSelectedExpo(null);
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

        {/* ✅ Expo selection buttons */}
        <div className="expo-buttons">
          {expos.map((expo) => (
            <button
              key={expo._id}
              className={selectedExpo?._id === expo._id ? "active-expo" : ""}
              onClick={() => handleExpoClick(expo._id)}
            >
              {expo.title}
            </button>
          ))}
        </div>

        {/* ✅ Booking form (only shows after expo selected) */}
        {selectedExpo && (
          <div className="form-card">
            <h2 className="form-title">Book Booth for {selectedExpo.title}</h2>
            <p><strong>Location:</strong> {selectedExpo.location}</p>
            <p><strong>Theme:</strong> {selectedExpo.theme}</p>
            <p>
              <strong>Dates:</strong> {new Date(selectedExpo.startDate).toLocaleDateString()} -{" "}
              {new Date(selectedExpo.endDate).toLocaleDateString()}
            </p>

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
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}
