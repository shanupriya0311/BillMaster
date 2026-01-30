import React, { useState } from "react";
import Login from "./components/Login";
import ProductManagement from "./components/ProductManagement";
import Products from "./Products";
import Settings from "./components/Settings";
import Customers from "./components/Customers";
import AddCustomer from "./components/AddCustomer";
import AddEmployee from "./components/AddEmployee";
import AddProductModal from "./components/AddProductModal";
import SalesHistory from "./components/SalesHistory";
import InvoiceModal from "./components/InvoiceModal";
import POS from "./components/POS";
import PaymentModal from "./components/PaymentModal";
import Reports from "./components/Reports";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import CashierLayout from "./components/CashierLayout";
import ManagerLayout from "./components/ManagerLayout";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import SignUp from "./components/SignUp";

import ManagerCustomers from "./components/ManagerCustomers";
// Cashier Imports
import CashierDashboard from "./components/CashierDashboard";
import CashierPOS from "./components/CashierPOS";
import CashierSalesHistory from "./components/CashierSalesHistory";

import ManagerDashboard from "./components/ManagerDashboard";
import ManagerPOS from "./components/ManagerPOS";
import ManagerProductManagement from "./components/ManagerProductManagement";
import ManagerSalesHistory from "./components/ManagerSalesHistory";
import ManagerReports from "./components/ManagerReports";

function App() {
  const [currentPage, setCurrentPage] = useState("Welcome");
  const [currentUser, setCurrentUser] = useState(null);
  const [userdata, setUserdata] = useState([
    { email: "shanu@gmail.com", password: "123", role: "cashier", name: "Shanu", phone: "9876543210" },
    { email: "priya@gmail.com", password: "123", role: "manager", name: "Priya", phone: "9876543211" },
    { email: "vidhya@gmail.com", password: "123", role: "admin", name: "Vidhya", phone: "9876543212" }
  ]);

  const addUser = (newUser) => {
    setUserdata(prev => [...prev, newUser]);
  };

  const handleLogin = (user, targetPage) => {
    setCurrentUser(user);
    setCurrentPage(targetPage);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("Welcome");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <Home onNavigate={setCurrentPage} />;
      case "Dashboard":
        return <Dashboard />;
      case "POS":
        return <POS />;
      case "Products":
        return <ProductManagement />;
      case "Sales History":
        return <SalesHistory />;
      case "Reports":
        return <Reports />;
      case "Customers":
        return <Customers />;
      case "Settings":
        return <Settings />;
      case "AddEmployee":
        return <AddEmployee userdata={userdata} addUser={addUser} />;

      // Cashier Routes
      case "CashierDashboard":
        return <CashierDashboard />;
      case "CashierPOS":
        return <CashierPOS onNavigate={setCurrentPage} />;
      case "CashierSalesHistory":
        return <CashierSalesHistory onNavigate={setCurrentPage} />;

      // Manager Routes
      case "ManagerDashboard":
        return <ManagerDashboard />;
      case "ManagerPOS":
        return <ManagerPOS onNavigate={setCurrentPage} />;
      case "ManagerProductManagement":
        return <ManagerProductManagement />;
      case "ManagerSalesHistory":
        return <ManagerSalesHistory onNavigate={setCurrentPage} />;
      case "ManagerReports":
        return <ManagerReports />;
      case "ManagerCustomers":
        return <ManagerCustomers onNavigate={setCurrentPage} />;


      default:
        return <Dashboard />;
    }
  };

  const isCashierPage = ["CashierDashboard", "CashierPOS", "CashierSalesHistory"].includes(currentPage);
  const isManagerPage = ["ManagerDashboard", "ManagerPOS", "ManagerProductManagement", "ManagerSalesHistory", "ManagerReports", "ManagerCustomers"].includes(currentPage);

  return (
    <>
      {currentPage === "Welcome" ? (
        <Welcome onNavigate={setCurrentPage} />
      ) : currentPage === "Home" ? (
        <Home onLogin={handleLogin} userdata={userdata} />
      ) : currentPage === "SignUp" ? (
        <SignUp onNavigate={setCurrentPage} />
      ) : isCashierPage ? (
        <CashierLayout currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout}>
          {renderPage()}
        </CashierLayout>
      ) : isManagerPage ? (
        <ManagerLayout currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout}>
          {renderPage()}
        </ManagerLayout>
      ) : (
        <Layout currentPage={currentPage} onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout}>
          {renderPage()}
        </Layout>
      )}
    </>
  );
}

export default App;
