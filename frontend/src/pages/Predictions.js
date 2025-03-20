import React, { useState, useEffect } from "react";
import axios from "axios";
import "../pages/Predictions.css";

const Predictions = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/predictions") // Adjust API endpoint if needed
            .then(response => {
                setPredictions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching predictions:", error);
                setError("Failed to load predictions.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="predictions-container">
            <h2 className="title">📈 Stock Market Predictions</h2>

            {loading && <p>Loading predictions...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && predictions.length > 0 ? (
                <div className="predictions-grid">
                    {predictions.map((pred, index) => (
                        <div key={index} className="prediction-card">
                            <h3>{pred.symbol}</h3>
                            <p>📅 Date: {pred.date}</p>
                            <p>🔮 Predicted Price: <strong>${pred.predictedPrice.toFixed(2)}</strong></p>
                            <p>📊 Confidence: {pred.confidence}%</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-data">No predictions available.</p>
            )}
        </div>
    );
};

export default Predictions;
