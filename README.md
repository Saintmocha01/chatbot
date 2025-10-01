# SAINT - Cryptocurrency Advisor Chatbot

![SAINT Logo](https://img.shields.io/badge/SAINT-Crypto%20Advisor-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Strategic Analytics Intelligence Network Terminal (SAINT)** is a commercial-grade, rule-based cryptocurrency advisor chatbot that provides data-driven investment insights based on real-time market data, profitability metrics, and sustainability assessments.

## Features

- **Real-Time Market Analysis** - Fetches live cryptocurrency data from CoinGecko API
- **Dual Assessment Framework**
  - **Profitability Analysis**: Price trends, market cap rank, trading volume
  - **Sustainability Evaluation**: Energy efficiency, project viability, long-term potential
- **Decisive Recommendations** - Clear, actionable investment insights with risk ratings
- **Smart Caching** - 5-minute cache reduces API calls and improves response times
- **Ethics-First Approach** - Mandatory disclaimers on every analysis
- **Conversational Interface** - Natural language understanding with humor and personality
- **Session Management** - Persistent chat history and context tracking

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)

### Backend
- Supabase Edge Functions (Deno runtime)
- TypeScript
- PostgreSQL database
- Row Level Security (RLS)

### APIs & Data
- CoinGecko Free API (real-time crypto data)
- Supabase Database (caching & persistence)

## Architecture

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌─────────────────┐
│  Edge Function  │
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌──────────────┐
│ Cache  │  │  CoinGecko   │
│ (5min) │  │     API      │
└────────┘  └──────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saintmocha01/chatbot.git
   cd chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**

   The database migration is already included in `supabase/migrations/`. It will create:
   - `chat_sessions` - User chat sessions
   - `chat_messages` - Conversation history
   - `crypto_cache` - API response cache

5. **Deploy Edge Function**

   The Edge Function `saint-advisor` is located in `supabase/functions/saint-advisor/`. It handles:
   - Natural language processing
   - CoinGecko API integration
   - Profitability calculations
   - Sustainability assessments
   - Response generation

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   ```

## Usage

### Quick Start Examples

Try these prompts to get started:

- "Analyze Bitcoin"
- "Tell me about Ethereum"
- "What about Solana?"
- "Is crypto safe?"
- "Compare BTC and ETH"

### Supported Cryptocurrencies

SAINT supports all major cryptocurrencies available on CoinGecko, including:
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
- And many more...

## Analysis Methodology

### Profitability Score (0-100)

SAINT evaluates profitability based on:
- **24h Price Change**: Positive momentum adds points
- **Market Cap Rank**: Top 10 cryptos score highest
- **Trading Volume**: High volume indicates liquidity
- **Volatility Indicators**: Price range analysis

### Sustainability Score (0-100)

Sustainability assessment considers:
- **Energy Efficiency**: PoS preferred over PoW
- **Project Viability**: Market cap and stability
- **Long-term Potential**: Development activity
- **Market Position**: Established vs. emerging

### Risk Ratings

- 🟢 **STRONG/EXCELLENT** (80-100): Solid fundamentals
- 🟡 **MODERATE/GOOD** (60-79): Decent with caveats
- 🟠 **WEAK/FAIR** (40-59): Proceed with caution
- 🔴 **POOR/CONCERNING** (0-39): High risk

## Bot Personality

**Name**: SAINT (Strategic Analytics Intelligence Network Terminal)

**Characteristics**:
- Decisive and analytical tone
- Information-rich responses
- Subtle humor and personality
- Clear, actionable recommendations
- Transparent about risks

## Project Structure

```
chatbot/
├── src/
│   ├── components/         # React components
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   └── WelcomeScreen.tsx
│   ├── services/           # API services
│   │   └── chatService.ts
│   ├── types/              # TypeScript types
│   │   └── chat.ts
│   ├── lib/                # Utilities
│   │   └── supabase.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase/
│   ├── functions/          # Edge functions
│   │   └── saint-advisor/
│   └── migrations/         # Database migrations
├── TECH_STACK.md          # Detailed technical docs
└── README.md              # This file
```

## Ethics & Disclaimers

SAINT includes mandatory ethics disclaimers on every analysis:

> ⚠️ **ETHICS ALERT**: Cryptocurrency investments carry significant risk. Markets are volatile and unpredictable. This analysis is for informational purposes only and does not constitute financial advice. Always do your own research (DYOR) and never invest more than you can afford to lose.

## API Rate Limits

- **CoinGecko Free Tier**: 10-50 calls/minute
- **Caching Strategy**: 5-minute TTL reduces API load
- **Fallback**: Direct API call if cache miss

## Security

- Row Level Security (RLS) enabled on all tables
- Anonymous and authenticated user support
- No sensitive data storage
- Environment variables for secrets
- CORS configured for web access

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

To test the chatbot:

1. **Functional Tests**
   - Try various cryptocurrency queries
   - Verify profitability and sustainability scores
   - Check ethics disclaimers appear

2. **Edge Cases**
   - Unknown cryptocurrency names
   - API failures
   - Cache scenarios

3. **Performance**
   - Response times
   - Cache hit rates
   - Concurrent users

## Roadmap

Future enhancements planned:

- [ ] Multi-crypto comparison mode
- [ ] Historical trend analysis
- [ ] Portfolio tracking
- [ ] Price alerts
- [ ] Advanced charting
- [ ] News sentiment analysis
- [ ] User authentication for personalized advice

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing free cryptocurrency data
- [Supabase](https://supabase.com/) for backend infrastructure
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for frontend tooling

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Saintmocha01/chatbot/issues)
- Contact: [Your Contact Information]

## Disclaimer

This software is provided for educational and informational purposes only. The creators and contributors are not financial advisors and do not provide investment advice. Cryptocurrency investments are highly risky and volatile. Users should conduct their own research and consult with qualified financial advisors before making any investment decisions.

---

**Built with ❤️ for the crypto community**
