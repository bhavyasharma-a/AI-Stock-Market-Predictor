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
                <h3>📊 Understanding Key Stock Metrics</h3>
                <p><strong>Market Cap:</strong> Total value of all a company's shares of stock.</p>
                <p><strong>P/E Ratio:</strong> Price-to-Earnings Ratio – measures stock valuation.</p>
                <p><strong>Dividend Yield:</strong> Percentage of a company’s share price paid out as dividends.</p>
                <p><strong>52-Week High/Low:</strong> The highest and lowest price of the stock in a year.</p>
            </div>

            {/* 📊 Stock Performance Stats (Will add API later) */}
            <section className="stats-placeholder">
                <h3>📈 Market Trends (Coming Soon...)</h3>
                <p>We will soon integrate live market data here.</p>
            </section>
        </div>
    );
};

export default Dashboard;
