import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles.css"; // Ensure styles are correctly linked

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("symbol");
    const [sortOrder, setSortOrder] = useState("asc");
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [editingStock, setEditingStock] = useState(null);
    const [updatedCompany, setUpdatedCompany] = useState("");
    const [updatedSector, setUpdatedSector] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:8080/api/stocks?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&order=${sortOrder}`)
            .then(response => {
                setStocks(response.data.content);
                setTotalPages(response.data.totalPages);
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
            {/*  Breadcrumb Navigation */}
            <nav className="breadcrumb">
                <Link to="/">Home</Link> / <span>Stock List</span>
            </nav>

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
                                View
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

            {/* Edit Stock (Popup Modal) */}
            {editingStock && (
                <div className="modal">
                    <div className="modal-content">
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

            {/* Pagination */}
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
