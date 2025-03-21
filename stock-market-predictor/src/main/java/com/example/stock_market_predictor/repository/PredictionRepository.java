package com.example.stock_market_predictor.repository;

import com.example.stock_market_predictor.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
}
