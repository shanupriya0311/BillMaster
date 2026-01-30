import React, { useState } from "react";
import "./POS.scss";
import PaymentModal from "./PaymentModal";
import { PauseCircle, PlayCircle, Trash2 } from "lucide-react"; // Importing icons for held items

const PRODUCTS = [
  { sku: "1001", name: "Coca-Cola 500ml", price: 40, cat: "Beverages", icon: "🥤" },
  { sku: "1002", name: "Lays Classic 50g", price: 20, cat: "Snacks", icon: "🍟" },
  { sku: "1003", name: "Pringles Original", price: 99, cat: "Snacks", icon: "🥔" },
  { sku: "1004", name: "Amul Milk 500ml", price: 28, cat: "Dairy", icon: "🥛" },
];

export default function ManagerPOS({ onNavigate }) {
  const [cart, setCart] = useState({});
  const [heldCarts, setHeldCarts] = useState([]); // State for held carts
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("All");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePaymentConfirm = (details) => {
    console.log("Payment successful:", details);
    setCart({});
    setIsPaymentModalOpen(false);
  };

  const addToCart = (sku) => {
    const product = PRODUCTS.find(p => p.sku === sku);
    setCart(prev => {
      const c = { ...prev };
      c[sku] ? c[sku].qty++ : (c[sku] = { ...product, qty: 1 });
      return c;
    });
  };

  const changeQty = (sku, val) => {
    setCart(prev => {
      const c = { ...prev };
      c[sku].qty += val;
      if (c[sku].qty <= 0) delete c[sku]; // Ensure <= 0 removes it
      return c;
    });
  };

  const deleteItem = (sku) => {
    setCart(prev => {
      const c = { ...prev };
      delete c[sku];
      return c;
    });
  };


  // Hold Functionality
  const handleHold = () => {
    if (Object.keys(cart).length === 0) return; // Don't hold empty cart

    const newHold = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: cart,
      itemCount: Object.values(cart).reduce((s, i) => s + i.qty, 0),
      total: Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0) // Subtotal for info
    };

    setHeldCarts(prev => [newHold, ...prev]);
    setCart({}); // Clear cart
  };

  // Retrieve Held Cart
  const restoreHold = (holdId) => {
    const cartToRestore = heldCarts.find(h => h.id === holdId);
    if (cartToRestore) {
      setCart(cartToRestore.items);
      setHeldCarts(prev => prev.filter(h => h.id !== holdId));
    }
  };

  const filtered = PRODUCTS.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.includes(search);

    const matchCategory =
      category === "All" || p.cat === category;

    return matchSearch && matchCategory;
  });

  const subtotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const taxRate = 12;
  const tax = subtotal * taxRate / 100;
  const total = subtotal + tax;
  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);

  const handleBarcode = (e) => {
    if (e.key === "Enter") {
      addToCart(barcode);
      setBarcode("");
    }
  };

  return (
    <>
      {/* MAIN */}
      <main className="main">
        <header className="header">Point of Sale</header>

        <div className="pos">
          {/* PRODUCTS */}
          <section className="products">
            <div className="search">
              <input
                placeholder="Search by name or SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <input
                placeholder="Scan barcode / Enter SKU"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleBarcode}
              />
            </div>

            {/* CATEGORY FILTER */}
            <div className="categories">
              {[
                "All",
                "Beverages",
                "Snacks",
                "Dairy",
                "Confectionery",
                "Personal Care",
                "Grocery",
                "Bakery"
              ].map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid">
              {filtered.map(p => (
                <div
                  key={p.sku}
                  className="card"
                  onClick={() => addToCart(p.sku)}
                >
                  <div className="icon">{p.icon}</div>
                  <div className="name">{p.name}</div>
                  <div className="cat">{p.cat}</div>
                  <div className="price">₹{p.price}</div>
                  <small>SKU: {p.sku}</small>
                </div>
              ))}
            </div>
          </section>

          {/* CART */}
          <aside className="cart">
            <div className="cart-head">
              <span>Current Order</span>
              <span>{count} items</span>
            </div>

            {/* Held Bills Section */}
            {heldCarts.length > 0 && (
              <div style={{ padding: '0 10px', marginTop: '10px' }}>
                <div
                  style={{
                    backgroundColor: '#fff7ed',
                    border: '1px solid #ffedd5',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#c2410c', fontWeight: '600', fontSize: '14px' }}>
                    <PauseCircle size={16} />
                    Held Bills ({heldCarts.length})
                  </div>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {heldCarts.map(h => (
                      <button
                        key={h.id}
                        onClick={() => restoreHold(h.id)}
                        style={{
                          flex: '0 0 auto',
                          backgroundColor: 'white',
                          border: '1px solid #fed7aa',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: '#9a3412',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <PlayCircle size={12} />
                        {h.itemCount} items
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="cart-items">
              {Object.values(cart).length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '10px' }}>
                  <div style={{ fontSize: '48px', opacity: 0.2 }}>🛒</div>
                  <p>No items in cart</p>
                  <small>Scan or search products to add</small>
                </div>
              ) : (
                Object.values(cart).map(item => (
                  <div className="cart-item-card" key={item.sku}>
                    {/* Icon */}
                    <div className="item-icon">
                      {item.icon}
                    </div>

                    {/* Details */}
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price-unit">₹{item.price} × {item.qty}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => changeQty(item.sku, -1)}>−</button>
                      <span className="item-qty">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.sku, 1)}>+</button>
                    </div>

                    {/* Total Price */}
                    <div className="item-total">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>

                    {/* Delete */}
                    <button
                      className="delete-btn"
                      onClick={() => deleteItem(item.sku)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-foot">
              <div className="line">
                <span style={{ color: "black" }}>Subtotal</span>
                <span style={{ color: "black" }} >₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="line">
                <span style={{ color: "black" }}>Tax ({taxRate}%)</span>
                <span style={{ color: "black" }}>₹{tax.toFixed(2)}</span>
              </div>

              <hr className="divider" />

              <div className="total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="action-buttons">
                <button className="hold" onClick={handleHold}>⏸ Hold</button>
                <button
                  className="pay"
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={total === 0}
                  style={{ opacity: total === 0 ? 0.5 : 1, cursor: total === 0 ? 'not-allowed' : 'pointer' }}
                >
                  Pay ₹{Math.round(total)}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        count={count}
        onConfirm={handlePaymentConfirm}
      />
    </>
  );
}
