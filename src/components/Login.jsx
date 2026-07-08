import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Clear previous login data
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    // Clear input fields
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    // Admin Login
    if (
        enteredEmail === "sameenaparves0405@gmail.com" &&
        enteredPassword === "admin123"
    ) {
      localStorage.setItem("role", "admin");
      localStorage.setItem("email", enteredEmail);

      alert("Admin Login Successful");
      navigate("/home");
      window.location.reload();
      return;
    }

    // User Login
    if (
        enteredEmail === "user@gmail.com" &&
        enteredPassword === "user123"
    ) {
      localStorage.setItem("role", "user");
      localStorage.setItem("email", enteredEmail);

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
          style={{
            width: "400px",
            borderRadius: "15px",
            margin: "auto",
          }}
      >
        <h2
            className="text-center mb-4"
            style={{
              fontWeight: "bold",
              color: "#0d6efd",
            }}
        >
          🛍️ Welcome to EcomHub
        </h2>

        <p className="text-center text-muted mb-4">
          Everything you love is just a click away
        </p>

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-3">
            <label className="form-label">Email Address</label>

            <input
                type="email"
                name="login-email"
                className="form-control"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="new-email"
                required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>

            <input
                type="password"
                name="login-password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
  );
};

export default Login;