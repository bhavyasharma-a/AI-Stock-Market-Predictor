import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css"; // Create this file for custom styles

const StockList = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/stocks")
            .then(response => setStocks(response.data))
            .catch(error => console.error("Error fetching stocks:", error));
    }, []);

    return (
        <div className="container">
            <h2>Stock Market Data</h2>
            <table>
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Sector</th>
                </tr>
                </thead>
                <tbody>
                {stocks.map(stock => (
                    <tr key={stock.id}>
                        <td>{stock.symbol}</td>
                        <td>{stock.company}</td>
                        <td>{stock.sector}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
