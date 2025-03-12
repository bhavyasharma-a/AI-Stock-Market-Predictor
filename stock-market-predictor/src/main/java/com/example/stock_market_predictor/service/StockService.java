package com.example.stock_market_predictor.service;

import com.example.stock_market_predictor.model.Stock;
import com.example.stock_market_predictor.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockBySymbol(String symbol) {
        return stockRepository.findBySymbol(symbol);
    }

    public Stock addStock(Stock stock) {
        return stockRepository.save(stock);
    }
}
