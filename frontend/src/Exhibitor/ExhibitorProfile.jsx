import React, { useState, useEffect } from "react";
import ExhibitorSidebar from "../components/ExhibitorSidebar";

const ExhibitorProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedExhibitor = JSON.parse(localStorage.getItem("exhibitor"));
    if (savedExhibitor) {
      setProfile({
        name: savedExhibitor.name,
        email: savedExhibitor.email,
        phone: savedExhibitor.phone,
        status: savedExhibitor.status,
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
    // TODO: Backend update API call
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

            <label>Status</label>
            <input type="text" value={profile.status} disabled />

            <div>
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
    </div>
  );
};

export default ExhibitorProfile;
