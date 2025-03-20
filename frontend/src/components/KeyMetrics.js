import React from "react";
import "../components/KeyMetrics.css";

const KeyMetrics = () => {
    const metrics = [
        { name: "Market Capitalization", value: "$2.5T", description: "Total market value of a company's outstanding shares." },
        { name: "P/E Ratio", value: "35.4", description: "Price-to-Earnings ratio shows valuation compared to earnings." },
        { name: "Dividend Yield", value: "1.2%", description: "Annual dividend payments as a percentage of stock price." },
        { name: "52-Week High/Low", value: "$185 / $135", description: "Highest and lowest price of the stock in the last 52 weeks." },
        { name: "Beta", value: "1.15", description: "Measures stock volatility compared to the overall market." },
    ];

    return (
        <div className="metrics-container">
            <h3 className="metrics-title">📊 Key Stock Market Metrics</h3>
            <div className="metrics-grid">
                {metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                        <h4>{metric.name}</h4>
                        <p className="metric-value">{metric.value}</p>
                        <p className="metric-description">{metric.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyMetrics;
