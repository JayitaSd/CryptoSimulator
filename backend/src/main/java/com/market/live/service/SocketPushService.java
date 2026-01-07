package com.market.live.service;

import com.market.live.model.MarketData;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class SocketPushService {
    private final SimpMessagingTemplate messagingTemplate;

    public SocketPushService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void pushdata(MarketData data) {
        messagingTemplate.convertAndSend("/topic/market", data);
    }
}
