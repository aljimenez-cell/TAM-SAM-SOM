import React, { useState, useEffect } from "react";
import { MarketInputs, CalculationResult, ChatMessage, SavedScenario } from "./types";
import { SCENARIO_EXAMPLES } from "./dataExamples";
import FormInputs from "./components/FormInputs";
import Dashboard from "./components/Dashboard";
import ChatbotWidget from "./components/ChatbotWidget";
import ScenarioHistory from "./components/ScenarioHistory";
import { HelpCircle, Sparkles, TrendingUp, ShieldCheck, Cpu, Database } from "lucide-react";

// Helper function to perform local TAM/SAM/SOM arithmetic
const calculateLocal = (inputs: MarketInputs): CalculationResult => {
  const buTam = inputs.tamTotalBuyers * inputs.averageTicket;
  const buSam = inputs.samTotalBuyers * inputs.averageTicket;
  const buSom = inputs.somTotalBuyers * inputs.averageTicket;

  const tdTam = inputs.macroMarketSize;
  const tdSam = inputs.macroMarketSize * (inputs.samPercentage / 100);
  const tdSom = tdSam * (inputs.somPercentage / 100);

  return {
    bottomUp: {
      tam: buTam,
      sam: buSam,
      som: buSom,
      tamFormula: `Compradores (${inputs.tamTotalBuyers.toLocaleString()}) × Ticket Anual ($${inputs.averageTicket.toLocaleString()})`,
      samFormula: `Compradores (${inputs.samTotalBuyers.toLocaleString()}) × Ticket Anual ($${inputs.averageTicket.toLocaleString()})`,
      somFormula: `Compradores (${inputs.somTotalBuyers.toLocaleString()}) × Ticket Anual ($${inputs.averageTicket.toLocaleString()})`,
    },
    topDown: {
      tam: tdTam,
      sam: tdSam,
      som: tdSom,
      tamFormula: `Mercado Macro de Referencia ($${tdTam.toLocaleString()})`,
      samFormula: `TAM Macro ($${tdTam.toLocaleString()}) × % Regional (${inputs.samPercentage}%)`,
      somFormula: `SAM Top-Down ($${tdSam.toLocaleString()}) × % de Captura (${inputs.somPercentage}%)`,
    },
    analysis: "", // Will be populated by Gemini or set to default fallback
  };
};

