import { MarketInputs } from "./types";

export interface ScenarioExample {
  label: string;
  inputs: MarketInputs;
}

export const SCENARIO_EXAMPLES: ScenarioExample[] = [
  {
    label: "SaaS B2B para Restaurantes (México)",
    inputs: {
      businessName: "RestoOptimiza",
      industry: "Tecnología Alimentaria / Restauración",
      monetizationModel: "B2B SaaS (Suscripción Mensual)",
      averageTicket: 1200, // $1,200 USD anuales ($100/mes)
      geoRegion: "México",
      
      // Bottom-Up
      tamTotalBuyers: 650000, // Total de establecimientos de comida en México (INEGI)
      samTotalBuyers: 80000,  // Restaurantes formalizados con conexión a internet en ciudades medianas/grandes
      somTotalBuyers: 1500,   // Meta de captación para los primeros 3 años (1.8% del SAM)

      // Top-Down
      macroMarketSize: 12000000000, // Mercado global de software para restaurantes: $12B USD
      samPercentage: 1.5,           // Latinoamérica representa el 5%, México es el 30% de eso -> 1.5% del global
      somPercentage: 1.8            // Cuota objetivo de penetración en el SAM nacional
    }
  },
  {
    label: "App B2C de Fitness y Salud (España)",
    inputs: {
      businessName: "FitMind",
      industry: "Salud & Bienestar Digital",
      monetizationModel: "B2C Suscripción Móvil (Premium)",
      averageTicket: 60, // $60 USD anuales ($5/mes)
      geoRegion: "España",
      
      // Bottom-Up
      tamTotalBuyers: 18000000, // Adultos de 18-50 años con smartphone en España
      samTotalBuyers: 2200000,  // Personas en España que pagan activamente suscripciones de gimnasios o apps deportivas
      somTotalBuyers: 45000,    // Meta realista de suscriptores de pago de FitMind en el Año 2

      // Top-Down
      macroMarketSize: 5600000000, // Mercado global de mHealth/Fitness apps: $5.6B USD
      samPercentage: 2.2,          // España representa aprox. el 2.2% del consumo europeo/global de bienestar digital
      somPercentage: 2.0           // Captura del 2% del mercado direccionable en España
    }
  },
  {
    label: "E-commerce de Moda Sostenible (LatAm)",
    inputs: {
      businessName: "EcoVestir",
      industry: "Comercio Electrónico / Moda",
      monetizationModel: "Venta Directa D2C (Ticket Promedio)",
      averageTicket: 85, // $85 USD por cliente al año
      geoRegion: "Latinoamérica (Colombia, Chile, Perú)",
      
      // Bottom-Up
      tamTotalBuyers: 45000000, // Compradores activos de ropa online en la región objetivo
      samTotalBuyers: 3500000,  // Consumidores conscientes interesados en sostenibilidad y productos Eco-friendly
      somTotalBuyers: 60000,    // Clientes únicos estimados para el primer bienio de operaciones

      // Top-Down
      macroMarketSize: 24000000000, // Mercado global de moda sostenible: $24B USD
      samPercentage: 0.8,           // LatAm representa el 0.8% de la demanda mundial de moda ecológica premium
      somPercentage: 1.7            // Cuota del 1.7% de ese nicho en los países de lanzamiento
    }
  }
];
