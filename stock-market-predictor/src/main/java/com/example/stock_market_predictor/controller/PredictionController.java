package com.example.stock_market_predictor.controller;

import com.example.stock_market_predictor.model.Prediction;
import com.example.stock_market_predictor.service.PredictionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping("/predictions")
    public List<Prediction> getPredictions() {
        return predictionService.getAllPredictions();
    }
}
