export interface MarketInputs {
  businessName: string;
  industry: string;
  monetizationModel: string;
  averageTicket: number; // ACV or Ticket Promedio
  geoRegion: string;
  
  // Bottom-Up calculations (Primary)
  tamTotalBuyers: number;
  samTotalBuyers: number;
  somTotalBuyers: number;

  // Top-Down calculations
  macroMarketSize: number; // in monetary value (e.g. $100,000,000)
  samPercentage: number;   // e.g. 5 for 5%
  somPercentage: number;   // e.g. 1 for 1%
}

export interface CalculationResult {
  bottomUp: {
    tam: number;
    sam: number;
    som: number;
    tamFormula: string;
    samFormula: string;
    somFormula: string;
  };
  topDown: {
    tam: number;
    sam: number;
    som: number;
    tamFormula: string;
    samFormula: string;
    somFormula: string;
  };
  analysis: string; // Brief AI summary generated on save/calculate
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  groundingSources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface SavedScenario {
  id: string;
  date: string;
  inputs: MarketInputs;
  results: CalculationResult;
}
