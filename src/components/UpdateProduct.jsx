import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../axios"; // ✅ use shared axios instance

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  // Convert blob to File
  const convertUrlToFile = async (blobData, fileName) => {
    return new File([blobData], fileName, { type: blobData.type });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`); // ✅ use API
        setProduct(response.data);

        // Fetch image
        try {
          const responseImage = await API.get(`/products/${id}/image`, {
            responseType: "blob",
          });
          const imageFile = await convertUrlToFile(
              responseImage.data,
              response.data.imageName
          );
          setImage(imageFile);
        } catch {
          setImage(null); // fallback if image not found
        }

        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = new FormData();
    if (image) {
      updatedProduct.append("imageFile", image);
    }
    updatedProduct.append(
        "product",
        new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await API.put(`/products/${id}`, updatedProduct, {
        headers: { "Content-Type": "multipart/form-data" },
      }); // ✅ use API
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
      <div className="update-product-container">
        <div className="center-container" style={{ marginTop: "7rem" }}>
          <h1>Update Product</h1>
          <form className="row g-3 pt-1" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">
                <h6>Name</h6>
              </label>
              <input
                  type="text"
                  className="form-control"
                  placeholder={product.name}
                  value={updateProduct.name}
                  onChange={handleChange}
                  name="name"
              />
            </div>

            {/* Brand */}
            <div className="col-md-6">
              <label className="form-label">
                <h6>Brand</h6>
              </label>
              <input
                  type="text"
                  name="brand"
                  className="form-control"
                  placeholder={product.brand}
                  value={updateProduct.brand}
                  onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">
                <h6>Description</h6>
              </label>
              <input
                  type="text"
                  className="form-control"
                  placeholder={product.description}
                  name="description"
                  onChange={handleChange}
                  value={updateProduct.description}
              />
            </div>

            {/* Price */}
            <div className="col-5">
              <label className="form-label">
                <h6>Price</h6>
              </label>
              <input
                  type="number"
                  className="form-control"
                  onChange={handleChange}
                  value={updateProduct.price}
                  placeholder={product.price}
                  name="price"
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label">
                <h6>Category</h6>
              </label>
              <select
                  className="form-select"
                  value={updateProduct.category}
                  onChange={handleChange}
                  name="category"
              >
                <option value="">Select category</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Mobile">Mobile</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>

            {/* Stock Quantity */}
            <div className="col-md-4">
              <label className="form-label">
                <h6>Stock Quantity</h6>
              </label>
              <input
                  type="number"
                  className="form-control"
                  onChange={handleChange}
                  placeholder={product.stockQuantity}
                  value={updateProduct.stockQuantity}
                  name="stockQuantity"
              />
            </div>

            {/* Image */}
            <div className="col-md-8">
              <label className="form-label">
                <h6>Image</h6>
              </label>
              {image ? (
                  <img
                      src={URL.createObjectURL(image)}
                      alt={product.imageName}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        padding: "5px",
                        margin: "0",
                      }}
                  />
              ) : (
                  <p>Image unavailable</p>
              )}
              <input
                  className="form-control"
                  type="file"
                  onChange={handleImageChange}
                  name="imageUrl"
              />
            </div>

            {/* Product Available */}
            <div className="col-12">
              <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="productAvailable"
                    checked={updateProduct.productAvailable}
                    onChange={(e) =>
                        setUpdateProduct((prev) => ({
                          ...prev,
                          productAvailable: e.target.checked,
                        }))
                    }
                />
                <label className="form-check-label">Product Available</label>
              </div>
            </div>

            {/* Submit */}
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default UpdateProduct;
