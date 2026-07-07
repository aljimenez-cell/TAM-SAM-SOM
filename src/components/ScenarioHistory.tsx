import React from "react";
import { SavedScenario } from "../types";
import { FolderHeart, Trash2, ArrowUpRight, Calendar, Landmark } from "lucide-react";

interface ScenarioHistoryProps {
  historyList: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: string) => void;
  onSaveCurrent: () => void;
  canSave: boolean;
}

export default function ScenarioHistory({
  historyList,
  onLoadScenario,
  onDeleteScenario,
  onSaveCurrent,
  canSave,
}: ScenarioHistoryProps) {

  const formatUSD = (val: number) => {
    if (val >= 1e9) {
      return `$${(val / 1e9).toFixed(1)}B`;
    }
    if (val >= 1e6) {
      return `$${(val / 1e6).toFixed(1)}M`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-700" id="history-container">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4" id="history-header">
        <div className="flex items-center gap-2">
          <FolderHeart className="text-pink-600 w-5 h-5" />
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-800">
            Escenarios Guardados ({historyList.length})
          </h2>
        </div>

        <button
          onClick={onSaveCurrent}
          disabled={!canSave}
          className="bg-pink-600 hover:bg-pink-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-white px-3 py-1.5 rounded-lg font-bold shadow-xs cursor-pointer transition"
          id="btn-save-current"
        >
          Guardar Actual
        </button>
      </div>

      {historyList.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400 font-sans" id="history-empty">
          <Calendar className="w-8 h-8 mx-auto text-slate-200 mb-2" />
          No tienes escenarios guardados todavía.
          <p className="text-[10px] text-slate-400 mt-1">Completa un cálculo y presiona el botón para guardarlo localmente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="history-list">
          {historyList.map((sc) => {
            const bu = sc.results.bottomUp;
            return (
              <div
                key={sc.id}
                className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-pink-500/20 rounded-xl p-4 transition flex flex-col justify-between group relative shadow-2xs hover:scale-[1.01]"
                id={`scenario-card-${sc.id}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-800 truncate max-w-[80%]" title={sc.inputs.businessName}>
                      {sc.inputs.businessName}
                    </h3>
                    <button
                      onClick={() => onDeleteScenario(sc.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
                      title="Eliminar del historial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <span className="text-[10px] text-indigo-600 font-bold font-mono block mt-0.5 truncate">
                    {sc.inputs.industry}
                  </span>
                  
                  <span className="text-[9px] text-slate-400 font-mono block mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-300" /> {sc.date}
                  </span>

                  {/* Tiny metrics visualization */}
                  <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded border border-slate-200 mt-3 text-[10px] font-mono shadow-3xs">
                    <div className="text-center">
                      <span className="text-[8px] text-slate-400 block uppercase font-sans">TAM</span>
                      <span className="text-slate-800 font-bold">{formatUSD(bu.tam)}</span>
                    </div>
                    <div className="text-center border-x border-slate-150">
                      <span className="text-[8px] text-slate-400 block uppercase font-sans">SAM</span>
                      <span className="text-emerald-600 font-bold">{formatUSD(bu.sam)}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[8px] text-slate-400 block uppercase font-sans">SOM</span>
                      <span className="text-indigo-600 font-bold">{formatUSD(bu.som)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-end">
                  <button
                    onClick={() => onLoadScenario(sc)}
                    className="text-[11px] text-pink-600 hover:text-pink-500 flex items-center gap-1 font-bold cursor-pointer group-hover:translate-x-0.5 transition-all"
                  >
                    Cargar Escenario <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
