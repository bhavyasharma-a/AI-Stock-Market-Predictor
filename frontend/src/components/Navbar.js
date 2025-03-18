import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
    };

    return (
        <nav className="navbar">
            <h1>StockSage</h1>
            <ul>
                <li className={location.pathname === "/" ? "active" : ""}>
                    <Link to="/">Dashboard</Link>
                </li>
                <li className={location.pathname === "/stocks" ? "active" : ""}>
                    <Link to="/stocks">Stock List</Link>
                </li>
                <li className={location.pathname === "/predictions" ? "active" : ""}>
                    <Link to="/predictions">Predictions</Link>
                </li>
            </ul>
            {/* Dark Mode Button */}
            <button className="dark-mode-btn" onClick={toggleDarkMode}>
                {darkMode ? "☀ Light Mode" : " Dark Mode"}
            </button>
        </nav>
    );
};

export default Navbar;
