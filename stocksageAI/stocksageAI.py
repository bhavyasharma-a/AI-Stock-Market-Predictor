import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.preprocessing import MinMaxScaler

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

        scaler = MinMaxScaler(feature_range=(0,1))
        df['normalised_price'] = scaler.fit_transform(df[['close_price']])

        return df, scaler

    except Exception as e:
        print("Error connecting to database:", str(e))
        return None, None

if __name__ == "__main__":
    print("Starting AI script...")
    df, scaler = loadData()
    
    if df is not None:
        print("Successfully fetched data from PostgreSQL!")
        print("First 5 rows of stock data:\n", df.head())
    else:
        print("Failed to fetch data from the database.")
