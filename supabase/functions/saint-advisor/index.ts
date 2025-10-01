import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CryptoData {
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  market_cap_rank: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  sessionId?: string;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const SAINT_PERSONALITY = {
  name: 'SAINT',
  fullName: 'Strategic Analytics Intelligence Network Terminal',
  tone: 'decisive',
  traits: ['information-rich', 'humorous', 'detailed', 'analytical'],
};

const ETHICS_DISCLAIMER = "\n\n⚠️ ETHICS ALERT: Cryptocurrency investments carry significant risk. Markets are volatile and unpredictable. This analysis is for informational purposes only and does not constitute financial advice. Always do your own research (DYOR) and never invest more than you can afford to lose.";

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, sessionId }: RequestBody = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userMessage = message.toLowerCase().trim();
    let response = '';

    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      response = `Hey there! I'm ${SAINT_PERSONALITY.name} (${SAINT_PERSONALITY.fullName}), your crypto advisor with a sense of humor and a sharp eye for data. 📊\n\nI analyze cryptocurrencies based on two key pillars:\n\n💰 PROFITABILITY: Market trends, price movements, volume analysis\n🌱 SUSTAINABILITY: Energy efficiency, project viability, long-term potential\n\nAsk me about any cryptocurrency (like Bitcoin, Ethereum, Cardano), or just say 'analyze [crypto name]' and I'll give you the full breakdown!\n\nWhat crypto are you curious about?`;
    } else if (userMessage.includes('help') || userMessage === 'what can you do') {
      response = `I'm here to be your crypto compass! Here's what I can do:\n\n1. 📈 Analyze any cryptocurrency's current market performance\n2. 💡 Provide investment insights based on profitability metrics\n3. 🌍 Evaluate sustainability factors (energy usage, project health)\n4. 📊 Compare multiple cryptos side-by-side\n5. 🎯 Give decisive recommendations with context\n\nJust tell me which crypto you want to analyze, like:\n• "Analyze Bitcoin"\n• "What about Ethereum?"\n• "Tell me about Solana"\n• "Compare BTC and ETH"\n\nLet's dive in!`;
    } else if (userMessage.includes('analyze') || userMessage.includes('tell me about') || userMessage.includes('what about')) {
      const cryptoName = extractCryptoName(userMessage);
      
      if (!cryptoName) {
        response = "I'd love to analyze a crypto for you, but I need to know which one! Try asking:\n• 'Analyze Bitcoin'\n• 'Tell me about Ethereum'\n• 'What about Cardano'";
      } else {
        const cryptoData = await fetchCryptoData(cryptoName, supabase);
        
        if (!cryptoData) {
          response = `Hmm, I couldn't find data for '${cryptoName}'. Make sure you're using the full name or popular symbol (like Bitcoin, BTC, Ethereum, ETH). Try another one!`;
        } else {
          response = generateDetailedAnalysis(cryptoData);
        }
      }
    } else if (userMessage.includes('compare')) {
      response = "Comparison mode activated! To compare cryptos, try:\n• 'Compare Bitcoin and Ethereum'\n• 'BTC vs ETH'\n\nNote: Multi-crypto comparison is coming soon. For now, analyze each individually!";
    } else if (userMessage.includes('risk') || userMessage.includes('safe')) {
      response = `Great question! Let me be crystal clear: 🎯\n\nNO cryptocurrency is 'safe' in the traditional sense. Even established coins like Bitcoin and Ethereum experience 20-50% swings. Here's my risk framework:\n\n🟢 LOWER RISK (relatively): BTC, ETH - established, large market cap\n🟡 MODERATE RISK: Top 20 cryptos - proven track record but volatile\n🔴 HIGHER RISK: New/small cap coins - massive potential but massive risk\n\nMy advice? Diversify, invest only what you can lose, and hold long-term. 🎲${ETHICS_DISCLAIMER}`;
    } else if (userMessage.includes('best') || userMessage.includes('recommend')) {
      response = `Ah, the million-dollar question! 💰\n\nI can't tell you THE best crypto (nobody can), but I can share what the data shows:\n\n🏆 ESTABLISHED LEADERS:\n• Bitcoin (BTC): Digital gold, store of value\n• Ethereum (ETH): Smart contract king, DeFi backbone\n\n🚀 STRONG CONTENDERS:\n• Solana (SOL): Speed demon, low fees\n• Cardano (ADA): Academic approach, sustainability focus\n\nMy decisive take? If you're new, start with BTC/ETH (70% of portfolio), then research others. Want specifics? Ask me to analyze any of these!${ETHICS_DISCLAIMER}`;
    } else if (userMessage.includes('thank')) {
      response = "You're welcome! Remember: stay informed, stay skeptical, and never FOMO into a trade. I'm here whenever you need crypto clarity. Good luck out there! 🚀";
    } else {
      const cryptoSymbol = identifyCryptoSymbol(userMessage);
      
      if (cryptoSymbol) {
        const cryptoData = await fetchCryptoData(cryptoSymbol, supabase);
        
        if (cryptoData) {
          response = generateDetailedAnalysis(cryptoData);
        } else {
          response = generateFallbackResponse(userMessage);
        }
      } else {
        response = generateFallbackResponse(userMessage);
      }
    }

    if (sessionId) {
      await supabase.from('chat_messages').insert([
        { session_id: sessionId, role: 'user', content: message },
        { session_id: sessionId, role: 'assistant', content: response },
      ]);
    }

    return new Response(
      JSON.stringify({ response, sessionId }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractCryptoName(message: string): string | null {
  const patterns = [
    /analyze\s+([a-z]+)/i,
    /tell me about\s+([a-z]+)/i,
    /what about\s+([a-z]+)/i,
    /(?:check|show)\s+([a-z]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].toLowerCase();
    }
  }

  return null;
}

function identifyCryptoSymbol(message: string): string | null {
  const cryptoMap: Record<string, string> = {
    'btc': 'bitcoin',
    'bitcoin': 'bitcoin',
    'eth': 'ethereum',
    'ethereum': 'ethereum',
    'ada': 'cardano',
    'cardano': 'cardano',
    'sol': 'solana',
    'solana': 'solana',
    'xrp': 'ripple',
    'ripple': 'ripple',
    'doge': 'dogecoin',
    'dogecoin': 'dogecoin',
    'dot': 'polkadot',
    'polkadot': 'polkadot',
    'matic': 'polygon',
    'polygon': 'polygon',
    'avax': 'avalanche',
    'avalanche': 'avalanche',
    'link': 'chainlink',
    'chainlink': 'chainlink',
  };

  for (const [key, value] of Object.entries(cryptoMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return null;
}

async function fetchCryptoData(cryptoId: string, supabase: any): Promise<CryptoData | null> {
  try {
    const { data: cached } = await supabase
      .from('crypto_cache')
      .select('data, expires_at')
      .eq('crypto_symbol', cryptoId)
      .maybeSingle();

    if (cached && new Date(cached.expires_at) > new Date()) {
      return cached.data as CryptoData;
    }

    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${cryptoId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return null;
    }

    const cryptoData: CryptoData = {
      symbol: data[0].symbol.toUpperCase(),
      name: data[0].name,
      current_price: data[0].current_price,
      price_change_24h: data[0].price_change_24h,
      price_change_percentage_24h: data[0].price_change_percentage_24h,
      market_cap: data[0].market_cap,
      total_volume: data[0].total_volume,
      high_24h: data[0].high_24h,
      low_24h: data[0].low_24h,
      market_cap_rank: data[0].market_cap_rank,
    };

    await supabase.from('crypto_cache').upsert({
      crypto_symbol: cryptoId,
      data: cryptoData,
      cached_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    return cryptoData;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return null;
  }
}

function generateDetailedAnalysis(crypto: CryptoData): string {
  const priceChange = crypto.price_change_percentage_24h;
  const trendEmoji = priceChange > 0 ? '📈' : '📉';
  const trendWord = priceChange > 0 ? 'UP' : 'DOWN';
  
  const profitabilityScore = calculateProfitabilityScore(crypto);
  const sustainabilityScore = calculateSustainabilityScore(crypto);
  
  let analysis = `🎯 ${crypto.name} (${crypto.symbol}) Analysis\n\n`;
  analysis += `═══════════════════════════════\n\n`;
  
  analysis += `📊 MARKET SNAPSHOT:\n`;
  analysis += `• Price: $${crypto.current_price.toLocaleString()}\n`;
  analysis += `• 24h Change: ${trendEmoji} ${priceChange.toFixed(2)}% ${trendWord}\n`;
  analysis += `• Market Cap: $${(crypto.market_cap / 1e9).toFixed(2)}B (Rank #${crypto.market_cap_rank})\n`;
  analysis += `• 24h Volume: $${(crypto.total_volume / 1e9).toFixed(2)}B\n`;
  analysis += `• 24h Range: $${crypto.low_24h.toLocaleString()} - $${crypto.high_24h.toLocaleString()}\n\n`;
  
  analysis += `💰 PROFITABILITY ASSESSMENT: ${getProfitabilityRating(profitabilityScore)}\n`;
  analysis += generateProfitabilityAnalysis(crypto, profitabilityScore);
  analysis += `\n\n`;
  
  analysis += `🌱 SUSTAINABILITY ASSESSMENT: ${getSustainabilityRating(sustainabilityScore)}\n`;
  analysis += generateSustainabilityAnalysis(crypto, sustainabilityScore);
  analysis += `\n\n`;
  
  analysis += `🎯 SAINT'S DECISIVE TAKE:\n`;
  analysis += generateDecisiveRecommendation(crypto, profitabilityScore, sustainabilityScore);
  
  analysis += ETHICS_DISCLAIMER;
  
  return analysis;
}

function calculateProfitabilityScore(crypto: CryptoData): number {
  let score = 50;
  
  if (crypto.price_change_percentage_24h > 5) score += 20;
  else if (crypto.price_change_percentage_24h > 0) score += 10;
  else if (crypto.price_change_percentage_24h < -5) score -= 20;
  else if (crypto.price_change_percentage_24h < 0) score -= 10;
  
  if (crypto.market_cap_rank <= 10) score += 20;
  else if (crypto.market_cap_rank <= 50) score += 10;
  else if (crypto.market_cap_rank > 100) score -= 10;
  
  const volumeToMarketCapRatio = crypto.total_volume / crypto.market_cap;
  if (volumeToMarketCapRatio > 0.1) score += 10;
  else if (volumeToMarketCapRatio < 0.01) score -= 5;
  
  return Math.max(0, Math.min(100, score));
}

function calculateSustainabilityScore(crypto: CryptoData): number {
  let score = 50;
  
  if (crypto.market_cap_rank <= 10) score += 25;
  else if (crypto.market_cap_rank <= 30) score += 15;
  else if (crypto.market_cap_rank <= 50) score += 5;
  else score -= 10;
  
  const knownEcoFriendly = ['cardano', 'ada', 'algorand', 'algo', 'tezos', 'xtz'];
  const knownEnergyIntensive = ['bitcoin', 'btc'];
  
  if (knownEcoFriendly.includes(crypto.symbol.toLowerCase()) || knownEcoFriendly.includes(crypto.name.toLowerCase())) {
    score += 20;
  } else if (knownEnergyIntensive.includes(crypto.symbol.toLowerCase()) || knownEnergyIntensive.includes(crypto.name.toLowerCase())) {
    score -= 15;
  }
  
  if (crypto.market_cap > 10e9) score += 15;
  else if (crypto.market_cap < 1e9) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function getProfitabilityRating(score: number): string {
  if (score >= 80) return '🟢 STRONG';
  if (score >= 60) return '🟡 MODERATE';
  if (score >= 40) return '🟠 WEAK';
  return '🔴 POOR';
}

function getSustainabilityRating(score: number): string {
  if (score >= 80) return '🟢 EXCELLENT';
  if (score >= 60) return '🟡 GOOD';
  if (score >= 40) return '🟠 FAIR';
  return '🔴 CONCERNING';
}

function generateProfitabilityAnalysis(crypto: CryptoData, score: number): string {
  let analysis = '';
  
  if (crypto.price_change_percentage_24h > 0) {
    analysis += `✓ Positive momentum with ${crypto.price_change_percentage_24h.toFixed(2)}% gain in 24h\n`;
  } else {
    analysis += `✗ Bearish pressure with ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}% decline in 24h\n`;
  }
  
  if (crypto.market_cap_rank <= 10) {
    analysis += `✓ Top 10 market position indicates strong market confidence\n`;
  } else if (crypto.market_cap_rank <= 50) {
    analysis += `✓ Established presence in top 50 cryptocurrencies\n`;
  } else {
    analysis += `⚠ Lower market cap rank suggests higher volatility risk\n`;
  }
  
  const volumeRatio = (crypto.total_volume / crypto.market_cap) * 100;
  if (volumeRatio > 10) {
    analysis += `✓ High trading volume (${volumeRatio.toFixed(1)}% of market cap) shows strong liquidity\n`;
  } else if (volumeRatio < 1) {
    analysis += `⚠ Low trading volume may indicate liquidity concerns\n`;
  } else {
    analysis += `• Moderate trading volume at ${volumeRatio.toFixed(1)}% of market cap\n`;
  }
  
  return analysis;
}

function generateSustainabilityAnalysis(crypto: CryptoData, score: number): string {
  let analysis = '';
  
  const ecoFriendly = ['cardano', 'ada', 'algorand', 'algo', 'tezos', 'xtz', 'ethereum', 'eth'];
  const energyIntensive = ['bitcoin', 'btc'];
  
  if (ecoFriendly.some(name => crypto.symbol.toLowerCase() === name || crypto.name.toLowerCase().includes(name))) {
    analysis += `✓ Uses energy-efficient Proof of Stake consensus mechanism\n`;
  } else if (energyIntensive.some(name => crypto.symbol.toLowerCase() === name || crypto.name.toLowerCase().includes(name))) {
    analysis += `⚠ Proof of Work mining has significant energy consumption\n`;
  } else {
    analysis += `• Consensus mechanism efficiency varies by implementation\n`;
  }
  
  if (crypto.market_cap_rank <= 20) {
    analysis += `✓ Long-term project viability backed by substantial market cap\n`;
  } else if (crypto.market_cap_rank > 100) {
    analysis += `⚠ Smaller projects face higher survival risk in market downturns\n`;
  }
  
  if (crypto.market_cap > 10e9) {
    analysis += `✓ Strong financial foundation with $${(crypto.market_cap / 1e9).toFixed(1)}B market cap\n`;
  } else {
    analysis += `⚠ Growing project but needs continued development and adoption\n`;
  }
  
  return analysis;
}

function generateDecisiveRecommendation(crypto: CryptoData, profitScore: number, sustainScore: number): string {
  const avgScore = (profitScore + sustainScore) / 2;
  let recommendation = '';
  
  if (avgScore >= 75) {
    recommendation += `This is looking SOLID. ${crypto.name} has strong fundamentals and positive momentum. `;
    recommendation += `If you're building a crypto portfolio, this deserves serious consideration. `;
    recommendation += `Good entry point for both short-term trades and long-term holds. ✅`;
  } else if (avgScore >= 60) {
    recommendation += `${crypto.name} is in DECENT territory. Not perfect, but not a disaster either. `;
    recommendation += `Good for diversification, but I wouldn't make it your biggest position. `;
    recommendation += `Watch the price action and volume before committing heavily. ⚖️`;
  } else if (avgScore >= 40) {
    recommendation += `PROCEED WITH CAUTION on ${crypto.name}. The data shows mixed signals. `;
    recommendation += `Not ideal for beginners or risk-averse investors. `;
    recommendation += `If you're interested, keep position sizes small and monitor closely. ⚠️`;
  } else {
    recommendation += `HOLD UP on ${crypto.name}. Current metrics are concerning. `;
    recommendation += `Unless you have specific insider knowledge or high risk tolerance, `;
    recommendation += `I'd suggest looking at more stable options first. Red flags present. 🚩`;
  }
  
  return recommendation;
}

function generateFallbackResponse(message: string): string {
  const responses = [
    "I'm SAINT, your crypto analyst! I'm best at analyzing specific cryptocurrencies. Try asking: 'Analyze Bitcoin' or 'Tell me about Ethereum'. What crypto are you curious about?",
    "Interesting question! I'm designed to provide data-driven crypto analysis. Ask me about any cryptocurrency like BTC, ETH, SOL, ADA, or others, and I'll break down the profitability and sustainability metrics!",
    "Not quite sure what you're asking, but I'm here to help with crypto analysis! Want to know about Bitcoin's market position? Ethereum's performance? Just name the crypto and I'll dive deep! 🎯",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}