import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with named parameters & telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// SYSTEM INSTRUCTION FOR BUSINESS CONSULTANT
const CHAT_SYSTEM_INSTRUCTION = `Eres el "Asistente Consultor de Mercado", un consultor de estrategia empresarial y experto en SaaS/Negocios a nivel mundial.
Tu objetivo principal es ayudar al usuario a comprender, estructurar y buscar datos cuantitativos reales para estimar su TAM (Total Addressable Market), SAM (Serviceable Addressable Market) y SOM (Serviceable Obtainable Market) de manera precisa.

DIRECTRICES CLAVE:
1. COMUNICACIÓN: Comunícate siempre en un español claro, profesional, empático y estructurado en Markdown. Evita tecnicismos sin explicación.
2. ENFOQUE BOTTOM-UP: Fomenta la metodología Bottom-Up (Nº de clientes potenciales × Precio promedio o ACV), explicando que es la más valorada por inversores y la más exacta.
3. GUÍA PASO A PASO: Si el usuario no sabe qué datos ingresar (como número de compradores potenciales), ayúdale a estimarlo. Hazle preguntas sobre su nicho.
4. RECOMENDACIÓN DE FUENTES REALES: Sugiere siempre fuentes de datos específicas y herramientas prácticas:
   - Reportes macro: Statista, Gartner, McKinsey, IDC, Crunchbase.
   - Datos demográficos y corporativos: LinkedIn Sales Navigator (para segmentar B2B por tamaño), censos nacionales (INEGI en México, DANE en Colombia, INDEC en Argentina, Eurostat).
   - Volumen de búsquedas e intención de compra: Herramientas SEO como SEMrush, Ahrefs, Google Keyword Planner o Google Trends para calcular la demanda existente de su solución.
5. DESCUBRIMIENTO DE NICHOS: Analiza su idea de negocio y sugiérele 2 o 3 "mercados potenciales" o nichos adyacentes de alta conversión para expandir su SAM o SOM que tal vez no haya considerado.
6. RESPUESTAS ACCIONABLES: Da ejemplos numéricos concretos de cómo formular la multiplicación para su caso particular.

Aprovecha la herramienta de Google Search integrada para buscar datos del mercado actual, cifras reales de la industria del usuario y reportes recientes si el usuario hace preguntas de estimación concretas.`;

// 1. API: Chatbot Assistant with Google Search Grounding
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Falta configurar la variable GEMINI_API_KEY en la plataforma.",
      });
    }

    // Map history to Gemini format (user -> user, bot -> model)
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Append current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No se pudo generar una respuesta.";

    // Extract search grounding sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title || "Fuente Web",
            uri: chunk.web.uri,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json({
      text,
      groundingSources,
    });
  } catch (error: any) {
    console.error("Error en /api/chat:", error);
    res.status(500).json({
      error: "Ocurrió un error al consultar al asistente estratégico.",
      details: error.message,
    });
  }
});

// 2. API: Scenario Strategic AI Analysis
app.post("/api/analyze-scenario", async (req, res) => {
  try {
    const { inputs } = req.body;

    if (!inputs) {
      return res.status(400).json({ error: "Los datos del escenario son requeridos." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Falta configurar la variable GEMINI_API_KEY.",
      });
    }

    // Perform Bottom-Up calculations on the server to double-check or format
    const buTam = inputs.tamTotalBuyers * inputs.averageTicket;
    const buSam = inputs.samTotalBuyers * inputs.averageTicket;
    const buSom = inputs.somTotalBuyers * inputs.averageTicket;

    const tdTam = inputs.macroMarketSize;
    const tdSam = inputs.macroMarketSize * (inputs.samPercentage / 100);
    const tdSom = tdSam * (inputs.somPercentage / 100);

    const analysisPrompt = `Analiza estratégicamente el siguiente escenario de negocio para estimar su viabilidad de mercado y sugiere recomendaciones de crecimiento.

DATOS DEL NEGOCIO:
- Nombre: ${inputs.businessName}
- Industria: ${inputs.industry}
- Modelo de Monetización: ${inputs.monetizationModel}
- Ticket Promedio / ACV: $${inputs.averageTicket.toLocaleString()} USD anuales
- Región Objetivo: ${inputs.geoRegion}

METRICAS CALCULADAS:
- METODOLOGÍA BOTTOM-UP (Enfoque de precisión):
  * TAM: $${buTam.toLocaleString()} USD (basado en ${inputs.tamTotalBuyers.toLocaleString()} compradores potenciales)
  * SAM: $${buSam.toLocaleString()} USD (basado en ${inputs.samTotalBuyers.toLocaleString()} compradores alcanzables)
  * SOM: $${buSom.toLocaleString()} USD (basado en ${inputs.somTotalBuyers.toLocaleString()} compradores objetivo en el corto plazo)

- METODOLOGÍA TOP-DOWN (Enfoque macro):
  * TAM Macro de Referencia: $${tdTam.toLocaleString()} USD
  * SAM Estimado (${inputs.samPercentage}%): $${tdSam.toLocaleString()} USD
  * SOM Estimado (${inputs.somPercentage}% de SAM): $${tdSom.toLocaleString()} USD

Por favor, proporciona un análisis estructurado en exactamente 3 secciones cortas, redactado en español profesional, persuasivo y elegante para un pitch ante inversores:
1. **Diagnóstico de Viabilidad**: Evalúa si el SOM es realista y suficiente para arrancar la operación dada la geografía y el ticket. Compara si hay coherencia entre Bottom-Up y Top-Down.
2. **Estrategia de Nicho (SOM)**: Sugiere 1 o 2 micro-segmentos de mercado específicos de alta prioridad en ${inputs.geoRegion} para capturar los primeros clientes más rápido.
3. **Levers de Escalamiento (SAM a TAM)**: Brinda 2 acciones concretas para expandir el negocio de SOM a SAM en los siguientes 2-3 años (ej. alianzas, canales SEO, nuevos segmentos).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: analysisPrompt,
      config: {
        systemInstruction: "Eres un analista de capital de riesgo (Venture Capitalist) y consultor de SaaS. Ofreces consejos ultra-estratégicos, claros, y concisos en español.",
      },
    });

    res.json({
      analysis: response.text || "No se pudo generar el análisis estratégico.",
    });
  } catch (error: any) {
    console.error("Error en /api/analyze-scenario:", error);
    res.status(500).json({
      error: "Error al generar el análisis estratégico del escenario.",
      details: error.message,
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Starting in DEVELOPMENT mode with Vite Middleware.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Starting in PRODUCTION mode serving built files.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
