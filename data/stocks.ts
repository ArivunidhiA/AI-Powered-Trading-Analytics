export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
}

export const STOCKS: Stock[] = [
  // Technology
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', marketCap: 3000000000000 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', marketCap: 2800000000000 },
  { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', sector: 'Technology', marketCap: 1800000000000 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Technology', marketCap: 1500000000000 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', marketCap: 1200000000000 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', marketCap: 800000000000 },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Technology', marketCap: 700000000000 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Technology', marketCap: 200000000000 },
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', marketCap: 250000000000 },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', marketCap: 200000000000 },
  { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', marketCap: 300000000000 },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', marketCap: 150000000000 },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', sector: 'Technology', marketCap: 200000000000 },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', marketCap: 200000000000 },
  { symbol: 'IBM', name: 'International Business Machines Corp.', sector: 'Technology', marketCap: 120000000000 },

  // Financial Services
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', marketCap: 400000000000 },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services', marketCap: 250000000000 },
  { symbol: 'WFC', name: 'Wells Fargo & Company', sector: 'Financial Services', marketCap: 150000000000 },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'Financial Services', marketCap: 120000000000 },
  { symbol: 'MS', name: 'Morgan Stanley', sector: 'Financial Services', marketCap: 140000000000 },
  { symbol: 'C', name: 'Citigroup Inc.', sector: 'Financial Services', marketCap: 100000000000 },
  { symbol: 'AXP', name: 'American Express Company', sector: 'Financial Services', marketCap: 120000000000 },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services', marketCap: 500000000000 },
  { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services', marketCap: 350000000000 },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financial Services', marketCap: 60000000000 },

  // Healthcare
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: 400000000000 },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', marketCap: 200000000000 },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', marketCap: 500000000000 },
  { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', marketCap: 300000000000 },
  { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', marketCap: 300000000000 },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', sector: 'Healthcare', marketCap: 200000000000 },
  { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', marketCap: 200000000000 },
  { symbol: 'DHR', name: 'Danaher Corporation', sector: 'Healthcare', marketCap: 200000000000 },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb Company', sector: 'Healthcare', marketCap: 100000000000 },
  { symbol: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare', marketCap: 150000000000 },

  // Consumer Discretionary
  { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', marketCap: 350000000000 },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary', marketCap: 200000000000 },
  { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary', marketCap: 150000000000 },
  { symbol: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer Discretionary', marketCap: 100000000000 },
  { symbol: 'LOW', name: 'Lowe\'s Companies Inc.', sector: 'Consumer Discretionary', marketCap: 150000000000 },
  { symbol: 'TJX', name: 'TJX Companies Inc.', sector: 'Consumer Discretionary', marketCap: 100000000000 },
  { symbol: 'BKNG', name: 'Booking Holdings Inc.', sector: 'Consumer Discretionary', marketCap: 100000000000 },
  { symbol: 'CMG', name: 'Chipotle Mexican Grill Inc.', sector: 'Consumer Discretionary', marketCap: 50000000000 },
  { symbol: 'TGT', name: 'Target Corporation', sector: 'Consumer Discretionary', marketCap: 80000000000 },
  { symbol: 'COST', name: 'Costco Wholesale Corporation', sector: 'Consumer Discretionary', marketCap: 300000000000 },

  // Consumer Staples
  { symbol: 'PG', name: 'Procter & Gamble Company', sector: 'Consumer Staples', marketCap: 350000000000 },
  { symbol: 'KO', name: 'Coca-Cola Company', sector: 'Consumer Staples', marketCap: 250000000000 },
  { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples', marketCap: 250000000000 },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples', marketCap: 400000000000 },
  { symbol: 'CL', name: 'Colgate-Palmolive Company', sector: 'Consumer Staples', marketCap: 60000000000 },
  { symbol: 'KMB', name: 'Kimberly-Clark Corporation', sector: 'Consumer Staples', marketCap: 50000000000 },
  { symbol: 'GIS', name: 'General Mills Inc.', sector: 'Consumer Staples', marketCap: 40000000000 },
  { symbol: 'K', name: 'Kellogg Company', sector: 'Consumer Staples', marketCap: 20000000000 },
  { symbol: 'HSY', name: 'Hershey Company', sector: 'Consumer Staples', marketCap: 40000000000 },
  { symbol: 'CLX', name: 'Clorox Company', sector: 'Consumer Staples', marketCap: 20000000000 },

  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', marketCap: 400000000000 },
  { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', marketCap: 300000000000 },
  { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy', marketCap: 150000000000 },
  { symbol: 'EOG', name: 'EOG Resources Inc.', sector: 'Energy', marketCap: 80000000000 },
  { symbol: 'SLB', name: 'Schlumberger Limited', sector: 'Energy', marketCap: 60000000000 },
  { symbol: 'OXY', name: 'Occidental Petroleum Corporation', sector: 'Energy', marketCap: 50000000000 },
  { symbol: 'PXD', name: 'Pioneer Natural Resources Company', sector: 'Energy', marketCap: 60000000000 },
  { symbol: 'KMI', name: 'Kinder Morgan Inc.', sector: 'Energy', marketCap: 40000000000 },
  { symbol: 'MPC', name: 'Marathon Petroleum Corporation', sector: 'Energy', marketCap: 60000000000 },
  { symbol: 'VLO', name: 'Valero Energy Corporation', sector: 'Energy', marketCap: 50000000000 },

  // Industrial
  { symbol: 'BA', name: 'Boeing Company', sector: 'Industrial', marketCap: 100000000000 },
  { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrial', marketCap: 150000000000 },
  { symbol: 'GE', name: 'General Electric Company', sector: 'Industrial', marketCap: 100000000000 },
  { symbol: 'HON', name: 'Honeywell International Inc.', sector: 'Industrial', marketCap: 150000000000 },
  { symbol: 'UPS', name: 'United Parcel Service Inc.', sector: 'Industrial', marketCap: 120000000000 },
  { symbol: 'FDX', name: 'FedEx Corporation', sector: 'Industrial', marketCap: 60000000000 },
  { symbol: 'LMT', name: 'Lockheed Martin Corporation', sector: 'Industrial', marketCap: 100000000000 },
  { symbol: 'RTX', name: 'Raytheon Technologies Corporation', sector: 'Industrial', marketCap: 120000000000 },
  { symbol: 'DE', name: 'Deere & Company', sector: 'Industrial', marketCap: 100000000000 },
  { symbol: 'MMM', name: '3M Company', sector: 'Industrial', marketCap: 60000000000 },

  // Communication Services
  { symbol: 'GOOG', name: 'Alphabet Inc. Class C', sector: 'Communication Services', marketCap: 1800000000000 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', marketCap: 800000000000 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', marketCap: 200000000000 },
  { symbol: 'DIS', name: 'Walt Disney Company', sector: 'Communication Services', marketCap: 200000000000 },
  { symbol: 'CMCSA', name: 'Comcast Corporation', sector: 'Communication Services', marketCap: 150000000000 },
  { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services', marketCap: 150000000000 },
  { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication Services', marketCap: 100000000000 },
  { symbol: 'CHTR', name: 'Charter Communications Inc.', sector: 'Communication Services', marketCap: 50000000000 },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', marketCap: 200000000000 },
  { symbol: 'TWTR', name: 'Twitter Inc.', sector: 'Communication Services', marketCap: 30000000000 },

  // Utilities
  { symbol: 'NEE', name: 'NextEra Energy Inc.', sector: 'Utilities', marketCap: 150000000000 },
  { symbol: 'DUK', name: 'Duke Energy Corporation', sector: 'Utilities', marketCap: 80000000000 },
  { symbol: 'SO', name: 'Southern Company', sector: 'Utilities', marketCap: 70000000000 },
  { symbol: 'D', name: 'Dominion Energy Inc.', sector: 'Utilities', marketCap: 60000000000 },
  { symbol: 'EXC', name: 'Exelon Corporation', sector: 'Utilities', marketCap: 40000000000 },
  { symbol: 'AEP', name: 'American Electric Power Company Inc.', sector: 'Utilities', marketCap: 50000000000 },
  { symbol: 'XEL', name: 'Xcel Energy Inc.', sector: 'Utilities', marketCap: 30000000000 },
  { symbol: 'WEC', name: 'WEC Energy Group Inc.', sector: 'Utilities', marketCap: 30000000000 },
  { symbol: 'ES', name: 'Eversource Energy', sector: 'Utilities', marketCap: 25000000000 },
  { symbol: 'PEG', name: 'Public Service Enterprise Group Inc.', sector: 'Utilities', marketCap: 30000000000 },

  // Real Estate
  { symbol: 'AMT', name: 'American Tower Corporation', sector: 'Real Estate', marketCap: 100000000000 },
  { symbol: 'PLD', name: 'Prologis Inc.', sector: 'Real Estate', marketCap: 80000000000 },
  { symbol: 'CCI', name: 'Crown Castle Inc.', sector: 'Real Estate', marketCap: 60000000000 },
  { symbol: 'EQIX', name: 'Equinix Inc.', sector: 'Real Estate', marketCap: 70000000000 },
  { symbol: 'PSA', name: 'Public Storage', sector: 'Real Estate', marketCap: 50000000000 },
  { symbol: 'WELL', name: 'Welltower Inc.', sector: 'Real Estate', marketCap: 30000000000 },
  { symbol: 'AVB', name: 'AvalonBay Communities Inc.', sector: 'Real Estate', marketCap: 25000000000 },
  { symbol: 'EQR', name: 'Equity Residential', sector: 'Real Estate', marketCap: 25000000000 },
  { symbol: 'MAA', name: 'Mid-America Apartment Communities Inc.', sector: 'Real Estate', marketCap: 20000000000 },
  { symbol: 'UDR', name: 'UDR Inc.', sector: 'Real Estate', marketCap: 15000000000 },

  // Materials
  { symbol: 'LIN', name: 'Linde plc', sector: 'Materials', marketCap: 200000000000 },
  { symbol: 'APD', name: 'Air Products and Chemicals Inc.', sector: 'Materials', marketCap: 60000000000 },
  { symbol: 'SHW', name: 'Sherwin-Williams Company', sector: 'Materials', marketCap: 60000000000 },
  { symbol: 'ECL', name: 'Ecolab Inc.', sector: 'Materials', marketCap: 50000000000 },
  { symbol: 'DD', name: 'DuPont de Nemours Inc.', sector: 'Materials', marketCap: 30000000000 },
  { symbol: 'DOW', name: 'Dow Inc.', sector: 'Materials', marketCap: 40000000000 },
  { symbol: 'PPG', name: 'PPG Industries Inc.', sector: 'Materials', marketCap: 30000000000 },
  { symbol: 'NEM', name: 'Newmont Corporation', sector: 'Materials', marketCap: 40000000000 },
  { symbol: 'FCX', name: 'Freeport-McMoRan Inc.', sector: 'Materials', marketCap: 50000000000 },
  { symbol: 'NUE', name: 'Nucor Corporation', sector: 'Materials', marketCap: 30000000000 }
];

export const getStocksBySector = (sector: string) => {
  return STOCKS.filter(stock => stock.sector === sector);
};

export const searchStocks = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return STOCKS.filter(stock => 
    stock.symbol.toLowerCase().includes(lowercaseQuery) ||
    stock.name.toLowerCase().includes(lowercaseQuery) ||
    stock.sector.toLowerCase().includes(lowercaseQuery)
  );
};
