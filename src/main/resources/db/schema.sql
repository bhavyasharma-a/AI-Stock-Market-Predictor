CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    company VARCHAR(100) NOT NULL,
    sector VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_prices (
    id SERIAL PRIMARY KEY,
    stock_id INT NOT NULL,
    date DATE NOT NULL,
    open_price DECIMAL(10,2),
    close_price DECIMAL(10,2),
    high_price DECIMAL(10,2),
    low_price DECIMAL(10,2),
    volume BIGINT,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    CONSTRAINT unique_stock_date UNIQUE (stock_id, date)
);

CREATE TABLE stock_predictions (
    id SERIAL PRIMARY KEY,
    stock_id INT NOT NULL,
    prediction_date DATE NOT NULL,
    predicted_price DECIMAL(10,2) NOT NULL,
    confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    model_version VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

CREATE TABLE model_logs (
    id SERIAL PRIMARY KEY,
    model_version VARCHAR(20) NOT NULL,
    training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    training_accuracy DECIMAL(5,2),
    parameters TEXT
);
