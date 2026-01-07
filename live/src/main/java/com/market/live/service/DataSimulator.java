package com.market.live.service;

import com.market.live.model.MarketData;
import com.market.live.util.CsvParser;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class DataSimulator {
    private final RedisPublisherService redisPublisherService;

    private List<MarketData> marketDataList;
    private int currentIndex = 0;

    private ScheduledExecutorService scheduler;
    private boolean running = false;

    @Value("${market.stream.delay-ms:500}")
    private long delayMs;

    public DataSimulator(RedisPublisherService redisPublisherService,
                         MarketDataRepository repository) {
        this.redisPublisherService = redisPublisherService;
        this.marketDataList = repository.getAll();
    }

    @PostConstruct
    public void init(){
        if (marketDataList == null || marketDataList.isEmpty()) {
            throw new IllegalStateException("Market data list is empty. Simulation cannot start.");
        }
        marketDataList.stream().limit(5).forEach(System.out::println);
    }



    public synchronized void start_stream(){
        if(running || marketDataList.isEmpty()){
            System.out.println("Running");
            return;
        }
        running = true;
        scheduler = Executors.newSingleThreadScheduledExecutor();

        scheduler.scheduleAtFixedRate(() -> {

            if (!running || currentIndex >= marketDataList.size()) {
                System.out.println("Stopped streaming");
                stop_stream();
                return;
            }

            MarketData data = marketDataList.get(currentIndex);
            redisPublisherService.publish(data);

            currentIndex++;

        }, 0, delayMs, TimeUnit.MILLISECONDS);
    }

    public synchronized void stop_stream(){
        running=false;
        currentIndex = 0;

        if(scheduler!=null){
            scheduler.shutdown();
            scheduler = null;
        }
    }
}
