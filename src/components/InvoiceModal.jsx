import React from "react";
import "./InvoiceModal.scss";

function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null; // safety

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* HEADER */}
        <div className="modal-header">
          <div className="header-title">
    
            <span style={{color:"black"}}>Invoice {invoice.id}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* INFO */}
        <div className="info-row">
          <span className="label">Date</span>
          <span className="value">{invoice.date}</span>
        </div>

        <div className="info-row">
          <span className="label">Cashier</span>
          <span className="value">{invoice.cashier}</span>
        </div>

        <div className="info-row">
          <span className="label">Payment</span>
          <span className="value">{invoice.payment}</span>
        </div>

        <div className="divider"></div>

        {/* ITEM */}
        <div className="item-details">
          <span>
            {invoice.item} <span className="item-qty">× {invoice.qty}</span>
          </span>
          <span>{invoice.subtotal}</span>
        </div>

        <div className="divider"></div>

        {/* TOTAL */}
        <div className="info-row">
          <span className="label">Subtotal</span>
          <span className="value">{invoice.subtotal}</span>
        </div>

        <div className="info-row">
          <span className="label">Tax</span>
          <span className="value">{invoice.tax}</span>
        </div>

        <div className="total-row">
          <span className="total-label">Total</span>
          <span className="total-amount">{invoice.total}</span>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn btn-print">
            <i className="fas fa-print"></i> Print
          </button>
          <button className="btn btn-refund" onClick={onClose}>
            <i className="fas fa-redo"></i> Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default InvoiceModal;
