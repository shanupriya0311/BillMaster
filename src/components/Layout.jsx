import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Layout.scss";

function Layout({ children, currentPage, onNavigate, currentUser, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout">
      {/* 🔹 Mobile Hamburger */}
      <button
        className="hamburger"
        onClick={() => setIsSidebarOpen(true)}
         aria-label="Open Menu"
      >
        ☰
      </button>

      {/* 🔹 Sidebar */}
      <Sidebar
        activePage={currentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* 🔹 Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
