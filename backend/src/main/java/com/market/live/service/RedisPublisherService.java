package com.market.live.service;

import com.market.live.model.MarketData;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisPublisherService {

    private static final String CHANNEL="market-stream";
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisPublisherService(RedisTemplate<String, Object> redisTemplate){
        this.redisTemplate = redisTemplate;
    }

    public void publish(MarketData data) {
        redisTemplate.convertAndSend(CHANNEL, data);
    }
}
