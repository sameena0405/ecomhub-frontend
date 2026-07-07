import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "axios";

const Product = () => {
  const { id } = useParams();

  const {
    addToCart,
    removeFromCart,
    refreshData,
  } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  // NEW
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${id}`
        );

        setProduct(response.data);

        const imageResponse = await axios.get(
          `http://localhost:8080/api/products/${id}/image`,
          {
            responseType: "blob",
          }
        );

        setImageUrl(
          URL.createObjectURL(imageResponse.data)
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/products/${id}`
      );

      removeFromCart(id);

      alert("Product deleted successfully");

      refreshData();

      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2
        className="text-center"
        style={{ padding: "10rem" }}
      >
        Loading...
      </h2>
    );
  }

  return (
    <div className="containers">
      <img
        className="left-column-img"
        src={imageUrl}
        alt={product.imageName}
      />

      <div className="right-column">
        <div className="product-description">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{product.category}</span>

            <div className="release-date">
              <h6>
                Product listed on :
                <i>
                  {" "}
                  {new Date(
                    product.releaseDate
                  ).toLocaleDateString()}
                </i>
              </h6>
            </div>
          </div>

          <h1>{product.name}</h1>

          <i>{product.brand}</i>

          <p
            style={{
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            PRODUCT DESCRIPTION :
          </p>

          <p>{product.description}</p>
        </div>

        <div className="product-price">
          <span>₹ {product.price}</span>

          {/* USER ONLY */}
          {role !== "admin" && (
            <button
              className="cart-btn"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          )}

          <h6>
            Stock Available :
            <i
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {" "}
              {product.stockQuantity}
            </i>
          </h6>
        </div>

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <div className="update-button">
            <button
              className="btn btn-primary"
              onClick={handleEditClick}
            >
              Update
            </button>

            <button
              className="btn btn-danger"
              onClick={deleteProduct}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;