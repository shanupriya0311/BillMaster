import React from "react";
import "./SalesHistory.scss";

const CashierSidebar = ({ activePage, onNavigate, currentUser, onLogout, isOpen, onClose }) => {
    // Get user display info
    const userName = currentUser?.name || "Cashier";
    const userRole = currentUser?.role || "cashier";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                {/* Mobile Close Button */}
                <button className="sidebar-close" onClick={onClose}>
                    ✕
                </button>

                <div className="sidebar-header">
                    <div className="sidebar-logo-box">
                        <i className="fas fa-store"></i>
                    </div>
                    <div className="brand-text">
                        <span className="sidebar-brand-name">BillMaster</span>
                        <span className="brand-sub">Point of Sale</span>
                    </div>
                </div>

                <nav className="nav-menu">
                    <a onClick={() => { onNavigate("CashierDashboard"); onClose?.(); }} className={`nav-item ${activePage === "CashierDashboard" ? "active" : ""}`}>
                        <i className="fas fa-th-large"></i> Dashboard
                    </a>
                    <a onClick={() => { onNavigate("CashierPOS"); onClose?.(); }} className={`nav-item ${activePage === "CashierPOS" ? "active" : ""}`}>
                        <i className="fas fa-shopping-cart"></i> Point of Sale
                    </a>
                    <a onClick={() => { onNavigate("CashierSalesHistory"); onClose?.(); }} className={`nav-item ${activePage === "CashierSalesHistory" ? "active" : ""}`}>
                        <i className="fas fa-file-invoice-dollar"></i> Sales History
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">{userInitial}</div>
                        <div>
                            <div className="user-name">{userName}</div>
                            <div className="user-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onLogout}>
                        <i className="fas fa-arrow-right-from-bracket"></i> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default CashierSidebar;
