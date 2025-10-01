# SAINT Cryptocurrency Advisor - Technical Documentation

## Overview
SAINT (Strategic Analytics Intelligence Network Terminal) is a rule-based cryptocurrency advisor chatbot that provides investment advice based on profitability and sustainability metrics using real-time market data.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Native Fetch API

### Backend
- **Runtime**: Deno (via Supabase Edge Functions)
- **Language**: TypeScript
- **Framework**: Native Deno.serve
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Supabase Client (@supabase/supabase-js)

### Data & APIs
- **Crypto Data Source**: CoinGecko Free API
- **API Endpoint**: https://api.coingecko.com/api/v3
- **Caching**: PostgreSQL with 5-minute TTL
- **Real-time Data**: Market prices, volume, market cap, 24h changes

### Database Schema

#### Tables
1. **chat_sessions**
   - Stores user chat sessions
   - Supports both authenticated and anonymous users
   - Tracks session metadata and activity timestamps

2. **chat_messages**
   - Stores all conversation messages
   - Links to chat sessions
   - Includes metadata for analysis results

3. **crypto_cache**
   - Caches CoinGecko API responses
   - 5-minute expiration to balance freshness and rate limits
   - Reduces API calls and improves response times

### Architecture

#### Conversational Flow
The chatbot uses rule-based if-else logic for natural language understanding:

1. **Intent Recognition**: Pattern matching on user input
2. **Crypto Identification**: Extract cryptocurrency names/symbols
3. **Data Fetching**: Query cache first, then CoinGecko API
4. **Analysis Engine**: Calculate profitability and sustainability scores
5. **Response Generation**: Format detailed analysis with recommendations

#### Analysis Rules

**Profitability Assessment (0-100 score):**
- Price momentum (24h change): +20 if >5%, -20 if <-5%
- Market cap rank: +20 if top 10, +10 if top 50
- Trading volume: +10 if >10% of market cap
- Liquidity indicators

**Sustainability Assessment (0-100 score):**
- Market cap rank (project stability): +25 if top 10
- Consensus mechanism: +20 for PoS (Proof of Stake)
- Energy efficiency: -15 for PoW (Proof of Work)
- Project viability: Based on market cap size

#### Guardrails & Ethics

**Ethics Disclaimer:**
Every analysis includes a prominent disclaimer:
- Warns about cryptocurrency volatility
- States analysis is informational only
- Encourages independent research (DYOR)
- Reminds users not to invest more than they can lose

**Response Guardrails:**
- Decisive but balanced recommendations
- Clear risk assessments
- No guaranteed returns promises
- Transparent about limitations

## Bot Personality

**Name**: SAINT (Strategic Analytics Intelligence Network Terminal)

**Characteristics:**
- **Tone**: Decisive and confident
- **Style**: Information-rich with analytical depth
- **Humor**: Lighthearted but professional
- **Detail Level**: Comprehensive breakdowns

**Response Structure:**
1. Market snapshot with current data
2. Profitability analysis with metrics
3. Sustainability evaluation
4. Decisive recommendation
5. Ethics disclaimer

## API Integration

### CoinGecko Endpoints Used
```
GET /coins/markets
Parameters:
  - vs_currency: usd
  - ids: {crypto_id}
  - order: market_cap_desc
  - per_page: 1
  - sparkline: false
```

### Data Points Retrieved
- Current price (USD)
- 24h price change (absolute & percentage)
- Market cap & rank
- Trading volume (24h)
- 24h high/low range

### Caching Strategy
- Cache duration: 5 minutes
- Cache key: Cryptocurrency symbol
- Cache invalidation: Automatic expiration
- Fallback: Direct API call if cache miss

## Deployment

### Supabase Edge Function
- **Name**: saint-advisor
- **Runtime**: Deno
- **Authentication**: Public (verify_jwt: false)
- **CORS**: Enabled for web access
- **Environment Variables**: Auto-configured

### Frontend Hosting
- Vite production build
- Static asset optimization
- Environment variables via .env

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Authenticated users can only access their own sessions
- Anonymous users can create and view their own sessions
- Crypto cache is publicly readable (market data)

### Data Privacy
- No personal information stored
- Session data is optional
- Message history can be anonymous
- No third-party tracking

## Performance Optimizations

1. **API Rate Limiting Protection**: 5-minute cache prevents excessive API calls
2. **Database Indexing**: Optimized queries on session_id and crypto_symbol
3. **Lazy Loading**: Messages loaded efficiently
4. **Edge Function**: Global deployment for low latency

## Supported Cryptocurrencies

Currently supports major cryptocurrencies including:
- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Solana (SOL)
- Ripple (XRP)
- Dogecoin (DOGE)
- Polkadot (DOT)
- Polygon (MATIC)
- Avalanche (AVAX)
- Chainlink (LINK)

Extensible to any cryptocurrency available on CoinGecko.

## Context Management

The chatbot maintains context through:
- Session IDs for conversation continuity
- Message history stored in database
- Metadata in messages for reference
- Session data for user preferences

## Testing Recommendations

1. **Functional Testing**
   - Test various cryptocurrency queries
   - Verify profitability calculations
   - Check sustainability assessments
   - Validate ethics disclaimers appear

2. **Edge Cases**
   - Unknown cryptocurrency names
   - API failures and timeouts
   - Cache expiration scenarios
   - Malformed user inputs

3. **Performance Testing**
   - Response time under load
   - Cache hit rate
   - Database query performance
   - API rate limit handling

## Future Enhancements

Potential improvements:
- Multi-crypto comparison mode
- Historical trend analysis
- Portfolio tracking
- Price alerts
- Advanced charting
- News sentiment analysis
- User authentication for personalized advice
