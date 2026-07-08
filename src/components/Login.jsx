import  { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "password") {
      localStorage.setItem("role", "admin");
      alert("Admin Login Successful");
      navigate("/home");
      window.location.reload();
      return;
    }

    if (email === "user@gmail.com" && password === "user123") {
      localStorage.setItem("role", "user");
      alert("User Login Successful");
      navigate("/home");
      window.location.reload();
      return;
    }

    alert("Invalid Email or Password");
  };

  return (
      <div
          className="card shadow p-4"
          style={{ width: "400px", borderRadius: "15px", margin: "auto" }}
      >
        <h2
            className="text-center mb-4"
            style={{
              fontWeight: "bold",
              color: "#0d6efd",
              lineHeight: "1.4",
            }}
        >
          🛍️ Welcome to EcomHub
        </h2>
        <p className="text-center text-muted mb-4">
          Everything you love is just a click away
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
  );
};

export default Login;