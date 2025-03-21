import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../pages/Predictions.css";

const Predictions = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredPredictions, setFilteredPredictions] = useState([]);
    const [sortBy, setSortBy] = useState("date"); // Default sorting
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterSymbol, setFilterSymbol] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/predictions") // Flask API endpoint
            .then(response => {
                const data = response.data;
                const formattedData = data.dates.map((date, index) => ({
                    date: date,  // Already in "01 Jan 24" format
                    actualPrice: parseFloat(data.actual_prices[index]).toFixed(2),
                    predictedPrice: parseFloat(data.predicted_prices[index]).toFixed(2)
                }));

                setPredictions(formattedData);
                setFilteredPredictions(formattedData);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching predictions:", error);
                setError("Failed to load predictions.");
                setLoading(false);
            });
    }, []);

    // Function to filter predictions by stock symbol (if API includes symbols)
    const handleFilterChange = (event) => {
        const symbol = event.target.value.toUpperCase();
        setFilterSymbol(symbol);

        if (symbol === "") {
            setFilteredPredictions(predictions);
        } else {
            setFilteredPredictions(predictions.filter(pred => pred.symbol?.includes(symbol)));
        }
    };

    // Function to sort predictions
    const handleSortChange = (event) => {
        const key = event.target.value;
        setSortBy(key);

        const sorted = [...filteredPredictions].sort((a, b) => {
            if (key === "predictedPrice" || key === "actualPrice") {
                return sortOrder === "asc" ? a[key] - b[key] : b[key] - a[key];
            } else {
                return sortOrder === "asc"
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            }
        });

        setFilteredPredictions(sorted);
    };

    // Function to toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        setFilteredPredictions([...filteredPredictions].reverse());
    };

    return (
        <div className="predictions-container">
            <h2 className="title">Stock Market Predictions</h2>

            {loading && <p>Loading predictions...</p>}
            {error && <p className="error">{error}</p>}

            {/* Filter & Sort Controls */}
            <div className="filter-sort-container">
                <input
                    type="text"
                    placeholder="🔎 Filter by Symbol..."
                    value={filterSymbol}
                    onChange={handleFilterChange}
                    className="filter-input"
                />

                <select onChange={handleSortChange} value={sortBy} className="sort-select">
                    <option value="date">📅 Date</option>
                    <option value="predictedPrice">💰 Predicted Price</option>
                    <option value="actualPrice">💵 Actual Price</option>
                </select>

                <button onClick={toggleSortOrder} className="sort-order-btn">
                    {sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending"}
                </button>
            </div>

            {/* Predictions Table */}
            {!loading && !error && filteredPredictions.length > 0 ? (
                <table className="predictions-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Actual Price (USD)</th>
                        <th>Predicted Price (USD)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPredictions.map((pred, index) => (
                        <tr key={index}>
                            <td>{pred.date}</td>
                            <td>${pred.actualPrice}</td>
                            <td className={Math.abs(pred.actualPrice - pred.predictedPrice) < 5 ? "high-confidence" : "low-confidence"}>
                                ${pred.predictedPrice}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-data">No predictions available.</p>
            )}

            {/* Stock Price Graph */}
            <div className="chart-container">
                <h3>📈 Predicted vs. Actual Stock Prices</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={filteredPredictions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="actualPrice" stroke="#8884d8" name="Actual Price (USD)" />
                        <Line type="monotone" dataKey="predictedPrice" stroke="#82ca9d" name="Predicted Price (USD)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Predictions;
