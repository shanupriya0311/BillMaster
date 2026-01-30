import React, { useState } from "react";
import "./Home.scss";
import { Mail, Lock, Store, Clock, FileText, Activity } from "lucide-react";

export default function Home({ onLogin, userdata }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);

    // Map roles to their dashboard pages
    const roleToDashboard = {
        cashier: "CashierDashboard",
        manager: "ManagerDashboard",
        admin: "Dashboard"
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const user = userdata.find(u => u.email === email && u.password === password);
        if (user) {
            setShowError(false);
            onLogin(user, roleToDashboard[user.role]);
        } else {
            setShowError(true);
        }
    };

    return (
        <div className="landing-wrapper">
            {/* LEFT PANEL */}
            <section className="left-branding">
                <div className="brand-header">
                    <div className="logo-box">
                        <Store size={24} color="#0f172a" strokeWidth={2.5} />
                    </div>
                    <div className="brand-info">
                        <h2 className="brand-name">BillMaster</h2>
                        <span className="brand-tagline">Point of Sale System</span>
                    </div>
                </div>

                <div className="hero-content">
                    <h1 className="headline">
                        Streamline your
                        <br />
                        retail operations
                    </h1>

                    <p className="description">
                        Fast billing, smart inventory management, and
                        powerful analytics — all in one modern POS system.
                    </p>

                    <div className="stats-bar">
                        <div className="stat-group">
                            <Clock className="stat-icon" size={24} />
                            <div>
                                <h3>&lt; 10s</h3>
                                <p>Fast Checkout</p>
                            </div>
                        </div>
                        <div className="stat-group">
                            <FileText className="stat-icon" size={24} />
                            <div>
                                <h3>Auto</h3>
                                <p>Daily Reports</p>
                            </div>
                        </div>
                        <div className="stat-group">
                            <Activity className="stat-icon" size={24} />
                            <div>
                                <h3>99.9%</h3>
                                <p>Uptime</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright">
                    &copy; 2024 BillMaster, Enterprise POS Solution
                </div>
            </section>

            {/* RIGHT PANEL */}
            <section className="right-action">
                <div className="glass-card">
                    <h2 className="card-title">Welcome back.</h2>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-signin">
                            Sign In
                        </button>
                    </form>
                </div>
            </section>

            {/* Error Popup */}
            {showError && (
                <div className="error-overlay" onClick={() => setShowError(false)}>
                    <div className="error-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="error-icon">❌</div>
                        <h3>Invalid Credentials</h3>
                        <p>The email or password you entered is incorrect. Please try again.</p>
                        <button className="error-close-btn" onClick={() => setShowError(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}