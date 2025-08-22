import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExhibitorSidebar from "../components/ExhibitorSidebar";

const ExhibitorProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedExhibitor = JSON.parse(localStorage.getItem("exhibitorData"));
    if (savedExhibitor) {
      setProfile({
        name: savedExhibitor.name || "",
        email: savedExhibitor.email || "",
        phone: savedExhibitor.phone || "",
        status: savedExhibitor.status || "Inactive",
        password: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const savedExhibitor = JSON.parse(localStorage.getItem("exhibitorData"));
      const exhibitorId = savedExhibitor._id;

      const updateData = { ...profile };
      if (!updateData.password) delete updateData.password;

      const res = await axios.put(`http://localhost:4000/api/exhibitors/${exhibitorId}`, updateData);

      const updatedExhibitor = { ...savedExhibitor, ...res.data.exhibitor };
      localStorage.setItem("exhibitorData", JSON.stringify(updatedExhibitor));

      setProfile({ ...profile, password: "" });
      setIsEditing(false);

      // Toast success notification
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Try again!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="exhibitor-page">
      <ExhibitorSidebar />

      <main className="exhibitor-main">
        <div className="profile-card">
          <h1 className="profile-title">My Profile</h1>

          <form>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <label>Password (optional)</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Leave blank to keep current password"
            />

            <label>Status</label>
            <input type="text" value={profile.status} disabled />

            <div style={{ marginTop: "10px" }}>
              {isEditing ? (
                <button type="button" onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default ExhibitorProfile;
