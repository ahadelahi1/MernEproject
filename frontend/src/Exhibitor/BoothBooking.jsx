import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import ExhibitorSidebar from "../components/ExhibitorSidebar";
import "../exhibitorcss/BoothBooking.css";

export default function BoothBooking() {
  const [expos, setExpos] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [id, setid] = useState("");

  const [formData, setFormData] = useState({
    boothIds: [],
    bookingDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const animatedComponents = makeAnimated();

  useEffect(() => {
   
   let exhibitordata=JSON.parse(localStorage.getItem("exhibitorData")) 
   setid(exhibitordata._id)
    axios
      .get("http://localhost:4000/api/expos/all")
      .then((res) => setExpos(res.data))
      .catch(() => toast.error("Error fetching expos"));
  }, []);

  const handleExpoClick = async (id) => {
    try {
      const expoRes = await axios.get(`http://localhost:4000/api/expos/${id}`);
      setSelectedExpo(expoRes.data);

      const boothsRes = await axios.get(
        `http://localhost:4000/api/booths/by-expo/${id}`
      );

      const availableBooths = boothsRes.data
        .filter((b) => b.availability === "Available")
        .map((b) => ({
          value: b._id,
          label: `${b.stallNumber} - ${b.name}`,
        }));

      setBooths(availableBooths);

      setFormData({
        boothIds: [],
        bookingDate: expoRes.data.startDate?.split("T")[0] || "",
        description: `Booth booking for ${expoRes.data.title} at ${expoRes.data.location}`,
      });
    } catch {
      toast.error("Error fetching expo or booths");
    }
  };

  const handleBoothChange = (selectedOptions) => {
    setFormData({
      ...formData,
      boothIds: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.boothIds.length === 0 || !formData.bookingDate) {
      toast.error("Please select at least one booth and date!");
      return;
    }
  
    try {
      setLoading(true);
  
      await axios.post("http://localhost:4000/api/book/bookBooth", {
        eventId: selectedExpo._id,
        exhibitorId:id, // logged in user id
        boothIds: formData.boothIds, // 👈 now sending array directly
        bookingDate: formData.bookingDate,
        description: formData.description,
      });
  
      toast.success("Booths booked successfully!");
      setFormData({
        boothIds: [],
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
        {/* Heading at top */}
        <h1 className="events-heading">Upcoming Events</h1>

        {/* Expo Cards */}
        <div className="expo-cards-grid">
          {expos.map((expo) => (
            <div
              key={expo._id}
              className={`expo-card ${selectedExpo?._id === expo._id ? "active" : ""}`}
              onClick={() => handleExpoClick(expo._id)}
            >
              {expo.image ? (
                <img
                  src={`http://localhost:4000/uploads/${expo.image}`}
                  alt={expo.title}
                  className="expo-card-img"
                />
              ) : (
                <div className="expo-card-placeholder">No Image</div>
              )}
              <div className="expo-card-content">
                <h3>{expo.title}</h3>
                <p className="expo-date">
                  {new Date(expo.startDate).toLocaleDateString()} -{" "}
                  {new Date(expo.endDate).toLocaleDateString()}
                </p>
                <p className="expo-location">{expo.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form below cards */}
        {selectedExpo && (
          <div className="form-card">
            <h2 className="form-title">Book Booth(s) for {selectedExpo.title}</h2>
            <p><strong>Location:</strong> {selectedExpo.location}</p>
            <p><strong>Theme:</strong> {selectedExpo.theme}</p>
            <p>
              <strong>Dates:</strong>{" "}
              {new Date(selectedExpo.startDate).toLocaleDateString()} -{" "}
              {new Date(selectedExpo.endDate).toLocaleDateString()}
            </p>

            <form onSubmit={handleSubmit}>
              <Select
                isMulti
                components={animatedComponents}
                options={booths}
                onChange={handleBoothChange}
                placeholder="Select Booth(s)"
              />

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
                {loading ? "Booking..." : "Book Booth(s)"}
              </button>
            </form>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
}
