import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navToLogin = () => {
    navigate("/login");
  };

  return (
    <header>
      <h2 className="logo">GUESS THE COUNTRY</h2>
      <nav className="navigation">
        <a href="/">Home</a>
        <Link to="/rules">Rules</Link>
        {isLoggedIn ? (
          <>
            <Link to="/add_clue">Add Clue</Link>
            <button type="button" className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <button type="button" className="nav-login" onClick={navToLogin}>
              Login
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
