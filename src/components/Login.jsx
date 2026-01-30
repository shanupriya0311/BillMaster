import "./Login.scss";

export default function Login() {
  return (
    <div className="page">
      {/* LEFT PANEL */}
      <div className="left">
        {/* BRAND */}
        <div className="brand">
          <div className="brand-icon">
            <i className="fa-solid fa-store"></i>
          </div>
          <div>
            <h3>BillMaster</h3>
            <p>Point of Sale System</p>
          </div>
        </div>

        {/* HERO */}
        <div className="hero">
          <h1>
            Streamline your
            <br />
            retail operations
          </h1>

          <p>
            Fast billing, smart inventory management, and powerful analytics –
            all in one modern POS system.
          </p>

          <div className="stats">
            <div>
              <h2>&lt; 10s</h2>
              <span>Fast Checkout</span>
            </div>
            <div>
              <h2>Auto</h2>
              <span>Daily Reports</span>
            </div>
            <div>
              <h2>99.9%</h2>
              <span>Uptime</span>
            </div>
          </div>
        </div>

        <footer>© 2024 BillMaster. Enterprise POS Solution.</footer>
      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <div className="form-box">
          <h2 style={{color:"black"}} >Welcome back</h2>
          <p className="sub">Sign in to your account to continue</p>

          <label style={{color:"black"}}>Email</label>
          <input type="email" placeholder="Enter your email" />

          <label style={{color:"black"}}>Password</label>
          <input type="password" placeholder="Enter your password" />

          <p className="demo">
            Demo mode: Enter any email/password to login
          </p>

          <button className="signin">Sign In</button>
        </div>
      </div>
    </div>
  );
}
