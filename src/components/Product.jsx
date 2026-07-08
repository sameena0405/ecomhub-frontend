import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import API from "../axios"; // ✅ use shared axios instance

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`); // ✅ use API
        setProduct(response.data);

        try {
          const imageResponse = await API.get(`/products/${id}/image`, {
            responseType: "blob",
          });
          setImageUrl(URL.createObjectURL(imageResponse.data));
        } catch {
          setImageUrl("https://via.placeholder.com/300x200?text=No+Image"); // ✅ fallback
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await API.delete(`/products/${id}`); // ✅ use API
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/home");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert("Product added to cart");
    }
  };

  if (!product) {
    return (
        <h2 className="text-center" style={{ padding: "10rem" }}>
          Loading...
        </h2>
    );
  }

  return (
      <div className="containers">
        {/* Product Image */}
        <img
            className="left-column-img"
            src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={product.imageName || "Product Image"}
        />

        {/* Product Details */}
        <div className="right-column">
          <div className="product-description">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{product.category}</span>
              <div className="release-date">
                <h6>
                  Product listed on:{" "}
                  <i>
                    {product.releaseDate
                        ? new Date(product.releaseDate).toLocaleDateString()
                        : "N/A"}
                  </i>
                </h6>
              </div>
            </div>

            <h1>{product.name}</h1>
            <i>{product.brand}</i>

            <p style={{ fontWeight: "bold", marginTop: "15px" }}>
              PRODUCT DESCRIPTION:
            </p>
            <p>{product.description}</p>
          </div>

          {/* Price & Stock */}
          <div className="product-price">
            <span>₹ {product.price}</span>

            {/* USER ONLY */}
            {role !== "admin" && (
                <button className="cart-btn" onClick={handleAddToCart}>
                  Add To Cart
                </button>
            )}

            <h6>
              Stock Available:{" "}
              <i style={{ color: "green", fontWeight: "bold" }}>
                {product.stockQuantity}
              </i>
            </h6>
          </div>

          {/* ADMIN ONLY */}
          {role === "admin" && (
              <div className="update-button" style={{ marginTop: "1rem" }}>
                <button className="btn btn-primary me-2" onClick={handleEditClick}>
                  Update
                </button>
                <button className="btn btn-danger" onClick={deleteProduct}>
                  Delete
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default Product;
