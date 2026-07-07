import React from "react";
import Login from "./Login";

function Welcome() {
  return (
    <div
      className="welcome-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        className="text-center"
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        }}
      >
        <h1 className="mb-3">Welcome to EcomHub</h1>

        <p className="text-muted mb-4">
          Browse Products and Enjoy Shopping
        </p>

        {/* Login Form */}
        <Login />
      </div>
    </div>
  );
}

export default Welcome;