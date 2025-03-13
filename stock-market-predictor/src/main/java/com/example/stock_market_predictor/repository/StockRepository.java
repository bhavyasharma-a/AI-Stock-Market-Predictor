package com.example.stock_market_predictor.repository;

import com.example.stock_market_predictor.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long>, PagingAndSortingRepository<Stock, Long> {
    Optional<Stock> findBySymbol(String symbol);
    Page<Stock> findBySectorContainingIgnoreCase(String sector, Pageable pageable);
    Page<Stock> findByCompanyContainingIgnoreCase(String company, Pageable pageable);
}
