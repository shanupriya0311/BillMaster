import React, { useState } from "react";
import "./SalesHistory.css";
import { salesData } from "./salesdata";
import InvoiceModal from "./InvoiceModal";

function SalesHistory({ onNavigate }) {
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoice(true);
  };

  const handleClose = () => {
    setShowInvoice(false);
    setSelectedInvoice(null);
  };

  // Helper to parse "Jan 14, 2026, 08:06 AM"
  const parseDate = (dateStr) => {
    return new Date(dateStr);
  };

  // ✅ FILTER LOGIC
  const filteredSales = salesData.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.meta.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (startDate || endDate) {
      const txDate = parseDate(tx.date);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (txDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (txDate > end) return false;
      }
    }

    return true;
  });

  return (
    <>
      <main className="main-content" style={{ padding: "24px", background: "#f8fafc", height: "100%", overflowY: "auto" }}>

        {/* Header Section */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginBottom: "4px" }}>Sales History</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>{filteredSales.length} transactions</p>
        </div>

        {/* Filters/Search */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", background: "#fff", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8" }}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", width: "100%", fontSize: "14px", color: "#0f172a" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "4px 8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ border: "none", background: "transparent", fontSize: "13px", outline: "none", color: "#334155" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "4px 8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ border: "none", background: "transparent", fontSize: "13px", outline: "none", color: "#334155" }}
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                style={{ border: "none", background: "transparent", color: "#ef4444", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Transactions List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredSales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              <p>No transactions found matching your search.</p>
            </div>
          ) : (
            filteredSales.map((tx) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "white",
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}
              >
                {/* Left: Icon & ID */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#ecfdf5",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "16px" }}>{tx.id}</div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>{tx.date}</div>
                  </div>
                </div>

                {/* Right: Amount & Action */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "18px" }}>{tx.amount}</div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>
                      {tx.meta} {/* e.g. "Cash • 2 Items" */}
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewInvoice(tx)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "none",
                      background: "#f1f5f9",
                      color: "#475569",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#f1f5f9"}
                  >
                    <i className="far fa-eye"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* MODAL */}
      {
        showInvoice && selectedInvoice && (
          <InvoiceModal invoice={selectedInvoice} onClose={handleClose} />
        )
      }
    </>
  );
}

export default SalesHistory;
