package com.market.live.service;

import com.market.live.model.MarketData;
import com.market.live.util.CsvParser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketDataRepository {

    private final List<MarketData> marketData;

    public MarketDataRepository() {
        this.marketData = CsvParser.parse("data/cryptocurrency.csv");
    }

    public List<MarketData> getAll() {
        return marketData;
    }
}
