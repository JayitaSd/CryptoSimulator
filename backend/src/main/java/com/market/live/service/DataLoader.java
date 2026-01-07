package com.market.live.service;

import com.market.live.model.MarketData;
import com.market.live.util.CsvParser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataLoader {

    private final MarketDataRepository repository;

    public DataLoader(MarketDataRepository repository){
        this.repository= repository;
    }
    public List<MarketData> getMarketData(){
        return repository.getAll();
    }
}
