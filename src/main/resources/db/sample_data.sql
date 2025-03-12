INSERT INTO stocks (symbol, company, sector) VALUES
('AAPL', 'Apple Inc.', 'Technology'),
('TSLA', 'Tesla Inc.', 'Automobile'),
('GOOGL', 'Alphabet Inc.', 'Technology');

INSERT INTO stock_prices (stock_id, date, open_price, close_price, high_price, low_price, volume)
VALUES
(1, '2024-03-01', 150.00, 155.50, 156.00, 149.50, 1000000),
(2, '2024-03-01', 700.00, 710.50, 715.00, 695.00, 500000);

INSERT INTO stock_predictions (stock_id, prediction_date, predicted_price, confidence_score, model_version)
VALUES
(1, '2024-03-02', 157.00, 0.92, 'v1.0'),
(2, '2024-03-02', 715.50, 0.89, 'v1.0');
