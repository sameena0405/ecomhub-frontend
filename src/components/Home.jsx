import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
    const { data, isError, refreshData, addToCart } = useContext(AppContext);

    const [productsWithImages, setProductsWithImages] = useState([]);

    const role = localStorage.getItem("role");

    // Fetch Products
    useEffect(() => {
        refreshData();
    }, []);

    // Fetch Images
    useEffect(() => {
        const fetchImages = async () => {
            const updatedProducts = await Promise.all(
                data.map(async (product) => {
                    try {
                        const response = await API.get(
                            `/products/${product.id}/image`,
                            {
                                responseType: "blob",
                            }
                        );

                        const imageUrl = URL.createObjectURL(response.data);

                        return {
                            ...product,
                            imageUrl,
                        };
                    } catch (error) {
                        return {
                            ...product,
                            imageUrl: unplugged,
                        };
                    }
                })
            );

            setProductsWithImages(updatedProducts);
        };

        if (data.length > 0) {
            fetchImages();
        } else {
            setProductsWithImages([]);
        }
    }, [data]);

    // Category Filter
    const filteredProducts = selectedCategory
        ? productsWithImages.filter(
            (product) => product.category === selectedCategory
        )
        : productsWithImages;

    if (isError) {
        return (
            <h2 className="text-center" style={{ padding: "18rem" }}>
                Something went wrong.
            </h2>
        );
    }

    return (
        <>
            {/* Admin Buttons */}
            {role === "admin" && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/add-product" className="btn btn-success mx-2">
                        Add Product
                    </Link>

                    <Link to="/update-product" className="btn btn-warning mx-2">
                        Update Product
                    </Link>

                    <Link to="/delete-product" className="btn btn-danger mx-2">
                        Delete Product
                    </Link>
                </div>
            )}

            <div
                className="grid"
                style={{
                    marginTop: "64px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                    gap: "20px",
                    padding: "20px",
                }}
            >
                {filteredProducts.length === 0 ? (
                    <h2 className="text-center">No Products Available</h2>
                ) : (
                    filteredProducts.map((product) => {
                        const productAvailable = product.stockQuantity > 0;

                        return (
                            <div
                                className="card mb-3"
                                key={product.id}
                                style={{
                                    width: "250px",
                                    minHeight: "430px",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    backgroundColor: productAvailable ? "#fff" : "#ddd",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Link
                                    to={`/product/${product.id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{
                                            width: "100%",
                                            height: "160px",
                                            objectFit: "cover",
                                        }}
                                    />

                                    <div className="card-body">
                                        <h5>{product.name.toUpperCase()}</h5>

                                        <i>{product.brand}</i>

                                        <hr />

                                        <h5>
                                            <i className="bi bi-currency-rupee"></i>
                                            {product.price}
                                        </h5>

                                        <p>
                                            Stock :
                                            <strong> {product.stockQuantity}</strong>
                                        </p>
                                    </div>
                                </Link>

                                {/* User Only */}
                                {role !== "admin" && (
                                    <div style={{ padding: "10px" }}>
                                        <button
                                            className="btn btn-primary w-100"
                                            disabled={!productAvailable}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                addToCart(product);

                                                alert("Product added to cart");
                                            }}
                                        >
                                            {productAvailable
                                                ? "🛒 Add To Cart"
                                                : "Out Of Stock"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
};

export default Home;