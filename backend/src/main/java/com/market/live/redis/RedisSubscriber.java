package com.market.live.redis;

import com.market.live.model.MarketData;
import com.market.live.service.SocketPushService;
import org.springframework.stereotype.Component;

@Component
public class RedisSubscriber {
    private final SocketPushService socketPushService;
    public RedisSubscriber(SocketPushService socketPushService) {
        this.socketPushService = socketPushService;
    }
    public void message(MarketData data){
        socketPushService.pushdata(data);
    }
}
