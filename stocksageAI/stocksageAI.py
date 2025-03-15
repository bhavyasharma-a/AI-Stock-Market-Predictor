import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

DBname = "stock_market"
DBuser = "postgres"
DBpassword = "Antifreeze21"
DBhost = "localhost"
DBport = "5432"

def loadData():
    try:

        engine = create_engine(f"postgresql://{DBuser}:{DBpassword}@{DBhost}:{DBport}/{DBname}")

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
    
def trainModel(df):
    print("Model training")

    X = df[['days_since_start']]
    y = df ['normalised_price']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    est_dates = df['date'].iloc[len(X_train):]

    print("🔍 First few predicted values:\n", y_pred[:5])

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
    print("Starting AI script...")
    df, scaler = loadData()
    
    if df is not None:
        print("Successfully fetched data from PostgreSQL!")
        print("🔍 Checking the first few rows of stock price data:")
        print(df.head())  # Print first 5 rows
        print("\n🔍 Checking the last few rows of stock price data:")
        print(df.tail())  # Print last 5 rows

        model = trainModel(df)
    else:
        print("Failed to fetch data from the database.")
