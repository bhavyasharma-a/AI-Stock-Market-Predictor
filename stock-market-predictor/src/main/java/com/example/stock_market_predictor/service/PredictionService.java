package com.example.stock_market_predictor.service;

import com.example.stock_market_predictor.model.Prediction;
import com.example.stock_market_predictor.repository.PredictionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;

    public PredictionService(PredictionRepository predictionRepository) {
        this.predictionRepository = predictionRepository;
    }

    public List<Prediction> getAllPredictions() {
        return predictionRepository.findAll();
    }
}
