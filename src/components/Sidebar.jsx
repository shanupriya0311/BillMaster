/*
  Sidebar.jsx
  Responsive Sidebar (Desktop + Mobile)
*/
import React from "react";
import "./SalesHistory.scss";

const Sidebar = ({
    activePage,
    onNavigate,
    currentUser,
    onLogout,
    isOpen,
    onClose
}) => {
    const userName = currentUser?.name || "Admin";
    const userRole = currentUser?.role || "admin";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <>
            {/* 🔹 Mobile Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                {/* 🔹 Mobile Close Button */}
                <button className="sidebar-close" onClick={onClose}>
                    ✕
                </button>

                {/* Header */}
                <div className="sidebar-header">
                    <div className="sidebar-logo-box">
                        <i className="fas fa-store"></i>
                    </div>
                    <div className="brand-text">
                        <span className="sidebar-brand-name">BillMaster</span>
                        <span className="brand-sub">Point of Sale</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="nav-menu">
                    {[
                        "Dashboard",
                        "POS",
                        "Products",
                        "Sales History",
                        "Reports",
                        "Customers",
                        "AddEmployee",
                        "Settings"
                    ].map((item) => (
                        <a
                            key={item}
                            onClick={() => {
                                onNavigate(item);
                                onClose?.(); // 🔥 auto-close on mobile
                            }}
                            className={`nav-item ${activePage === item ? "active" : ""}`}
                        >
                            <i className="fas fa-circle"></i> {item}
                        </a>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">{userInitial}</div>
                        <div>
                            <div className="user-name">{userName}</div>
                            <div className="user-role">
                                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                            </div>
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

export default Sidebar;
