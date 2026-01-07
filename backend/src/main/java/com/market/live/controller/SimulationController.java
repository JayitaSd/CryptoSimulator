package com.market.live.controller;

import com.market.live.model.MarketData;
import com.market.live.service.DataLoader;
import com.market.live.service.DataSimulator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/simulation")
public class SimulationController {

    private final DataSimulator dataSimulator;
    private final DataLoader dataLoader;

    public SimulationController(DataSimulator dataSimulator, DataLoader dataLoader) {
        this.dataSimulator = dataSimulator;
        this.dataLoader = dataLoader;
    }

    @PostMapping("/start")
    public ResponseEntity<String> start() {
        dataSimulator.start_stream();
        return ResponseEntity.ok("Market simulation started");
    }

    @PostMapping("/stop")
    public ResponseEntity<String> stop() {
        dataSimulator.stop_stream();
        return ResponseEntity.ok("Market simulation stopped");
    }
    @GetMapping("/market-data")
    public ResponseEntity<List<MarketData>> getMarketData() {
        List<MarketData> data = dataLoader.getMarketData();
        return ResponseEntity.ok(data);
    }
}
