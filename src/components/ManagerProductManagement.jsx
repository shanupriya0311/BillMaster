import React, { useState } from "react";
import "./ProductManagement.scss";
import AddProductModal from "./AddProductModal";

/* 🔹 INITIAL PRODUCT DATA */
const initialProducts = [
  { id: 1, name: "Coca-Cola 500ml", sku: "BEV001", category: "Beverages", price: "₹40", tax: "12%", stock: 150 },
  { id: 2, name: "Pepsi 500ml", sku: "BEV002", category: "Beverages", price: "₹40", tax: "12%", stock: 120 },
  { id: 3, name: "Lays Classic 50g", sku: "SNK001", category: "Snacks", price: "₹20", tax: "12%", stock: 200 },
  { id: 4, name: "Pringles Original", sku: "SNK002", category: "Snacks", price: "₹99", tax: "12%", stock: 80 },
];

const categories = ["All", "Beverages", "Snacks", "Dairy", "Grocery"];

function ManagerProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  // 🔹 IMPORT CSV HANDLER
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      alert(`Imported file: ${file.name}`);
      // later: parse CSV & add products
    };
    reader.readAsText(file);
  };

  // 🔹 EXPORT HANDLER
  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "products.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  /* 🔹 ADD / UPDATE PRODUCT */
  const handleAddProduct = (form) => {
    if (editingProduct) {
      // ✅ UPDATE EXISTING PRODUCT
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
              ...p,
              name: form.name,
              sku: form.sku,
              category: form.category,
              price: `₹${form.price}`,
              tax: `${form.tax}%`,
              stock: Number(form.stock),
            }
            : p
        )
      );
      setEditingProduct(null);
    } else {
      // ✅ ADD NEW PRODUCT
      const newProduct = {
        id: Date.now(),
        name: form.name,
        sku: form.sku,
        category: form.category,
        price: `₹${form.price}`,
        tax: `${form.tax}%`,
        stock: Number(form.stock),
      };
      setProducts((prev) => [...prev, newProduct]);
    }
  };

  /* 🔹 DELETE */
  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* 🔹 EDIT */
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  /* 🔹 FILTER */
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {showAddProduct && (
        <AddProductModal
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
          onAdd={handleAddProduct}
          initialData={editingProduct}
        />
      )}

      <div className="container">
        {/* Sidebar */}
        {/* Sidebar REMOVED */}

        {/* Main */}
        <main className="main-content">
          <h1>Product Management</h1>
          <div className="section-header">
            <div>
              <h2>Products</h2>
              <p className="subtitle">
                {filteredProducts.length} products in inventory
              </p>
            </div>

            <div className="action-buttons">
              {/* Import */}
              <label className="btn btn-outline">
                Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  style={{ display: "none" }}
                />
              </label>

              {/* Export */}
              <button className="btn btn-outline" onClick={handleExport}>
                Export
              </button>

              {/* Add Product */}
              <button
                className="btn btn-primary"
                onClick={() => setShowAddProduct(true)}
              >
                + Add Product
              </button>
            </div>
          </div>

          {/* Search */}
          <input
            className="search-input"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Categories */}
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.tax}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => handleEdit(p)}
                    >
                      ✏️
                    </span>
                    <span
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}

export default ManagerProductManagement;
