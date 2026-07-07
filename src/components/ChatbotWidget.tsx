import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Bot, User, Sparkles, HelpCircle, Globe, RefreshCw, X } from "lucide-react";

interface ChatbotWidgetProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onSendMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  activePrompt: string | null;
  clearActivePrompt: () => void;
}

const QUICK_QUESTIONS = [
  {
    label: "📊 ¿Cómo estimo mi TAM?",
    text: "Necesito una guía paso a paso para calcular el número total de compradores (TAM) para mi idea de negocio. ¿Cómo puedo empezar si no tengo datos?"
  },
  {
    label: "🔍 Buscar censos/fuentes LatAm",
    text: "¿Cuáles son las principales fuentes de datos públicos o censos comerciales oficiales en México, Colombia, Chile, España y Latinoamérica para segmentar mercados B2B y B2C?"
  },
  {
    label: "💡 Sugerir nichos de mercado",
    text: "Quiero que analices el modelo de negocio actual y me sugieras 3 nichos o mercados adyacentes de alta conversión para expandir mi SOM/SAM."
  },
  {
    label: "📈 ¿Diferencia real TAM/SAM/SOM?",
    text: "¿Podrías darme una analogía sencilla para explicarle a un inversor no técnico la diferencia exacta entre TAM, SAM y SOM?"
  }
];

export default function ChatbotWidget({
  messages,
  setMessages,
  onSendMessage,
  isChatLoading,
  activePrompt,
  clearActivePrompt,
}: ChatbotWidgetProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  // Handle outside activation from form shortcuts
  useEffect(() => {
    if (activePrompt) {
      handleSendPrompt(activePrompt);
      clearActivePrompt();
    }
  }, [activePrompt]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    try {
      await onSendMessage(textToSend);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(inputText);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[600px] shadow-sm relative overflow-hidden text-slate-700" id="chatbot-widget-container">
      {/* Widget Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between" id="chatbot-header">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
            <Bot className="text-indigo-600 w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-sans tracking-wider text-slate-800 uppercase flex items-center gap-1.5">
              Consultor Estratégico AI
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                Google Search
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Guía de investigación de mercados en tiempo real</p>
          </div>
        </div>
      </div>

      {/* Messages Thread Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200" id="chat-messages-box">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center px-4" id="chat-onboarding">
            <Bot className="w-10 h-10 text-indigo-500/30 mb-3" />
            <p className="text-xs font-bold text-slate-800">¡Hola! Soy tu consultor de mercado.</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[280px] leading-relaxed">
              Puedo ayudarte a estimar la cantidad de compradores para tu Bottom-Up, sugerir fuentes reales o recomendar nichos para expandir tu negocio.
            </p>

            {/* Quick Prompts list */}
            <div className="w-full space-y-2 mt-5 text-left" id="quick-prompts">
              <span className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-widest font-mono">Preguntas Frecuentes:</span>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendPrompt(q.text)}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-indigo-400/40 p-2.5 rounded-xl text-[10px] text-slate-700 transition-all font-sans font-medium cursor-pointer active:scale-[0.99]"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 text-xs ${
                  msg.sender === "user"
                    ? "bg-slate-100 border-slate-200 text-slate-600"
                    : "bg-indigo-50 border-indigo-100 text-indigo-600"
                }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className="space-y-1.5 max-w-[82%]">
                  <div className={`px-3 py-2.5 rounded-xl text-xs leading-relaxed font-sans ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-xs font-medium"
                      : "bg-slate-50 border border-slate-200 rounded-tl-none text-slate-700 shadow-2xs font-normal"
                  }`}>
                    {/* Format markdown or text simply */}
                    <div className="whitespace-pre-line prose prose-xs">
                      {msg.text}
                    </div>
                  </div>

                  {/* Grounding Sources Panel if any (Citations from Google Search) */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-1.5" id="grounding-panel">
                      <div className="flex items-center gap-1 text-[9px] text-indigo-600 font-extrabold uppercase tracking-widest font-mono">
                        <Globe className="w-3 h-3 text-indigo-600" /> FUENTES DE GOOGLE:
                      </div>
                      <div className="flex flex-wrap gap-1.5" id="grounding-links">
                        {msg.groundingSources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer referrer"
                            className="bg-white hover:bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[9px] text-indigo-600 font-semibold font-sans truncate max-w-[170px] inline-flex items-center gap-1 transition shadow-2xs"
                            title={src.title}
                          >
                            <Globe className="w-2.5 h-2.5" />
                            {src.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className={`block text-[9px] text-slate-400 font-mono ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-2.5 flex-row">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 bg-indigo-50 border-indigo-100 text-indigo-600">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  Investigando bases de datos y redactando respuesta...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Box Form */}
      <form onSubmit={handleFormSubmit} className="bg-slate-50 border-t border-slate-200 p-3 flex gap-2" id="chat-input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Haz una pregunta o describe tu idea..."
          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 font-sans font-medium"
          disabled={isChatLoading}
          required
        />
        <button
          type="submit"
          disabled={isChatLoading || !inputText.trim()}
          className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white p-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          title="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
