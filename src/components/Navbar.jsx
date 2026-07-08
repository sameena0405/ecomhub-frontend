import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // Logout
  const logout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  // Theme
  const getInitialTheme = () => localStorage.getItem("theme") || "light-theme";
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Search
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async () => {
    if (input.trim().length > 0) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
            `http://localhost:8080/api/products/search?keyword=${input.trim().toLowerCase()}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Search Error:", error);
        setSearchResults([]);
        setNoResults(true);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  // Categories
  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  return (
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            {/* Brand */}
            <Link className="navbar-brand" to="/">
              EcomHub
            </Link>

            {/* Toggle */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {/* Home */}
                <li className="nav-item">
                  <Link className="nav-link active" to="/home">
                    Home
                  </Link>
                </li>

                {/* Categories */}
                <li className="nav-item dropdown">
                  <button
                      className="nav-link dropdown-toggle btn btn-link"
                      data-bs-toggle="dropdown"
                      style={{ textDecoration: "none" }}
                  >
                    Categories
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                          className="dropdown-item"
                          onClick={() => onSelectCategory("")}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category}>
                          <button
                              className="dropdown-item"
                              onClick={() => onSelectCategory(category)}
                          >
                            {category}
                          </button>
                        </li>
                    ))}
                  </ul>
                </li>

                {/* Admin Only */}
                {role === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/add_product">
                        Add Product
                      </Link>
                    </li>
                )}
              </ul>

              {/* Theme Button */}
              <button className="theme-btn" onClick={toggleTheme}>
                {theme === "dark-theme" ? (
                    <i className="bi bi-moon-fill"></i>
                ) : (
                    <i className="bi bi-sun-fill"></i>
                )}
              </button>

              {/* Right Section */}
              <div className="d-flex align-items-center position-relative" style={{ gap: "10px" }}>
                {/* Cart - USER ONLY */}
                {role !== "admin" && (
                    <Link to="/cart" className="nav-link">
                      <i className="bi bi-cart3"></i> Cart
                    </Link>
                )}

                {/* Search */}
                <input
                    className="form-control"
                    type="search"
                    placeholder="Search products..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ width: "250px" }}
                />
                <button className="btn btn-outline-secondary" onClick={handleSearch}>
                  <i className="bi bi-search"></i>
                </button>

                {/* Logout */}
                <button className="btn btn-danger btn-sm" onClick={logout}>
                  Logout
                </button>

                {/* Search Results */}
                {showSearchResults && (
                    <ul
                        className="list-group position-absolute"
                        style={{ top: "45px", width: "250px", zIndex: 1000 }}
                    >
                      {searchResults.length > 0 ? (
                          searchResults.map((result) => (
                              <li key={result.id} className="list-group-item">
                                <Link
                                    to={`/product/${result.id}`}
                                    className="search-result-link"
                                    onClick={() => {
                                      setShowSearchResults(false);
                                      setInput("");
                                    }}
                                >
                                  {result.name}
                                </Link>
                              </li>
                          ))
                      ) : (
                          noResults && (
                              <li className="list-group-item text-danger">No Product Found</li>
                          )
                      )}
                    </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
  );
};

export default Navbar;