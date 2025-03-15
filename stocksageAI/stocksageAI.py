import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

#DBname = "stock_market"
#DBuser = "postgres"
#DBpassword = "Antifreeze21"
#DBhost = "localhost"
#DBport = "5432"

def fetchYahooData(symbol, start_date="2023-01-01", end_date="2024-03-01"):
    print(f"Fetching stock data for {symbol} from Yahoo Finance")
    stock_data = yf.download(symbol, start=start_date, end=end_date)

    if stock_data.empty:
        print("No data fetched! Check stock symbol or date range.")
        return None

    print("Data successfully fetched!")
    
    stock_data = stock_data[['Close']].reset_index()
    stock_data.rename(columns={'Close': 'close_price', 'Date': 'date'}, inplace=True)

    stock_data['date'] = pd.to_datetime(stock_data['date'])
    stock_data['days_since_start'] = (stock_data['date'] - stock_data['date'].min()).dt.days
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    stock_data['normalised_price'] = scaler.fit_transform(stock_data[['close_price']])

    return stock_data, scaler

"""
def loadData():
    
    try:

        #engine = create_engine(f"postgresql://{DBuser}:{DBpassword}@{DBhost}:{DBport}/{DBname}")

        query = "SELECT date, close_price FROM stock_prices ORDER BY date ASC;"
        df = pd.read_sql(query, con=engine)

        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values(by='date')

        print("Number of unique dates:", df['date'].nunique())

        if df['date'].nunique() == 1:
            print("All data points have the same date! Check your database.")
            return None, None

        df['days_since_start'] = (df['date'] - df['date'].min()).dt.days

        print("🔍 First few 'days_since_start' values:\n", df[['date', 'days_since_start']].head())    

        scaler = MinMaxScaler(feature_range=(0,1))
        df['normalised_price'] = scaler.fit_transform(df[['close_price']])

        return df, scaler

    except Exception as e:
        print("Error connecting to database:", str(e))
        return None, None

""" 

def trainModel(df):
    print("Model training")

    X = df[['days_since_start']]
    y = df ['normalised_price']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    plt.figure(figsize=(10,5))
    plt.plot(df['date'], df['normalised_price'], label="Actual Prices", color='blue')
    plt.plot(df['date'].iloc[len(X_train):], y_pred, label="Predicted Prices", color='red', linestyle='dashed')
    plt.xlabel("Date")
    plt.ylabel("Stock Price (Normalised)")
    plt.title("Stock Price Prediction using Linear Regression")
    plt.legend()
    plt.show()

    return model

if __name__ == "__main__":
    symbol = "AAPL"
    df, scaler = fetchYahooData(symbol)
    
    if df is not None:
        print("Successfully fetched data from yahoo finance")
        print(df.head())  # Print first 5 rows

        model = trainModel(df)
    else:
        print("Failed to fetch data from the database.")
