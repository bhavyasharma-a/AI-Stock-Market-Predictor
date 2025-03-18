import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1> StockSage</h1>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/stocks">Stock List</Link></li>
                <li><Link to="/predictions">Predictions</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
