import React from "react";
import StockList from "./components/StockList";

function App() {
  return (
      <div>
        <h1 className="text-center text-3xl font-bold mt-5">Stock Market Predictor</h1>
        <StockList />
      </div>
  );
}

export default App;
