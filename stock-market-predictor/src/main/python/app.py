from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)

# Store the trained LSTM model
MODEL_PATH = "lstm_model.h5"
model = None

def fetch_stock_data(symbol, start_date="2023-01-01", end_date="2024-03-01"):
    stock_data = yf.download(symbol, start=start_date, end=end_date)
    if stock_data.empty:
        return None

    stock_data = stock_data[['Close']].reset_index()
    stock_data.rename(columns={'Close': 'close_price', 'Date': 'date'}, inplace=True)
    stock_data['date'] = pd.to_datetime(stock_data['date']).dt.strftime("%d %b %y")

    price_scaler = MinMaxScaler(feature_range=(0, 1))
    stock_data[['close_price']] = price_scaler.fit_transform(stock_data[['close_price']])
    
    return stock_data, price_scaler

@app.route('/api/predict', methods=['GET'])
def predict_stock():
    global model

    symbol = request.args.get("symbol", "AAPL")
    stock_data, price_scaler = fetch_stock_data(symbol)

    if stock_data is None:
        return jsonify({"error": "Failed to fetch stock data"}), 500

    # Prepare data for prediction
    sequence_length = 50
    X_test = np.array([stock_data['close_price'].values[-sequence_length:]])
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    if not model:
        if os.path.exists(MODEL_PATH):
            model = load_model(MODEL_PATH)
        else:
            return jsonify({"error": "Model not found"}), 500

    predictions = model.predict(X_test)
    predicted_price = price_scaler.inverse_transform(predictions.reshape(-1, 1))[0][0]

    return jsonify({
        "symbol": symbol,
        "predicted_price": round(predicted_price, 2),
        "date": stock_data['date'].iloc[-1]
    })

if __name__ == '__main__':
    app.run(debug=True)
