import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import Welcome from "./components/Welcome";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar onSelectCategory={handleCategorySelect} />

      <Routes>
        {/* Welcome Page (contains Login component) */}
        <Route path="/" element={<Welcome />} />

        {/* Home */}
        <Route
          path="/home"
          element={<Home selectedCategory={selectedCategory} />}
        />

        {/* Admin */}
        <Route path="/add_product" element={<AddProduct />} />
        <Route
          path="/product/update/:id"
          element={<UpdateProduct />}
        />

        {/* Product Details */}
        <Route path="/product/:id" element={<Product />} />

        {/* User */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;