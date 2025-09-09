import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const fetchProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get("/profile"); 
      setProfile(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
      });
    } catch (err) {
      console.error(" Error fetching profile:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put("/profile", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfile(res.data);
      setUser(res.data); 
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await api.delete("/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      logout();
      navigate("/register");
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Failed to delete account");
    }
  };

  if (loading || !profile) return <p>Loading profile...</p>;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>My Profile</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          disabled={!editMode}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled={!editMode}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {editMode ? (
          <button
            onClick={handleUpdate}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2196F3",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        )}

        <button
          onClick={handleDelete}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#f44336",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;