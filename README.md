# Live Market Data Simulator

A real-time market data simulation platform that streams cryptocurrency price movements from CSV-based historical data. The system processes, validates, and streams market updates while supporting real-time visualization on the frontend.

## Features

- CSV-based market data ingestion with validation and normalization  
- Real-time data simulation and streaming  
- In-memory caching using Redis  
- Live market updates via WebSocket  
- Interactive frontend dashboard with charts and tables  

## Tech Stack

### Backend
- Java  
- Redis  
- REST APIs  
- WebSocket communication  

### Frontend
- React  
- Tailwind CSS  

## Data Handling

- Parses CSV files containing price, volume, and 24h percentage change  
- Cleans formatted values (currency symbols, commas, percentages)  
- Validates numeric fields to prevent malformed data from entering the stream  

## Architecture Overview

1. CSV data is loaded and parsed at startup  
2. Parsed data is published to Redis channels  
3. WebSocket subscribers stream live updates to connected clients  
4. Frontend consumes live data and renders real-time market views  

## Running the Project

### Prerequisites
- Java 17+  
- Node.js 18+  
- Redis (Docker supported)

### Backend Setup

```bash
docker run -d --name redis-server -p 6379:6379 redis
./mvnw spring-boot:run
```

### Frontend Setup

```bash
npm install
npm run dev
```


## Future Enhancements

- Advanced analytics indicators
- Historical data playback controls
- User-defined watchlists
- Performance optimizations for large datasets
