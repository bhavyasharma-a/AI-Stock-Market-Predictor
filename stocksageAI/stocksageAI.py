import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def fetchYahooData(symbol, start_date="2023-01-01", end_date="2024-03-01"):
    print(f"Fetching stock data for {symbol} from Yahoo Finance (Prices in USD)")
    stock_data = yf.download(symbol, start=start_date, end=end_date)

    if stock_data.empty:
        print("No data fetched! Check stock symbol or date range.")
        return None, None, None

    print("Data successfully fetched in USD!")

    stock_data = stock_data[['Close', 'Volume']].reset_index()
    stock_data.rename(columns={'Close': 'close_price', 'Date': 'date', 'Volume': 'volume'}, inplace=True)

    # Convert date format to "01 Jan 24"
    stock_data['date'] = pd.to_datetime(stock_data['date']).dt.strftime("%d %b %y")

    stock_data['days_since_start'] = (pd.to_datetime(stock_data['date'], format="%d %b %y") - 
                                      pd.to_datetime(stock_data['date'].min(), format="%d %b %y")).dt.days

    stock_data['SMA_10'] = stock_data['close_price'].rolling(window=10).mean()
    stock_data['SMA_30'] = stock_data['close_price'].rolling(window=30).mean()

    stock_data.dropna(inplace=True)

    # Scaling features (except for price, to preserve USD values)
    feature_scaler = MinMaxScaler(feature_range=(0, 1))
    stock_data[['volume', 'SMA_10', 'SMA_30']] = feature_scaler.fit_transform(
        stock_data[['volume', 'SMA_10', 'SMA_30']]
    )

    # Scaling prices separately
    price_scaler = MinMaxScaler(feature_range=(0, 1))
    stock_data[['close_price']] = price_scaler.fit_transform(stock_data[['close_price']])

    return stock_data, feature_scaler, price_scaler

def prepareLSTMData(df, sequence_length=50):
    features = ['close_price', 'volume', 'SMA_10', 'SMA_30']
    data = df[features].values

    X, y = [], []
    for i in range(len(data) - sequence_length):
        X.append(data[i:i+sequence_length]) 
        y.append(data[i+sequence_length][0])

    X, y = np.array(X), np.array(y)
    X = np.reshape(X, (X.shape[0], X.shape[1], len(features))) 

    return X, y

def buildLSTMModel(input_shape):
    model = Sequential([
        LSTM(units=100, return_sequences=True, input_shape=input_shape),
        LSTM(units=100, return_sequences=False),
        Dense(units=50, activation='relu'),
        Dense(units=25, activation='relu'),
        Dense(units=1)
    ])

    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def trainLSTM(df, price_scaler):
    sequence_length = 50
    X, y = prepareLSTMData(df, sequence_length)

    split_index = int(0.8 * len(X))
    X_train, X_test = X[:split_index], X[split_index:]
    y_train, y_test = y[:split_index], y[split_index:]

    print(f"✅ X_train shape: {X_train.shape}")
    print(f"✅ y_train shape: {y_train.shape}")

    print("Training LSTM Model")
    model = buildLSTMModel((X_train.shape[1], X_train.shape[2]))

    model.fit(X_train, y_train, epochs=100, batch_size=16, verbose=1)

    predictions = model.predict(X_test)
    y_test = y_test.reshape(-1, 1)
    predictions = predictions.reshape(-1, 1)

    # Convert predictions & actual prices back to USD
    y_test = price_scaler.inverse_transform(y_test) 
    predictions = price_scaler.inverse_transform(predictions)

    test_dates = df['date'].iloc[split_index + sequence_length:].values

    print(f"Number of test dates: {len(test_dates)}")
    print(f"Number of predictions: {len(predictions)}")

    # Plot actual vs predicted prices (in USD)
    plt.figure(figsize=(10, 5))
    plt.plot(test_dates, y_test, label="Actual Prices (USD)", color='blue')
    plt.plot(test_dates, predictions, label="Predicted Prices (USD)", color='red', linestyle='dashed')
    plt.xlabel("Date")
    plt.ylabel("Stock Price (USD)")
    plt.xticks(rotation=45)  # Rotate date labels for better visibility
    plt.title("Stock Price Prediction using LSTM")
    plt.legend()
    plt.show()

    return model

if __name__ == "__main__":
    symbol = "AAPL"
    df, feature_scaler, price_scaler = fetchYahooData(symbol)
    
    if df is not None:
        print("Successfully fetched data from Yahoo Finance (in USD)")
        print(df.head()) 

        print("\nTraining **LSTM Model**...")
        lstmModel = trainLSTM(df, price_scaler)
    else:
        print("Failed to fetch data from the database.")
