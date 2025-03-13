package com.example.stock_market_predictor.controller;

import com.example.stock_market_predictor.model.Stock;
import com.example.stock_market_predictor.repository.StockRepository;
import com.example.stock_market_predictor.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    @Autowired
    private StockRepository stockRepository;

    // Get paginated & sorted stocks
    @GetMapping
    public Page<Stock> getStocks(
            @RequestParam(defaultValue = "0") int page,  // Default to page 0
            @RequestParam(defaultValue = "10") int size, // Default 10 stocks per page
            @RequestParam(defaultValue = "symbol") String sortBy, // Default sorting by symbol
            @RequestParam(defaultValue = "asc") String order) { // Default sorting order

        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return stockRepository.findAll(pageable);
    }

    @GetMapping("/all") // <-- This is changed
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{symbol}")
    public Optional<Stock> getStockBySymbol(@PathVariable String symbol) {
        return stockService.getStockBySymbol(symbol);
    }

    @GetMapping("/search")
    public Page<Stock> searchStocks(
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "symbol") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {

        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        if (sector != null) {
            return stockRepository.findBySectorContainingIgnoreCase(sector, pageable);
        } else if (company != null) {
            return stockRepository.findByCompanyContainingIgnoreCase(company, pageable);
        } else {
            return stockRepository.findAll(pageable);
        }
    }


    @PostMapping
    public Stock addStock(@RequestBody Stock stock) {
        return stockService.addStock(stock);
    }
}
