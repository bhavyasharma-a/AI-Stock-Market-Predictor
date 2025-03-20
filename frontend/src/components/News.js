import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/News.css"; // Create this CSS file for styling

const LatestNews = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        axios.get("https://newsapi.org/v2/top-headlines?category=business&apiKey=YOUR_API_KEY")
            .then(response => {
                setNews(response.data.articles.slice(0, 5)); // Fetch top 5 news articles
            })
            .catch(error => console.error("Error fetching news:", error));
    }, []);

    return (
        <div className="latest-news">
            <h2>📢 Latest Stock Market News</h2>
            <ul>
                {news.map((article, index) => (
                    <li key={index}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.title}
                        </a>
                        <p>{article.source.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LatestNews;
