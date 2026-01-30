import React, { useState } from 'react';
import './Customers.css';
import { customerdata } from './cdata';
import AddCustomer from './AddCustomer';
import deleteIcon from '../assets/delete.png';

/* =======================
   Customer Card Component
   ======================= */
const CustomerCard = ({ customer, onDelete }) => (
    <div className="card">
        <div className="card-header">
            <div className="customer-avatar">👤</div>
            <div className="info">
                <h3>{customer.name}</h3>
                <p>📞 {customer.phone}</p>
                {customer.email && <p>📧 {customer.email}</p>}
            </div>
        </div>

        <div className="card-stats">
            <div className="stat-box">
                <span className="stat-label">🛒 Total Purchases</span>
                <span className="stat-value">{customer.total}</span>
            </div>
        </div>

        {/* DELETE ICON */}
        <img
            src={deleteIcon}
            alt="Delete"
            className="delete-icon"
            onClick={() => onDelete(customer.id)}
        />
    </div>
);

/* =======================
   Main Component
   ======================= */
const ManagerCustomers = ({ onNavigate }) => {
    const [customers, setCustomers] = useState(customerdata);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
    );

    const handleAddCustomer = (newCustomer) => {
        setCustomers(prev => [...prev, newCustomer]);
    };

    const handleDelete = (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    return (
        <>
            {/* Main Content */}
            <main className="main-content">
                <div className="content-header">
                    <h1>Customers</h1>
                    <button
                        className="btn-add"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Customer
                    </button>
                </div>

                <div className="search-section">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="customer-grid">
                    {filteredCustomers.map(customer => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </main>

            {/* Add Customer Modal */}
            {showModal && (
                <AddCustomer
                    onAdd={handleAddCustomer}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default ManagerCustomers;
