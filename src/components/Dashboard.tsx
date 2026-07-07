import React, { useState } from "react";
import { MarketInputs, CalculationResult } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Target, Shield, HelpCircle, Layers, BookOpen, AlertCircle, FileText } from "lucide-react";

interface DashboardProps {
  inputs: MarketInputs;
  results: CalculationResult;
}

export default function Dashboard({ inputs, results }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"bottom-up" | "top-down">("bottom-up");
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);

  const { bottomUp, topDown, analysis } = results;

  // Format currencies helper
  const formatUSD = (val: number) => {
    if (val >= 1e9) {
      return `$${(val / 1e9).toFixed(2)}B USD`;
    }
    if (val >= 1e6) {
      return `$${(val / 1e6).toFixed(2)}M USD`;
    }
    return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`;
  };

  // Percentages calculations
  const samOfTamPctBu = ((bottomUp.sam / bottomUp.tam) * 100) || 0;
  const somOfSamPctBu = ((bottomUp.som / bottomUp.sam) * 100) || 0;
  const somOfTamPctBu = ((bottomUp.som / bottomUp.tam) * 100) || 0;

  const samOfTamPctTd = ((topDown.sam / topDown.tam) * 100) || 0;
  const somOfSamPctTd = ((topDown.som / topDown.sam) * 100) || 0;
  const somOfTamPctTd = ((topDown.som / topDown.tam) * 100) || 0;

  const activeMetrics = activeTab === "bottom-up" ? bottomUp : topDown;
  const activeSamOfTam = activeTab === "bottom-up" ? samOfTamPctBu : samOfTamPctTd;
  const activeSomOfSam = activeTab === "bottom-up" ? somOfSamPctBu : somOfSamPctTd;

  // Chart Data preparation
  const chartData = [
    {
      name: "TAM (Total)",
      "Bottom-Up (Precisión)": bottomUp.tam,
      "Top-Down (Macro)": topDown.tam,
    },
    {
      name: "SAM (Direccionable)",
      "Bottom-Up (Precisión)": bottomUp.sam,
      "Top-Down (Macro)": topDown.sam,
    },
    {
      name: "SOM (Obtenible)",
      "Bottom-Up (Precisión)": bottomUp.som,
      "Top-Down (Macro)": topDown.som,
    },
  ];

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl font-sans text-xs">
          <p className="font-semibold text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-mono py-0.5">
              {entry.name}: {formatUSD(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* 1. Header Metrics Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="dashboard-header-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 tracking-tight">
              <Layers className="text-indigo-600 w-5 h-5" />
              RESULTADOS DE MERCADO
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Compara las dos metodologías y explora el análisis estratégico de viabilidad para <span className="text-indigo-600 font-semibold">{inputs.geoRegion}</span>.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-center" id="tabs-container">
            <button
              onClick={() => setActiveTab("bottom-up")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold font-sans transition cursor-pointer ${
                activeTab === "bottom-up"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              id="tab-bottom-up"
            >
              Bottom-Up (Primario)
            </button>
            <button
              onClick={() => setActiveTab("top-down")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold font-sans transition cursor-pointer ${
                activeTab === "top-down"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              id="tab-top-down"
            >
              Top-Down (Macro)
            </button>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6" id="metric-cards">
          {/* TAM */}
          <div className="bg-slate-900 text-white border border-transparent rounded-2xl p-5 hover:scale-[1.01] transition-all relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase font-mono">
                TAM (TOTAL)
              </span>
              <span className="bg-white/10 text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-white/20">
                MERCADO TOTAL
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter font-mono">
                {formatUSD(activeMetrics.tam)}
              </span>
              <p className="text-[11px] text-slate-300 mt-3 flex items-start gap-1 font-sans leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                {activeTab === "bottom-up"
                  ? `Facturación anual si capturas el 100% de los ${inputs.tamTotalBuyers.toLocaleString()} compradores.`
                  : `Ingreso global de la industria (${formatUSD(inputs.macroMarketSize)}) usado como techo de mercado.`}
              </p>
            </div>
          </div>

          {/* SAM */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:scale-[1.01] transition-all relative overflow-hidden group shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                SAM (DIRECCIONABLE)
              </span>
              <span className="bg-slate-100 text-slate-600 text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-slate-200">
                MERCADO SERVIDO
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tighter font-mono">
                {formatUSD(activeMetrics.sam)}
              </span>
              <div className="text-[11px] text-slate-500 mt-3 flex flex-col gap-1.5 font-sans">
                <span className="flex items-center gap-1 font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  {activeSamOfTam.toFixed(1)}% del TAM total
                </span>
                <span className="leading-relaxed">
                  {activeTab === "bottom-up"
                    ? `Segmento de ${inputs.samTotalBuyers.toLocaleString()} compradores accesibles en ${inputs.geoRegion}.`
                    : `Región geográfica estimada en ${inputs.samPercentage}% del total mundial.`}
                </span>
              </div>
            </div>
          </div>

          {/* SOM */}
          <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 hover:scale-[1.01] transition-all relative overflow-hidden group shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase font-mono">
                SOM (OBTENIBLE)
              </span>
              <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-indigo-200">
                META CORTO PLAZO
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl md:text-3xl font-extrabold text-indigo-700 tracking-tighter font-mono">
                {formatUSD(activeMetrics.som)}
              </span>
              <div className="text-[11px] text-slate-600 mt-3 flex flex-col gap-1.5 font-sans">
                <span className="flex items-center gap-1 font-bold text-indigo-600">
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  {activeSomOfSam.toFixed(1)}% de tu SAM direccionable
                </span>
                <span className="leading-relaxed">
                  {activeTab === "bottom-up"
                    ? `Foco a corto plazo: ${inputs.somTotalBuyers.toLocaleString()} clientes meta en los primeros años.`
                    : `Captura prevista del ${inputs.somPercentage}% de tu mercado objetivo.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Layout: Interactive concentric diagram + Recharts comparative graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-graphics">
        {/* Left Card: Dynamic Concentric SVG Diagram */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="concentric-diagram-card">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-indigo-600" />
              PROPORCIÓN CONCÉNTRICA
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 font-sans">
              Pasa el cursor sobre los círculos concéntricos para visualizar cómo se encaja tu SOM dentro del SAM y TAM.
            </p>
          </div>

          {/* Interactive Concentric Circles in SVG */}
          <div className="flex items-center justify-center p-4 relative h-64" id="concentric-svg-box">
            <svg viewBox="0 0 200 200" className="w-full max-w-[220px] h-auto drop-shadow-sm select-none">
              {/* Outer circle: TAM */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="#f1f5f9"
                fillOpacity={hoveredCircle === "tam" ? "0.9" : "0.5"}
                stroke="#cbd5e1"
                strokeWidth={hoveredCircle === "tam" ? "2.5" : "1"}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredCircle("tam")}
                onMouseLeave={() => setHoveredCircle(null)}
              />
              
              {/* Middle circle: SAM */}
              <circle
                cx="100"
                cy="100"
                r="65"
                fill="#e2e8f0"
                fillOpacity={hoveredCircle === "sam" ? "0.95" : "0.65"}
                stroke="#94a3b8"
                strokeWidth={hoveredCircle === "sam" ? "2.5" : "1"}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredCircle("sam")}
                onMouseLeave={() => setHoveredCircle(null)}
              />

              {/* Inner circle: SOM */}
              <circle
                cx="100"
                cy="100"
                r="35"
                fill="#4f46e5"
                fillOpacity={hoveredCircle === "som" ? "1.0" : "0.9"}
                stroke="#4338ca"
                strokeWidth={hoveredCircle === "som" ? "2" : "1"}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredCircle("som")}
                onMouseLeave={() => setHoveredCircle(null)}
              />

              {/* Central Target Dot */}
              <circle cx="100" cy="100" r="2.5" fill="#ffffff" />
            </svg>

            {/* Display Floating Tooltip on center/side */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white text-[11px] py-1.5 px-3 rounded-full text-center min-w-[200px] shadow-md font-mono">
              {hoveredCircle === "tam" && (
                <span>
                  <strong>TAM:</strong> {formatUSD(activeMetrics.tam)} (100%)
                </span>
              )}
              {hoveredCircle === "sam" && (
                <span className="text-emerald-400">
                  <strong>SAM:</strong> {formatUSD(activeMetrics.sam)} ({activeSamOfTam.toFixed(1)}% TAM)
                </span>
              )}
              {hoveredCircle === "som" && (
                <span className="text-indigo-300">
                  <strong>SOM:</strong> {formatUSD(activeMetrics.som)} ({activeSomOfSam.toFixed(1)}% SAM)
                </span>
              )}
              {!hoveredCircle && (
                <span className="text-slate-300 text-[10px] uppercase font-bold tracking-wider">Pasa el cursor para explorar</span>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-[11px] text-slate-500 font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> TAM Total
              </span>
              <span>100%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> SAM Direccionable
              </span>
              <span>{activeSamOfTam.toFixed(1)}% del TAM</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> SOM Meta
              </span>
              <span>
                {activeSomOfSam.toFixed(1)}% del SAM ({(activeMetrics.som / activeMetrics.tam * 100 || 0).toFixed(3)}% TAM)
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Comparative Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="comparative-barchart-card">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              COMPARATIVA METODOLÓGICA
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 font-sans">
              Contraste de valores. El enfoque Bottom-Up suele ser más preciso al apoyarse en tus operaciones reales.
            </p>
          </div>

          {/* Recharts Container */}
          <div className="h-64 w-full" id="bar-chart-responsive">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) => {
                    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
                    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
                    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
                    return `$${val}`;
                  }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", fontFamily: "sans-serif", paddingTop: "10px" }}
                />
                <Bar dataKey="Bottom-Up (Precisión)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Top-Down (Macro)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-500 mt-2 text-center font-sans">
            💡 <strong>Sugerencia de Pitch:</strong> Si los valores del Bottom-Up son menores que los del Top-Down, utilízalo como un argumento de realismo y rigurosidad operativa ante fondos de Venture Capital.
          </div>
        </div>
      </div>

      {/* 3. Formulas Breakdown Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="formulas-breakdown-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          DESGLOSE DE FÓRMULAS MATEMÁTICAS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="formulas-grid">
          {/* Bottom-Up Formulas */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide font-sans flex items-center gap-1.5">
              Fórmula Bottom-Up (Precio × Volumen)
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 font-mono">
              <div className="p-2.5 bg-white rounded border border-slate-200/80 shadow-2xs">
                <p className="text-slate-400 font-sans font-medium mb-1 text-[11px] uppercase">TAM Bottom-Up:</p>
                <span className="text-[11px]">Nº Compradores ({inputs.tamTotalBuyers.toLocaleString()}) × Ticket (${inputs.averageTicket.toLocaleString()} USD)</span>
                <p className="text-emerald-600 font-bold mt-1 text-[13px]">= {formatUSD(bottomUp.tam)}</p>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200/80 shadow-2xs">
                <p className="text-slate-400 font-sans font-medium mb-1 text-[11px] uppercase">SAM Bottom-Up:</p>
                <span className="text-[11px]">Compradores Direccionables ({inputs.samTotalBuyers.toLocaleString()}) × Ticket (${inputs.averageTicket.toLocaleString()} USD)</span>
                <p className="text-emerald-600 font-bold mt-1 text-[13px]">= {formatUSD(bottomUp.sam)}</p>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200/80 shadow-2xs">
                <p className="text-slate-400 font-sans font-medium mb-1 text-[11px] uppercase">SOM Bottom-Up:</p>
                <span className="text-[11px]">Clientes Meta ({inputs.somTotalBuyers.toLocaleString()}) × Ticket (${inputs.averageTicket.toLocaleString()} USD)</span>
                <p className="text-emerald-600 font-bold mt-1 text-[13px]">= {formatUSD(bottomUp.som)}</p>
              </div>
            </div>
          </div>

          {/* Top-Down Formulas */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide font-sans flex items-center gap-1.5">
              Fórmula Top-Down (Porcentajes de Mercado)
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 font-mono">
              <div className="p-2.5 bg-white rounded border border-slate-200/80 shadow-2xs">
                <p className="text-slate-400 font-sans font-medium mb-1 text-[11px] uppercase">TAM Top-Down:</p>
                <span className="text-[11px]">Tamaño del Mercado de Referencia</span>
                <p className="text-indigo-600 font-bold mt-1 text-[13px]">= {formatUSD(topDown.tam)}</p>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200/80 shadow-2xs">
                <p className="text-slate-400 font-sans font-medium mb-1 text-[11px] uppercase">SAM Top-Down:</p>
                <span className="text-[11px]">TAM Macro (${formatUSD(inputs.macroMarketSize)}) × % Regional ({inputs.samPercentage}%)</span>
                <p className="text-indigo-600 font-bold mt-1 text-[13px]">= {formatUSD(topDown.sam)}</p>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200/80 shadow-2xs">
                <p className="text-slate-400 font-sans font-medium mb-1 text-[11px] uppercase">SOM Top-Down:</p>
                <span className="text-[11px]">SAM Top-Down (${formatUSD(topDown.sam)}) × % de Captura ({inputs.somPercentage}%)</span>
                <p className="text-indigo-600 font-bold mt-1 text-[13px]">= {formatUSD(topDown.som)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Strategic AI Analysis from VC Consultant */}
      {analysis && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden" id="ai-strategic-analysis-card">
          {/* Subtle design accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-indigo-600" />
            DIAGNÓSTICO DE VIABILIDAD Y ESTRATEGIA (VC AI)
          </h3>

          <div className="prose prose-sm max-w-none text-slate-600 space-y-4 font-sans" id="analysis-content">
            {analysis.split("\n\n").map((paragraph, idx) => {
              // Highlight markdown headers
              if (paragraph.startsWith("1. **") || paragraph.startsWith("2. **") || paragraph.startsWith("3. **")) {
                const headerText = paragraph.match(/\*\*(.*?)\*\*/)?.[1] || "";
                const contentText = paragraph.replace(/^[0-9]+\.\s\*\*.*?\*\*:\s?/, "").replace(/^[0-9]+\.\s\*\*.*?\*\*\s?/, "");
                
                let icon = <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />;
                if (idx === 1) icon = <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
                if (idx === 2) icon = <Layers className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />;

                return (
                  <div key={idx} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex gap-3 shadow-2xs hover:scale-[1.002] transition-all">
                    {icon}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 font-sans">{headerText}</h4>
                      <p className="text-xs leading-relaxed text-slate-600">{contentText}</p>
                    </div>
                  </div>
                );
              }

              // Standard paragraphs
              return (
                <p key={idx} className="text-xs leading-relaxed text-slate-500 px-1 font-sans">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
