import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import useAxiosInterceptor from "../api/axiosInterceptor";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();

  const handleLogout = async () => {
    try {
      await axiosJWT.delete("/logout");
      setAuth(null);
      navigate("/login");
    } catch (error) {
      console.log("Error logging out:", error);
      // Even if logout fails on server, clear local auth state
      setAuth(null);
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar is-grey" role="navigation" aria-label="main navigation" style={{ backgroundColor: "#6c757d" }}>
      <div className="navbar-brand">
        <span className="navbar-item" style={{ color: "white", fontWeight: "bold" }}>
          Employee Management
        </span>

        <a
          role="button"
          className={`navbar-burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={toggleMenu}
          style={{ color: "white" }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${isActive ? "is-active" : ""}`} style={{ backgroundColor: "#6c757d" }}>
        <div className="navbar-start">
          <Link className="navbar-item" to="/users" style={{ color: "white" }}>
            <span className="icon">
              <i className="fas fa-users"></i>
            </span>
            <span>Semua Karyawan</span>
          </Link>

          <Link className="navbar-item" to="/users/by-creator" style={{ color: "white" }}>
            <span className="icon">
              <i className="fas fa-user-friends"></i>
            </span>
            <span>Karyawan Saya</span>
          </Link>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" style={{ color: "white" }}>
              <span className="icon">
                <i className="fas fa-cog"></i>
              </span>
              <span>Edit Manajemen</span>
            </a>

            <div className="navbar-dropdown">
              <Link className="navbar-item" to="/departments">
                <span className="icon">
                  <i className="fas fa-building"></i>
                </span>
                <span>Departemen</span>
              </Link>
              <Link className="navbar-item" to="/positions">
                <span className="icon">
                  <i className="fas fa-briefcase"></i>
                </span>
                <span>Posisi</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {auth?.username && (
                <span className="button is-light is-small" style={{ marginRight: "10px" }}>
                  <span className="icon">
                    <i className="fas fa-user"></i>
                  </span>
                  <span>{auth.username}</span>
                </span>
              )}
              <button 
                className="button is-danger is-small"
                onClick={handleLogout}
              >
                <span className="icon">
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;