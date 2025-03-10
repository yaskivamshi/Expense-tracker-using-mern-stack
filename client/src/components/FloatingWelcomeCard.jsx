import React from "react";
import { Button } from "@mui/material";
import { Logout } from "@mui/icons-material";

const FloatingWelcomeCard = ({ username }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        zIndex: 1000,
      }}
    >
      {/* Hello, User Card */}
      <div
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "10px 20px",
          borderRadius: "20px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        👋 Hello, {username}!
      </div>

      {/* Welcome Message Card */}
      <div
        style={{
          backgroundColor: "#f1f5f9",
          color: "#1e293b",
          padding: "10px 15px",
          borderRadius: "10px",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "14px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        Welcome to <br /> Expense Management System
      </div>
    </div>
  );
};

export default FloatingWelcomeCard;
