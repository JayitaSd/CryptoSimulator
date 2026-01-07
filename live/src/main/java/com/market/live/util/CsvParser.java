package com.market.live.util;

import com.market.live.model.MarketData;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public final class CsvParser {

    private static final DateTimeFormatter CSV_TIME_FORMAT =
            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    private CsvParser() {
        // utility class
    }

    public static List<MarketData> parse(String resourcePath) {

        List<MarketData> result = new ArrayList<>();

        InputStream is = CsvParser.class
                .getClassLoader()
                .getResourceAsStream(resourcePath);

        if (is == null) {
            throw new IllegalStateException(
                    "CSV file not found on classpath: " + resourcePath
            );
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {

            CSVParser parser = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withTrim()
                    .withIgnoreEmptyLines()
                    .parse(reader);

            for (CSVRecord record : parser) {

                String timestampStr = record.get("timestamp");
                String symbol = record.get("symbol");

                double price = parseNumber(record.get("price_usd"));
                double volume = parseNumber(record.get("vol_24h"));
                double change24h = parsePercentage(record.get("chg_24h"));

                LocalDateTime ldt = LocalDateTime.parse(timestampStr, CSV_TIME_FORMAT);
                Instant timestamp = ldt
                        .atZone(ZoneId.systemDefault())
                        .toInstant();

                result.add(
                        new MarketData(symbol, price, volume, change24h, timestamp)
                );
            }

        } catch (Exception e) {
            throw new RuntimeException("Error parsing market CSV file", e);
        }

        return result;
    }

    /**
     * Parses numbers like:
     * "$3,202.50"
     * "4011690"
     * "+12.45"
     * "-7.1"
     */
    private static double parseNumber(String value) {

        if (value == null || value.isBlank()) {
            return 0.0;
        }

        // Remove currency symbols, commas, quotes, spaces
        String cleaned = value.replaceAll("[,$\" ]", "");

        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return 0.0; // fail-safe for real-world CSVs
        }
    }

    /**
     * Parses percentages like:
     * "-7.71%"
     * "+0.29%"
     * "#NAME?"
     */
    private static double parsePercentage(String value) {

        if (value == null || value.isBlank()) {
            return 0.0;
        }

        String cleaned = value.replace("%", "").trim();

        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
