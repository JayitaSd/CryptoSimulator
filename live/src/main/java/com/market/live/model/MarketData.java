package com.market.live.model;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
public class MarketData {
    private String symbol;
    private double price;
    private double volume;
    private double change24h;
    private Instant timestamp;


    public MarketData() {
    }

    public MarketData(String symbol, double price, double volume, double change24h, Instant timestamp) {
        this.symbol = symbol;
        this.price = price;
        this.volume = volume;
        this.change24h = change24h;
        this.timestamp = timestamp;
    }


    @Override
    public String toString() {
        return "MarketData{" +
                "symbol='" + symbol + '\'' +
                ", price_usd=" + price +
                ", volume=" + volume +
                ", chg_24h=" + change24h +
                ", timestamp=" + timestamp +
                '}';
    }
}
