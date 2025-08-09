import React, { useState } from "react";
import ExhibitorSidebar from "../components/ExhibitorSidebar"; // Agar tumne sidebar alag banaya hai
import "../exhibitorcss/ExhibitorProfile.css";

const ExhibitorProfile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "0300-1234567",
    status: "Active",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="exhibitor-page">
      <ExhibitorSidebar />

      <main className="exhibitor-main">
        <div className="profile-card">
          <h1 className="profile-title">My Profile</h1>

          <form>
            {/* Name */}
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={isEditing ? "input-editable" : "input-disabled"}
            />
            {/* Email */}
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={isEditing ? "input-editable" : "input-disabled"}
            />

            {/* Phone */}
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={isEditing ? "input-editable" : "input-disabled"}
            />

            {/* Status */}
            <label>Status</label>
            <input
              type="text"
              value={profile.status}
              disabled
              className="input-disabled"
            />

            {/* Buttons */}
            <div className="btn-group">
              {isEditing ? (
                <button type="button" onClick={handleSave} className="btn save-btn">
                  Save
                </button>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="btn edit-btn">
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ExhibitorProfile;
