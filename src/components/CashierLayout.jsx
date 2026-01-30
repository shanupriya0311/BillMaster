import React, { useState } from "react";
import CashierSidebar from "./CashierSidebar";
import "./SalesHistory.scss";

const CashierLayout = ({ currentPage, onNavigate, currentUser, onLogout, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button
                className="hamburger-btn"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
            >
                <i className="fas fa-bars"></i>
            </button>

            <CashierSidebar
                activePage={currentPage}
                onNavigate={onNavigate}
                currentUser={currentUser}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            {/* Start Main Content Wrapper */}
            {children}
            {/* End Main Content Wrapper */}
        </div>
    );
};

export default CashierLayout;
