import React, { useEffect, useRef, useState } from "react";
import { Copy, Check, Info, FileText } from "lucide-react";

interface CopySectionProps {
  onShowToast: (message: string, type: "success" | "info") => void;
}

const TITLES = [
  "Desenvolvimento de sistemas",
  "Tenha seu aplicativo",
  "Tenha seu app",
];

const DESCRIPTION = `WhatsApp: (13) 99102-7026
E-mail: joaojpmoreira25@gmail.com`;

export default function CopySection({ onShowToast }: CopySectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const copyText = async (text: string, key: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      onShowToast(message, "success");

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error("Erro ao copiar texto:", error);
      onShowToast("Falha ao copiar texto.", "info");
    }
  };

  const fullText = `${TITLES.join("\n")}\n\n${DESCRIPTION}`;

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-display font-semibold text-slate-900">
            Copiador de Textos de Divulgação
          </h2>
        </div>
        <button
          type="button"
          onClick={() => copyText(fullText, "all", "Mensagem completa copiada!")}
          className={`inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
            copiedKey === "all"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600 shadow-sm"
          }`}
        >
          {copiedKey === "all" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedKey === "all" ? "Copiado!" : "Copiar Tudo"}
        </button>
      </div>

      <div className="space-y-4">
        {TITLES.map((title, index) => {
          const key = `title-${index}`;
          const copied = copiedKey === key;
          return (
            <div className="space-y-1.5" key={key}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Título {index + 1} (clique na caixa para copiar)
                </span>
                <button
                  type="button"
                  onClick={() => copyText(title, key, `Título ${index + 1} copiado!`)}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer ${
                    copied ? "text-emerald-600" : "text-orange-500 hover:text-orange-600"
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => copyText(title, key, `Título ${index + 1} copiado!`)}
                className={`w-full text-left p-4 border rounded-xl font-mono text-xs text-slate-800 break-words flex items-center justify-between cursor-pointer transition-all ${
                  copied
                    ? "border-emerald-300 bg-emerald-50"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-orange-300"
                }`}
              >
                <span>{title}</span>
                {copied ? (
                  <Check className="w-4 h-4 ml-4 shrink-0 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 ml-4 shrink-0 text-slate-400" />
                )}
              </button>
            </div>
          );
        })}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Descrição e contato (clique na caixa para copiar)
            </span>
            <button
              type="button"
              onClick={() => copyText(DESCRIPTION, "desc", "Descrição copiada!")}
              className={`inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer ${
                copiedKey === "desc" ? "text-emerald-600" : "text-orange-500 hover:text-orange-600"
              }`}
            >
              {copiedKey === "desc" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedKey === "desc" ? "Copiada" : "Copiar Descrição"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => copyText(DESCRIPTION, "desc", "Descrição copiada!")}
            className={`w-full text-left p-4 border rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed cursor-pointer transition-all flex items-start justify-between gap-4 ${
              copiedKey === "desc"
                ? "border-emerald-300 bg-emerald-50"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-orange-300"
            }`}
          >
            <span>{DESCRIPTION}</span>
            {copiedKey === "desc" ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 shrink-0 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        Clique em qualquer caixa para copiar somente aquele texto, ou em
        <strong className="text-slate-700">Copiar Tudo</strong> para copiar todos os títulos e contatos.
      </div>
    </div>
  );
}
