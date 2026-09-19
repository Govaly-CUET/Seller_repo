import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import './AddProduct.css';

const TITLE_MAX = 255;

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [stockQuantity, setStockQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("sellerToken")) {
      navigate("/");
      return;
    }

    const loadCategories = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/seller/categories");
        setCategories(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load categories.");
      }
    };

    loadCategories();
  }, [navigate]);

  const selectedCategory = categories.find((cat) => cat._id === category);
  const subcategoryOptions = selectedCategory?.subcategory || [];

  const handleCategoryChange = (value) => {
    setCategory(value);
    setSubcategory(""); // subcategory list changes with the category
  };

  const handleImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "govaly/products");

      const res = await axiosInstance.post("/api/v1/upload", formData);
      setImageUrl(res.data.data.url);
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!localStorage.getItem("sellerToken")) {
      navigate("/");
      return;
    }

    if (
      !title.trim() ||
      !price ||
      !stockQuantity ||
      !description.trim() ||
      !imageUrl ||
      !category ||
      !subcategory
    ) {
      setError("Please fill in every required field and upload a product image.");
      return;
    }

    setIsSaving(true);

    try {
      await axiosInstance.post("/seller/products", {
        name: title.trim(),
        category,
        subcategory,
        description: description.trim(),
        image: imageUrl,
        sale_price: Number(price),
        stock: Number(stockQuantity),
        status: stockStatus,
      });

      setSuccess("Product created successfully.");

      setTitle("");
      setPrice("");
      setStockStatus("in_stock");
      setStockQuantity("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setImageUrl("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Add Product</h1>
      </div>

      {error && <p className="admin-error-text">{error}</p>}
      {success && <p className="admin-success-text">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="ap-grid">

          {/* ---------- Main column ---------- */}
          <div className="ap-main">

            <div className="admin-card">
              <label className="admin-field-label" htmlFor="ap-title">
                Product Title <span className="ap-required">*</span>
              </label>
              <div className="ap-input-counter">
                <input
                  id="ap-title"
                  type="text"
                  className="admin-input"
                  maxLength={TITLE_MAX}
                  placeholder="Enter product title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="ap-counter">{title.length}/{TITLE_MAX}</span>
              </div>
            </div>

            <div className="admin-card">
              <h3 className="ap-section-title">Simple</h3>

              <div className="admin-form-row">
                <label className="admin-field-label">
                  Price <span className="ap-required">*</span>
                </label>
                <input
                  type="number"
                  className="admin-input"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <label className="admin-field-label">
                  Stock Status <span className="ap-required">*</span>
                </label>
                <div className="ap-radio-group">
                  <label className="ap-radio">
                    <input
                      type="radio"
                      name="stockStatus"
                      checked={stockStatus === "in_stock"}
                      onChange={() => setStockStatus("in_stock")}
                    />
                    In stock
                  </label>
                  <label className="ap-radio">
                    <input
                      type="radio"
                      name="stockStatus"
                      checked={stockStatus === "out_of_stock"}
                      onChange={() => setStockStatus("out_of_stock")}
                    />
                    Out of stock
                  </label>
                </div>
              </div>

              <div className="admin-form-row">
                <label className="admin-field-label" htmlFor="ap-stock-qty">
                  Available in Stock <span className="ap-required">*</span>
                </label>
                <input
                  id="ap-stock-qty"
                  type="number"
                  className="admin-input"
                  min="0"
                  placeholder="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-card">
              <label className="admin-field-label" htmlFor="ap-description">
                Product Description <span className="ap-required">*</span>
              </label>
              <textarea
                id="ap-description"
                className="admin-input ap-textarea"
                rows={10}
                placeholder="Describe the product..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

          </div>

          {/* ---------- Side column ---------- */}
          <div className="ap-side">

            <div className="admin-card">
              <label className="admin-field-label">
                Product Image <span className="ap-required">*</span>
              </label>

              <div className="ap-image-upload">
                <button
                  type="button"
                  className="ap-image-box"
                  onClick={handleImageClick}
                  disabled={isUploading}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="Product" />
                  ) : (
                    <span className="ap-image-plus">+</span>
                  )}
                </button>

                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={handleImageClick}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Media"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="ap-file-input"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="admin-card">
              <label className="admin-field-label" htmlFor="ap-category">
                Select Category <span className="ap-required">*</span>
              </label>
              <select
                id="ap-category"
                className="admin-select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-card">
              <label className="admin-field-label" htmlFor="ap-subcategory">
                Select Subcategory <span className="ap-required">*</span>
              </label>
              <select
                id="ap-subcategory"
                className="admin-select"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!category}
              >
                <option value="">
                  {category ? "Select subcategory" : "Select a category first"}
                </option>
                {subcategoryOptions.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary ap-save-btn"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

          </div>

        </div>
      </form>
    </div>
  );
}
