import React from "react";
import News from "../components/News";
import "../pages/Dashboard.css";
import KeyMetrics from "../components/KeyMetrics";


const Dashboard = () => {
    return (
        <div className="dashboard-container text-center">
            <h2 className="text-3xl font-bold my-5">Welcome to StockSage</h2>
            <p>Analyze stock trends, view predictions, and make informed decisions.</p>

            {/* News Section */}
            <div className="news-section">
                <News />
            </div>

            {/* Key Metrics Section */}
            <div className="metrics-section">
                <KeyMetrics />
            </div>
        </div>
    );
};

export default Dashboard;
