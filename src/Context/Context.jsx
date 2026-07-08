import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(
      JSON.parse(localStorage.getItem("cart")) || []
  );

  // ✅ Modified addToCart()
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
          (item) => item.id === product.id
      );

      let updatedCart;

      if (existingProductIndex !== -1) {
        updatedCart = prevCart.map((item, index) =>
            index === existingProductIndex
                ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
                : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    console.log("productID", productId);

    const updatedCart = cart.filter((item) => item.id !== productId);

    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    console.log("CART", cart);
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
      <AppContext.Provider
          value={{
            data,
            isError,
            cart,
            addToCart,
            removeFromCart,
            refreshData,
            clearCart,
          }}
      >
        {children}
      </AppContext.Provider>
  );
};

export default AppContext;