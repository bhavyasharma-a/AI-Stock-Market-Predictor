import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css"; // Ensure the styles are correctly linked

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/stocks")
            .then(response => setStocks(response.data))
            .catch(error => console.error("Error fetching stocks:", error));
    }, []);

    const handleRowClick = (stock) => {
        setSelectedStock(stock);
    };

    return (
        <div className="container">
            <h2>Stock Market Data</h2>
            <table className="stock-table">
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Sector</th>
                </tr>
                </thead>
                <tbody>
                {stocks.map(stock => (
                    <tr key={stock.id} onClick={() => handleRowClick(stock)}
                        className={selectedStock?.id === stock.id ? "selected" : ""}>
                        <td>{stock.symbol}</td>
                        <td>{stock.company}</td>
                        <td>{stock.sector}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedStock && (
                <div className="stock-info">
                    <h3>Selected Stock</h3>
                    <p><strong>Symbol:</strong> {selectedStock.symbol}</p>
                    <p><strong>Company:</strong> {selectedStock.company}</p>
                    <p><strong>Sector:</strong> {selectedStock.sector}</p>
                </div>
            )}
        </div>
    );
};

export default StockList;
