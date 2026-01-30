import React, { useState } from "react";
import "./AddProductModal.scss";

function AddProductModal({ onClose, onAdd, initialData }) {
  // ✅ Derive initial state ONCE (no useEffect → no ESLint warning)
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        sku: initialData.sku || "",
        barcode: initialData.barcode || "",
        category: initialData.category || "",
        price: initialData.price?.replace("₹", "") || "",
        tax: initialData.tax?.replace("%", "") || 18,
        stock: initialData.stock || 0,
        lowStock: initialData.lowStock || 10,
      };
    }

    return {
      name: "",
      sku: "",
      barcode: "",
      category: "",
      price: "",
      tax: 18,
      stock: 0,
      lowStock: 10,
    };
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);   // add OR update handled in parent
    onClose();
  };

  return (
    <div className="ap-overlay">
      <div className="ap-modal">
        {/* Header */}
        <div className="ap-header">
          <h2>{initialData ? "Edit Product" : "Add New Product"}</h2>
          <button className="ap-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="ap-row">
            <div className="ap-group">
              <label>Product Name</label>
              <input
                name="name"
                placeholder="Enter product name"
                className="ap-highlight"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ap-group">
              <label>SKU</label>
              <input
                name="sku"
                placeholder="e.g., BEV001"
                value={form.sku}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="ap-row">
            <div className="ap-group">
              <label>Barcode</label>
              <input
                name="barcode"
                placeholder="Scan or enter barcode"
                value={form.barcode}
                onChange={handleChange}
              />
            </div>

            <div className="ap-group">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option>Beverages</option>
                <option>Snacks</option>
                <option>Dairy</option>
                <option>Grocery</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="ap-row">
            <div className="ap-group">
              <label>Price (₹)</label>
              <input
                name="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="ap-group">
              <label>Tax Rate (%)</label>
              <input
                name="tax"
                type="number"
                value={form.tax}
                onChange={handleChange}
              />
            </div>

            <div className="ap-group">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="ap-group ap-full">
            <label>Low Stock Threshold</label>
            <input
              name="lowStock"
              type="number"
              value={form.lowStock}
              onChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="ap-footer">
            <button type="button" className="ap-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ap-submit">
              {initialData ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
