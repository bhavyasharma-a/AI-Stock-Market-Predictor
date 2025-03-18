import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import StockList from "./pages/StockList";
import Predictions from "./pages/Predictions";

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto px-4 mt-5">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/stocks" element={<StockList />} />
                    <Route path="/predictions" element={<Predictions />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
