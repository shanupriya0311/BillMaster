import React, { useState } from 'react';
import './AddEmployee.scss';

const AddEmployee = ({ userdata, addUser }) => {
    // Convert userdata to employees format with id and status
    const [employees, setEmployees] = useState(
        userdata.map((user, index) => ({
            id: index + 1,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || "N/A",
            status: "active"
        }))
    );

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "cashier",
        phone: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Add to local employees list for display
        const newEmployee = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
            status: "active"
        };
        setEmployees(prev => [...prev, newEmployee]);

        // Add to shared userdata so they can login
        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phone: formData.phone
        };
        addUser(newUser);

        setFormData({ name: "", email: "", password: "", role: "cashier", phone: "" });
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    const toggleStatus = (id) => {
        setEmployees(prev => prev.map(emp =>
            emp.id === id
                ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
                : emp
        ));
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="main-content">
            <div className="content-body">
                <div className="page-header">
                    <div>
                        <h1>Employees</h1>
                        <p className="subtitle">Manage your team members and their access</p>
                    </div>
                    <button className="btn-add-employee" onClick={() => setShowModal(true)}>
                        <i className="fas fa-plus"></i> Add Employee
                    </button>
                </div>

                <div className="search-filter-bar">
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="employee-count">
                        {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                    </div>
                </div>

                <div className="employee-table-container">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id}>
                                    <td>
                                        <div className="employee-info">
                                            <div className="employee-avatar">
                                                {emp.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="employee-name">{emp.name}</div>
                                                <div className="employee-email">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge role-${emp.role}`}>
                                            {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                                        </span>
                                    </td>
                                    <td>{emp.phone}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-${emp.status}`}
                                            onClick={() => toggleStatus(emp.id)}
                                        >
                                            {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(emp.id)}
                                            title="Delete employee"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredEmployees.length === 0 && (
                        <div className="empty-state">
                            <i className="fas fa-users"></i>
                            <p>No employees found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Employee</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="employee-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter employee name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AddEmployee;
