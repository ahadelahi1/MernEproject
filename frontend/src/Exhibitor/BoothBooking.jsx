import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/BoothBooking.css";

export default function BoothBooking() {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [formData, setFormData] = useState({
    boothId: "",
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

  // ✅ Fetch expo + booths when expo selected
  const handleExpoClick = async (id) => {
    try {
      const expoRes = await axios.get(`http://localhost:4000/api/expos/${id}`);
      setSelectedExpo(expoRes.data);

      const boothsRes = await axios.get(
        `http://localhost:4000/api/booths/by-expo/${id}`
      );
      setBooths(boothsRes.data.filter((b) => b.availability === "Available"));

      setFormData({
        boothId: "",
        bookingDate: expoRes.data.startDate?.split("T")[0] || "",
        description: `Booth booking for ${expoRes.data.title} at ${expoRes.data.location}`,
      });
    } catch {
      toast.error("Error fetching expo or booths");
    }
  };

  // ✅ Checkbox handler (single booth selection)
  const handleBoothSelect = (boothId) => {
    setFormData({
      ...formData,
      boothId: formData.boothId === boothId ? "" : boothId, // toggle selection
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.boothId || !formData.bookingDate) {
      toast.error("Please select a booth and date!");
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
        boothId: "",
        bookingDate: "",
        description: "",
      });
      setSelectedExpo(null);
      setBooths([]);
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
        {/* Expo selection */}
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

        {/* Booking form */}
        {selectedExpo && (
          <div className="form-card">
            <h2 className="form-title">Book Booth for {selectedExpo.title}</h2>
            <p>
              <strong>Location:</strong> {selectedExpo.location}
            </p>
            <p>
              <strong>Theme:</strong> {selectedExpo.theme}
            </p>
            <p>
              <strong>Dates:</strong>{" "}
              {new Date(selectedExpo.startDate).toLocaleDateString()} -{" "}
              {new Date(selectedExpo.endDate).toLocaleDateString()}
            </p>

            <form onSubmit={handleSubmit}>
              {/* ✅ Booth Checkboxes */}
              <div className="booth-checkbox-list">
                {booths.length > 0 ? (
                  booths.map((booth) => (
                    <label key={booth._id} className="booth-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.boothId === booth._id}
                        onChange={() => handleBoothSelect(booth._id)}
                      />
                      {booth.stallNumber} - {booth.name} 
                    </label>
                  ))
                ) : (
                  <p>No available booths for this expo.</p>
                )}
              </div>

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
