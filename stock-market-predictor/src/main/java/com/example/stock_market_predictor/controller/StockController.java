package com.example.stock_market_predictor.controller;

import com.example.stock_market_predictor.model.Stock;
import com.example.stock_market_predictor.repository.StockRepository;
import com.example.stock_market_predictor.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> getStockBySymbol(@PathVariable String symbol) {
        Optional<Stock> stock = stockService.getStockBySymbol(symbol);

        if (stock.isPresent()) {
            return ResponseEntity.ok(stock.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Stock with symbol '" + symbol + "' not found.");
        }
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchStocks(
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "symbol") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {

        Sort.Direction direction = order.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Stock> result;

        if (sector != null) {
            result = stockRepository.findBySectorContainingIgnoreCase(sector, pageable);
        } else if (company != null) {
            result = stockRepository.findByCompanyContainingIgnoreCase(company, pageable);
        } else {
            result = stockRepository.findAll(pageable);
        }

        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: No stocks found matching your search.");
        }

        return ResponseEntity.ok(result);
    }


    @PostMapping
    public ResponseEntity<?> addStock(@RequestBody Stock stock) {
        if (stock.getSymbol() == null || stock.getSymbol().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Stock symbol cannot be empty.");
        }
        if (stock.getCompany() == null || stock.getCompany().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Company name cannot be empty.");
        }
        if (stock.getSector() == null || stock.getSector().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Sector cannot be empty.");
        }

        // Check if stock already exists
        Optional<Stock> existingStock = stockRepository.findBySymbol(stock.getSymbol());
        if (existingStock.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Stock with symbol '" + stock.getSymbol() + "' already exists.");
        }

        return ResponseEntity.ok(stockService.addStock(stock));
    }

    @DeleteMapping("/{symbol}")
    public ResponseEntity<?> deleteStock(@PathVariable String symbol) {
        Optional<Stock> stock = stockService.getStockBySymbol(symbol);

        if (stock.isPresent()) {
            stockRepository.delete(stock.get());
            return ResponseEntity.ok("Stock '" + symbol + "' deleted.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Stock '" + symbol + "' not found.");
        }
    }

    @PutMapping("/{symbol}")
    public ResponseEntity<?> updateStock(@PathVariable String symbol, @RequestBody Stock updatedStock) {
        Optional<Stock> stockOptional = stockService.getStockBySymbol(symbol);

        if (stockOptional.isPresent()) {
            Stock stock = stockOptional.get();
            stock.setCompany(updatedStock.getCompany());
            stock.setSector(updatedStock.getSector());
            stockRepository.save(stock);
            return ResponseEntity.ok(stock);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Stock with symbol '" + symbol + "' not found.");
        }
    }

}