export default function App() {
  // 1. Initial State Settings with default pre-calculated metrics
  const initialInputs = SCENARIO_EXAMPLES[0].inputs;
  const initialResults = calculateLocal(initialInputs);
  initialResults.analysis = `**Diagnóstico de Viabilidad**: Excelente alineación. Tu SOM Bottom-Up de $1.8M USD anuales representa el 1.87% del SAM nacional. Es un objetivo prudente y conservador para una ronda de inversión Semilla (Seed), ya que no asume una dominancia irreal del mercado en el Año 1.

**Estrategia de Nicho (SOM)**: Prioriza la captación en distritos gastronómicos clave de Ciudad de México (Roma, Condesa, Polanco) y Monterrey (San Pedro). Validar la propuesta con restaurantes de ticket medio-alto antes de escalar a cadenas masivas.

**Levers de Escalamiento**: Para moverte del SOM al SAM, apalanca integraciones con agregadores de delivery locales y crea un canal SEO enfocado en "gestión de inventarios para restaurantes".`;

  const [inputs, setInputs] = useState<MarketInputs>(initialInputs);
  const [results, setResults] = useState<CalculationResult>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  // Scenario History State
  const [historyList, setHistoryList] = useState<SavedScenario[]>([]);

  // 2. Load scenarios and set greeting message on mount
  useEffect(() => {
    // Welcome message in chat
    const initialGreeting: ChatMessage = {
      id: "initial-welcome",
      sender: "bot",
      text: `¡Hola! Soy tu **Consultor de Estrategia y Mercado**.

He cargado los datos del escenario de ejemplo **"${initialInputs.businessName}"** (un software SaaS para restaurantes en México) para que explores el dashboard financiero de inmediato.

Puedes:
1. Modificar los números en el formulario de la izquierda.
2. Hacer clic en **"Calcular Métricas y Consultar IA"** para recalcular y generar un diagnóstico estratégico de Venture Capital.
3. Preguntarme directamente sobre cómo estimar tus compradores, qué fuentes gubernamentales consultar o qué nichos priorizar para tu negocio.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialGreeting]);

    // Load LocalStorage scenarios
    const raw = localStorage.getItem("tam_sam_som_scenarios");
    if (raw) {
      try {
        setHistoryList(JSON.parse(raw));
      } catch (e) {
        console.error("Error loading saved scenarios:", e);
      }
    }
  }, []);

  // 3. Calculator Core Submission - Local Math + VC Brief API request
  const handleCalculateAndAnalyze = async () => {
    setIsLoading(true);
    
    // First calculate local mathematical values immediately so the user sees updated charts instantly
    const updatedLocal = calculateLocal(inputs);
    setResults(updatedLocal);

    try {
      const res = await fetch("/api/analyze-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs }),
      });

      if (!res.ok) {
        throw new Error("La solicitud al servidor falló.");
      }

      const data = await res.json();
      if (data.analysis) {
        setResults((prev) => ({
          ...prev,
          analysis: data.analysis,
        }));

        // Optionally post a summary to the chatbot so the user has continuity
        const assistantNotification: ChatMessage = {
          id: crypto.randomUUID(),
          sender: "bot",
          text: `📊 **¡He recalculado tu mercado para "${inputs.businessName}"!**

He actualizado los gráficos interactivos en el panel central con el nuevo TAM, SAM y SOM. Además, generé un diagnóstico estratégico que puedes leer en la sección inferior del dashboard.

¿Deseas que busquemos juntos fuentes específicas de internet o censos para refinar el número de **${inputs.tamTotalBuyers.toLocaleString()}** compradores que ingresaste?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantNotification]);
      }
    } catch (err: any) {
      console.error("Error calculating VC brief:", err);
      // Fallback analysis if Gemini is offline or API key missing
      setResults((prev) => ({
        ...prev,
        analysis: `**Diagnóstico de Viabilidad (Cálculo Matemático)**: El TAM Bottom-Up resultante es de ${updatedLocal.bottomUp.tam.toLocaleString()} USD y tu SOM es de ${updatedLocal.bottomUp.som.toLocaleString()} USD.

*Nota: No se pudo conectar con el motor de IA para generar el brief extendido de Venture Capital. Por favor verifica que tu GEMINI_API_KEY esté correctamente configurada en la sección de Secretos.*`,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Chat Client message request to server with Google Search grounding
  const handleSendMessage = async (text: string) => {
    setIsChatLoading(true);
    
    // Pass current chat history mapped to limit size
    const historyPayload = messages.slice(-10).map(msg => ({
      sender: msg.sender,
      text: msg.text
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo conectar con el servidor.");
      }

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: data.groundingSources || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Error in chat:", err);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: "Lo siento, experimenté una interrupción al intentar procesar tu consulta. Por favor, asegúrate de que el servidor está encendido y tiene configurado un token válido en `GEMINI_API_KEY`.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 5. Scenario Persistence Handlers (LocalStorage)
  const handleSaveScenario = () => {
    const newScenario: SavedScenario = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }),
      inputs,
      results,
    };

    const updated = [newScenario, ...historyList];
    setHistoryList(updated);
    localStorage.setItem("tam_sam_som_scenarios", JSON.stringify(updated));

    // Notify user in chat
    const saveNotification: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "bot",
      text: `💾 **Escenario Guardado**: He guardado "${inputs.businessName}" con éxito en tu historial de este navegador. Podrás recargarlo cuando lo desees en la parte inferior de la pantalla.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, saveNotification]);
  };

  const handleDeleteScenario = (id: string) => {
    const filtered = historyList.filter((sc) => sc.id !== id);
    setHistoryList(filtered);
    localStorage.setItem("tam_sam_som_scenarios", JSON.stringify(filtered));
  };

  const handleLoadScenario = (saved: SavedScenario) => {
    setInputs(saved.inputs);
    setResults(saved.results);

    // Notify chat
    const loadNotification: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "bot",
      text: `📂 **Escenario Cargado**: Se cargaron exitosamente las métricas de **"${saved.inputs.businessName}"**. Todo el dashboard se ha sincronizado con sus valores históricos.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, loadNotification]);
  };

  const triggerAskAssistant = (promptText: string) => {
    setActivePrompt(promptText);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans" id="main-layout">
      {/* Visual Navigation Banner */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm" id="app-header">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase font-sans">
              MarketSize Pro
            </h1>
            <p className="text-[11px] text-slate-500 font-mono">Calculadora Cuantitativa TAM SAM SOM / MVP v1.2</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500" id="header-badges">
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-[11px]">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Venture-Capital Engine
          </span>
          <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 text-slate-700 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
            Consultor Activo
          </span>
        </div>
      </header>

      {/* Main Container Bento Layout */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full" id="main-grid-container">
        
        {/* Onboarding Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-50/50 via-white to-emerald-50/30 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm" id="onboarding-hero">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-indigo-100 font-mono inline-block">
              MVP Consultor Estratégico
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              Dimensiona el Potencial de tu SaaS o Negocio
            </h2>
            <p className="text-xs text-slate-600 max-w-[650px] leading-relaxed">
              Mide cuantitativamente tu mercado total (**TAM**), direccionable (**SAM**) y el nicho que capturarás a corto plazo (**SOM**) mediante dos metodologías robustas. Cuenta con el apoyo permanente de un agente de IA con búsquedas web en tiempo real para verificar censos y volúmenes de demanda.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-2xl shrink-0 shadow-sm" id="hero-mini-stats">
            <div className="text-center px-4 border-r border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">TAM</span>
              <span className="text-lg font-bold text-slate-800 font-mono">100%</span>
            </div>
            <div className="text-center px-4 border-r border-slate-200">
              <span className="text-[10px] text-emerald-600 font-bold block uppercase font-mono">SAM</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{(results.bottomUp.sam / results.bottomUp.tam * 100 || 0).toFixed(1)}%</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[10px] text-indigo-600 font-bold block uppercase font-mono">SOM</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{(results.bottomUp.som / results.bottomUp.sam * 100 || 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Dynamic Responsive Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-columns-grid">
          {/* Column 1: Config Form & Saved Scenarios (Takes 5 spans on lg) */}
          <div className="lg:col-span-5 space-y-6" id="col-form-history">
            <FormInputs
              inputs={inputs}
              setInputs={setInputs}
              onCalculate={handleCalculateAndAnalyze}
              isLoading={isLoading}
              onAskAssistant={triggerAskAssistant}
            />

            <ScenarioHistory
              historyList={historyList}
              onLoadScenario={handleLoadScenario}
              onDeleteScenario={handleDeleteScenario}
              onSaveCurrent={handleSaveScenario}
              canSave={!!results.bottomUp.tam}
            />
          </div>

          {/* Column 2: Dashboard Results & Visuals (Takes 4 spans on lg) */}
          <div className="lg:col-span-4" id="col-charts">
            <Dashboard inputs={inputs} results={results} />
          </div>

          {/* Column 3: AI Chatbot Assistant Widget (Takes 3 spans on lg) */}
          <div className="lg:col-span-3" id="col-chatbot">
            <div className="sticky top-20" id="chatbot-sticky-box">
              <ChatbotWidget
                messages={messages}
                setMessages={setMessages}
                onSendMessage={handleSendMessage}
                isChatLoading={isChatLoading}
                activePrompt={activePrompt}
                clearActivePrompt={() => setActivePrompt(null)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Humble, visually polished page footer without system coordinates */}
      <footer className="border-t border-slate-200 bg-white text-slate-400 py-6 text-center text-xs mt-auto font-sans" id="app-footer">
        <p>
          Calculadora de Estrategia TAM SAM SOM y Consultor de Negocios de Alta Fidelidad.
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Utilizando el SDK oficial de Google GenAI con Grounding en tiempo real para mayor veracidad.
        </p>
      </footer>
    </div>
  );
}
