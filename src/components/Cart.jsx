import { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch product images for cart items
  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) =>
            backendProductIds.includes(item.id)
        );

        const cartItemsWithImages = await Promise.all(
            updatedCartItems.map(async (item) => {
              try {
                const response = await axios.get(
                    `http://localhost:8080/api/products/${item.id}/image`,
                    { responseType: "blob" }
                );
                const imageUrl = URL.createObjectURL(response.data);
                return { ...item, imageUrl: unplugged };
              } catch (error) {
                console.error("Error fetching image:", error);
                return { ...item, imageUrl: "https://via.placeholder.com/150" };
              }
            })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  // Calculate total price
  useEffect(() => {
    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    setTotalPrice(total);
  }, [cartItems]);

  // Quantity controls
  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
        item.id === itemId
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  // Checkout logic
  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = {
          ...item,
          stockQuantity: updatedStockQuantity,
        };

        const cartProduct = new FormData();
        cartProduct.append(
            "product",
            new Blob([JSON.stringify(updatedProductData)], {
              type: "application/json",
            })
        );

        await axios.put(
            `http://localhost:8080/api/products/${item.id}`,
            cartProduct,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
        );
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
      alert("Checkout successful!");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
      <div className="cart-container">
        <div className="shopping-cart">
          <div className="title">Shopping Bag</div>
          {cartItems.length === 0 ? (
              <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
                <h4>Your cart is empty</h4>
              </div>
          ) : (
              <>
                {cartItems.map((item) => (
                    <li key={item.id} className="cart-item">
                      <div
                          className="item"
                          style={{ display: "flex", alignContent: "center" }}
                      >
                        <div>
                          <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="cart-item-image"
                              style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                        </div>
                        <div className="description">
                          <span>{item.brand}</span>
                          <span>{item.name}</span>
                        </div>

                        <div className="quantity">
                          <button
                              className="plus-btn"
                              type="button"
                              onClick={() => handleIncreaseQuantity(item.id)}
                          >
                            <i className="bi bi-plus-square-fill"></i>
                          </button>
                          <input type="button" value={item.quantity} readOnly />
                          <button
                              className="minus-btn"
                              type="button"
                              onClick={() => handleDecreaseQuantity(item.id)}
                          >
                            <i className="bi bi-dash-square-fill"></i>
                          </button>
                        </div>

                        <div className="total-price" style={{ textAlign: "center" }}>
                          ${item.price * item.quantity}
                        </div>
                        <button
                            className="remove-btn"
                            onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </div>
                    </li>
                ))}
                <div className="total">Total: ${totalPrice}</div>
                <Button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => setShowModal(true)}
                >
                  Checkout
                </Button>
              </>
          )}
        </div>
        <CheckoutPopup
            show={showModal}
            handleClose={() => setShowModal(false)}
            cartItems={cartItems}
            totalPrice={totalPrice}
            handleCheckout={handleCheckout}
        />
      </div>
  );
};

export default Cart;