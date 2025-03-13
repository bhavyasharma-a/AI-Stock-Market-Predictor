import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css"; // Ensure the styles are correctly linked

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Pagination - current page
    const [pageSize, setPageSize] = useState(10); // Number of stocks per page
    const [sortBy, setSortBy] = useState("symbol"); // Sorting column
    const [sortOrder, setSortOrder] = useState("asc"); // Sorting order
    const [totalPages, setTotalPages] = useState(0); // Total number of pages
    const [error, setError] = useState(null); // Store error messages
    const [editingStock, setEditingStock] = useState(null);
    const [updatedCompany, setUpdatedCompany] = useState("");
    const [updatedSector, setUpdatedSector] = useState("");


    useEffect(() => {
        axios.get(`http://localhost:8080/api/stocks?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&order=${sortOrder}`)
            .then(response => {
                setStocks(response.data.content); // Update stock list
                setTotalPages(response.data.totalPages); // Set total pages
            })
            .catch(error => {
                console.error("Error fetching stocks:", error);
                setError("Failed to load stocks. Please try again.");
            });
    }, [currentPage, pageSize, sortBy, sortOrder]);

    const handleRowClick = (stock) => {
        setSelectedStock(stock);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
    };

    const handleDelete = (symbol) => {
        axios.delete(`http://localhost:8080/api/stocks/${symbol}`)
            .then(() => {
                setStocks(stocks.filter(stock => stock.symbol !== symbol));
            })
            .catch(error => {
                console.error("Error deleting stock:", error);
            });
    };

    // Handle Edit Stock
    const handleEdit = (stock) => {
        setEditingStock(stock);
        setUpdatedCompany(stock.company);
        setUpdatedSector(stock.sector);
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:8080/api/stocks/${editingStock.symbol}`, {
            company: updatedCompany,
            sector: updatedSector
        }).then(response => {
            setStocks(stocks.map(stock =>
                stock.symbol === editingStock.symbol ? response.data : stock
            ));
            setEditingStock(null);
        }).catch(error => {
            console.error("Error updating stock:", error);
        });
    };

    return (
        <div className={`container ${darkMode ? "dark" : ""}`}>
            <button className="toggle-dark-mode" onClick={toggleDarkMode}>
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <h2>Stock Market Data</h2>
            <table className="stock-table">
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Sector</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {stocks.map(stock => (
                    <tr key={stock.id} className={selectedStock?.id === stock.id ? "selected" : ""}>
                        <td>{stock.symbol}</td>
                        <td>{stock.company}</td>
                        <td>{stock.sector}</td>
                        <td>
                            <button className="view-details-btn" onClick={() => handleRowClick(stock)}>
                                View Details
                            </button>
                            <button className="edit-btn" onClick={() => handleEdit(stock)}>
                                Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(stock.symbol)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Edit Stock Form */}
            {editingStock && (
                <div className="edit-stock-form">
                    <h3>Edit Stock: {editingStock.symbol}</h3>
                    <label>Company:
                        <input
                            type="text"
                            value={updatedCompany}
                            onChange={(e) => setUpdatedCompany(e.target.value)}
                        />
                    </label>
                    <label>Sector:
                        <input
                            type="text"
                            value={updatedSector}
                            onChange={(e) => setUpdatedSector(e.target.value)}
                        />
                    </label>
                    <button className="save-btn" onClick={handleUpdate}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingStock(null)}>Cancel</button>
                </div>
            )}

            {selectedStock && (
                <div className="stock-info">
                    <h3>Selected Stock</h3>
                    <p><strong>Symbol:</strong> {selectedStock.symbol}</p>
                    <p><strong>Company:</strong> {selectedStock.company}</p>
                    <p><strong>Sector:</strong> {selectedStock.sector}</p>
                </div>
            )}

            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="pagination-btn"
                >
                    ⬅ Previous
                </button>

                <span className="pagination-text"> Page {currentPage + 1} of {totalPages} </span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="pagination-btn"
                >
                    Next ➡
                </button>
            </div>

        </div>
    );
};

export default StockList;
