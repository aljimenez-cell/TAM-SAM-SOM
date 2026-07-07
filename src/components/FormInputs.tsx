import React from "react";
import { MarketInputs } from "../types";
import { SCENARIO_EXAMPLES } from "../dataExamples";
import { HelpCircle, Calculator, Sparkles, Send, RefreshCw, Award } from "lucide-react";

interface FormInputsProps {
  inputs: MarketInputs;
  setInputs: React.Dispatch<React.SetStateAction<MarketInputs>>;
  onCalculate: () => void;
  isLoading: boolean;
  onAskAssistant: (promptText: string) => void;
}

export default function FormInputs({
  inputs,
  setInputs,
  onCalculate,
  isLoading,
  onAskAssistant,
}: FormInputsProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = [
      "averageTicket",
      "tamTotalBuyers",
      "samTotalBuyers",
      "somTotalBuyers",
      "macroMarketSize",
      "samPercentage",
      "somPercentage",
    ].includes(name);

    setInputs((prev) => ({
      ...prev,
      [name]: isNumber ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handlePreload = (example: typeof SCENARIO_EXAMPLES[0]) => {
    setInputs(example.inputs);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 text-slate-700" id="form-container">
      {/* Header & Preloads */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6" id="form-header">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 font-sans tracking-tight">
            <Calculator className="text-indigo-600 w-5 h-5" />
            CONFIGURACIÓN DE NEGOCIO
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Define tu propuesta de valor y las variables del mercado objetivo.
          </p>
        </div>
        
        {/* Presets dropdown */}
        <div className="flex items-center gap-2 text-xs" id="preload-section">
          <span className="text-slate-400 font-mono text-[11px] font-semibold uppercase tracking-wider">Ejemplos SaaS/B2C:</span>
          <select
            id="preset-selector"
            className="bg-slate-50 text-xs text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer font-medium"
            onChange={(e) => {
              const selectedIdx = Number(e.target.value);
              if (!isNaN(selectedIdx) && SCENARIO_EXAMPLES[selectedIdx]) {
                handlePreload(SCENARIO_EXAMPLES[selectedIdx]);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>-- Selecciona un ejemplo --</option>
            {SCENARIO_EXAMPLES.map((ex, idx) => (
              <option key={idx} value={idx}>
                {ex.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onCalculate(); }} className="space-y-6" id="market-form">
        {/* Section 1: General Business Data */}
        <div className="space-y-4" id="section-general">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono border-l-2 border-indigo-600 pl-2">
            1. Perfil del Negocio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-business-name" className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                Nombre de la Idea / Empresa
              </label>
              <input
                type="text"
                id="input-business-name"
                name="businessName"
                value={inputs.businessName}
                onChange={handleChange}
                placeholder="Ej. RestoOptimiza"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="input-industry" className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                Industria / Sector
              </label>
              <input
                type="text"
                id="input-industry"
                name="industry"
                value={inputs.industry}
                onChange={handleChange}
                placeholder="Ej. FoodTech, EdTech, FinTech"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="input-monetization" className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                Modelo de Monetización
              </label>
              <select
                id="input-monetization"
                name="monetizationModel"
                value={inputs.monetizationModel}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
                required
              >
                <option value="B2B SaaS (Suscripción Mensual)">B2B SaaS (Suscripción Anual/Mensual)</option>
                <option value="B2C Suscripción Móvil (Premium)">B2C Suscripción (Mobile App / Web)</option>
                <option value="Venta Directa D2C (Ticket Promedio)">Venta Directa D2C / E-commerce</option>
                <option value="Marketplace (Comisión por Transacción)">Marketplace (Comisión / Take Rate)</option>
                <option value="Freemium / Licencias tradicionales">Licencias Corporativas / Enterprise</option>
                <option value="Transaccional / Procesamiento de pagos">Transaccional / API Call Billing</option>
              </select>
            </div>

            <div>
              <label htmlFor="input-geo" className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                Región Geográfica Objetivo
              </label>
              <input
                type="text"
                id="input-geo"
                name="geoRegion"
                value={inputs.geoRegion}
                onChange={handleChange}
                placeholder="Ej. México, Latinoamérica, España"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-ticket" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Ticket Promedio Anual (ACV) en USD
                </label>
                <button
                  type="button"
                  onClick={() => onAskAssistant(`¿Cómo puedo calcular el valor anual del contrato (ACV) o el Ticket Promedio anual para un modelo de monetización "${inputs.monetizationModel}"?`)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-mono transition font-bold"
                >
                  <Sparkles className="w-3 h-3" /> ¿Cómo calcular este valor?
                </button>
              </div>
              <div className="relative rounded shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="input-ticket"
                  name="averageTicket"
                  value={inputs.averageTicket}
                  onChange={handleChange}
                  placeholder="Ej. 1200"
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-16 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium font-mono"
                  min="0"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-xs font-mono">USD / año</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Es la cantidad promedio que un cliente te paga al año. Si cobras $100/mes, tu Ticket Anual es de $1,200.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Bottom-Up Quantitative Variables */}
        <div className="space-y-4 border-t border-slate-100 pt-5" id="section-bottom-up">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono border-l-2 border-emerald-600 pl-2">
              2. Metodología Bottom-Up (Precisión Prioritaria)
            </h3>
            <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-emerald-100">
              RECOMENDADO
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Estima el tamaño del mercado multiplicando compradores reales por el ticket. Es el método más riguroso.
          </p>

          <div className="space-y-4">
            {/* TAM BUYERS */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-tam-buyers" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  TAM: Compradores Totales en tu industria (Región)
                </label>
                <button
                  type="button"
                  onClick={() => onAskAssistant(`Necesito fuentes y datos para estimar el total de compradores (TAM) para una empresa de "${inputs.industry}" en la región de "${inputs.geoRegion}".`)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-mono transition font-bold"
                >
                  <Sparkles className="w-3 h-3" /> Buscar volumen
                </button>
              </div>
              <input
                type="number"
                id="input-tam-buyers"
                name="tamTotalBuyers"
                value={inputs.tamTotalBuyers}
                onChange={handleChange}
                placeholder="Ej. 650000"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                min="0"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ejemplo B2B: Total de restaurantes registrados. Ejemplo B2C: Población objetivo de 18 a 50 años.
              </p>
            </div>

            {/* SAM BUYERS */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-sam-buyers" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  SAM: Compradores que puedes Servir (Accesibles)
                </label>
                <button
                  type="button"
                  onClick={() => onAskAssistant(`¿Cómo puedo filtrar mi TAM de ${inputs.tamTotalBuyers.toLocaleString()} compradores para obtener el SAM de mi negocio de "${inputs.businessName}"? Dame sugerencias de segmentación.`)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-mono transition font-bold"
                >
                  <Sparkles className="w-3 h-3" /> ¿Cómo filtrar?
                </button>
              </div>
              <input
                type="number"
                id="input-sam-buyers"
                name="samTotalBuyers"
                value={inputs.samTotalBuyers}
                onChange={handleChange}
                placeholder="Ej. 80000"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                min="0"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                El segmento del TAM que tiene internet, usa software o está digitalizado.
              </p>
            </div>

            {/* SOM BUYERS */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-som-buyers" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  SOM: Compradores a capturar en Años 1-3
                </label>
                <button
                  type="button"
                  onClick={() => onAskAssistant(`Teniendo un SAM de ${inputs.samTotalBuyers.toLocaleString()} compradores, ¿qué meta de SOM o tasa de captación anual realista me sugerirías para el Año 1 a 3? Mi modelo es ${inputs.monetizationModel}.`)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-mono transition font-bold"
                >
                  <Sparkles className="w-3 h-3" /> Evaluar meta SOM
                </button>
              </div>
              <input
                type="number"
                id="input-som-buyers"
                name="somTotalBuyers"
                value={inputs.somTotalBuyers}
                onChange={handleChange}
                placeholder="Ej. 1500"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                min="0"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tu meta de captación inicial basada en tu capacidad operativa y comercial.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Top-Down Quantitative Variables */}
        <div className="space-y-4 border-t border-slate-100 pt-5" id="section-top-down">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 font-mono border-l-2 border-cyan-600 pl-2">
              3. Metodología Top-Down (Mercado Macro)
            </h3>
            <span className="bg-cyan-50 text-cyan-600 text-[9px] font-bold font-mono px-2 py-0.5 rounded border border-cyan-100">
              DATOS MACRO
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Estima el TAM partiendo de un reporte global de facturación y aplicando porcentajes de segmentación.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-macro-size" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  TAM: Valor del Mercado Global de la Industria (USD)
                </label>
                <button
                  type="button"
                  onClick={() => onAskAssistant(`¿Cuál es el valor del mercado global (TAM macro) para la industria de "${inputs.industry}" hoy en día? ¿Qué firmas reportan estas cifras?`)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-mono transition font-bold"
                >
                  <Sparkles className="w-3 h-3" /> Buscar TAM Macro
                </button>
              </div>
              <div className="relative rounded shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="input-macro-size"
                  name="macroMarketSize"
                  value={inputs.macroMarketSize}
                  onChange={handleChange}
                  placeholder="Ej. 12000000000"
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-8 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                  min="0"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                El total facturado mundialmente en tu sector (Ej: Gartner, Statista).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="input-sam-pct" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    SAM: % Mercado Local/Sectorial
                  </label>
                </div>
                <div className="relative rounded shadow-sm">
                  <input
                    type="number"
                    id="input-sam-pct"
                    name="samPercentage"
                    value={inputs.samPercentage}
                    onChange={handleChange}
                    placeholder="Ej. 1.5"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 rounded pr-8 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                    min="0"
                    max="100"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-sm">%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Porcentaje que representa tu región geográfica ({inputs.geoRegion}) respecto al mercado global.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="input-som-pct" className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    SOM: % Cuota de Captación
                  </label>
                </div>
                <div className="relative rounded shadow-sm">
                  <input
                    type="number"
                    id="input-som-pct"
                    name="somPercentage"
                    value={inputs.somPercentage}
                    onChange={handleChange}
                    placeholder="Ej. 1.8"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 rounded pr-8 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-medium"
                    min="0"
                    max="100"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-sm">%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  El porcentaje del SAM regional que esperas capturar (típicamente 1% a 5% inicial).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4" id="form-submit-section">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-black text-white py-3 px-4 rounded-xl font-bold uppercase tracking-widest shadow-md transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                CALCULANDO MERCADO...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-300" />
                CALCULAR MERCADO
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
