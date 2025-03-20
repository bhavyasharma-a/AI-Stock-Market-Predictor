import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/News.css"; // Create this CSS file for styling

const LatestNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);  // ✅ Fix: Declare 'loading'
    const [error, setError] = useState(null);


    useEffect(() => {
        axios.get("https://newsapi.org/v2/top-headlines?category=business&apiKey=af6d0d0a1deb44b785c792594422f0ee")
            .then(response => {
                setNews(response.data.articles.slice(0, 5)); // Fetch top 5 news articles
            })
            .catch(error => console.error("Error fetching news:", error));
    }, []);

    return (
        <div className="latest-news">
            <h2>📢 Latest Stock Market News</h2>

            {loading && <p>Loading news...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && news.length > 0 && (

            <ul> className="news-list">
                {news.map((article, index) => (
                    <li key={index}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.title}
                        </a>
                        <p>{article.source.name}</p>
                    </li>
                ))}
            </ul>
            )}
        </div>
    );
};

export default LatestNews;
