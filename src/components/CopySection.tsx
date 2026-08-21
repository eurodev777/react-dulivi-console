import React, { useState } from "react";
import { Copy, Check, Info, FileText } from "lucide-react";

interface CopySectionProps {
  onShowToast: (message: string, type: "success" | "info") => void;
}

export default function CopySection({ onShowToast }: CopySectionProps) {
  const [copiedTitle1, setCopiedTitle1] = useState(false);
  const [copiedTitle2, setCopiedTitle2] = useState(false);
  const [copiedTitle3, setCopiedTitle3] = useState(false);
  const [copiedTitle4, setCopiedTitle4] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const title1 = "Cardápio Digital + Atendente Virtual";
  const title2 = "Anuncie sua empresa";
  const title3 = "Cardápio Digital";
  const title4 = "Site + Hospedagem + Domínio";
  const desc = `
WhatsApp: (13) 99102-7026

Site: dulivi.com.br`;

  const fullText = `${title1}
${title2}

${desc}`;

  const handleCopyText = async (
    text: string,
    type: "title1" | "title2" | "title3" | "title4" | "desc" | "all",
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "title1") {
        setCopiedTitle1(true);
        setTimeout(() => setCopiedTitle1(false), 2000);
        onShowToast("Título 1 copiado!", "success");
      } else if (type === "title2") {
        setCopiedTitle2(true);
        setTimeout(() => setCopiedTitle2(false), 2000);
        onShowToast("Título 2 copiado!", "success");
      }
      else if (type === "title3") {
        setCopiedTitle3(true);
        setTimeout(() => setCopiedTitle3(false), 2000);
        onShowToast("Título 2 copiado!", "success");
      }
      else if (type === "title4") {
        setCopiedTitle4(true);
        setTimeout(() => setCopiedTitle4(false), 2000);
        onShowToast("Título 2 copiado!", "success");
      }
       else if (type === "desc") {
        setCopiedDesc(true);
        setTimeout(() => setCopiedDesc(false), 2000);
        onShowToast("Descrição de benefícios copiada!", "success");
      } else if (type === "all") {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
        onShowToast("Mensagem completa copiada!", "success");
      }
    } catch (err) {
      onShowToast("Falha ao copiar texto.", "info");
    }
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Mini clean section title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900">
            Copiador de Textos de Divulgação
          </h2>
        </div>

        <button
          onClick={() => handleCopyText(fullText, "all")}
          className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold font-sans transition-all duration-300 border cursor-pointer ${copiedAll
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600 shadow-sm"
            }`}
        >
          {copiedAll ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copiedAll ? "Copiado Completo!" : "Copiar Tudo"}</span>
        </button>
      </div>

      {/* Grid Copy Block list */}
      <div className="space-y-4">
        {/* Title 1 Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Título 1 (Clique na caixa para copiar)
            </span>
            <button
              onClick={() => handleCopyText(title1, "title1")}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${copiedTitle1
                  ? "text-emerald-600"
                  : "text-orange-500 hover:text-orange-650"
                }`}
            >
              {copiedTitle1 ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedTitle1 ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
          <div
            onClick={() => handleCopyText(title1, "title1")}
            className={`p-4 bg-slate-50 hover:bg-slate-100/70 border rounded-xl font-mono text-xs text-slate-800 break-words flex items-center justify-between cursor-pointer transition-all ${copiedTitle1
                ? "border-emerald-550 bg-emerald-50/20 shadow-sm"
                : "border-slate-200/65 hover:border-orange-300"
              }`}
          >
            <span>{title1}</span>
            <Copy
              className={`w-3.5 h-3.5 flex-shrink-0 ml-4 transition-colors ${copiedTitle1 ? "text-emerald-600" : "text-slate-400"}`}
            />
          </div>
        </div>

        {/* Title 2 Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Título 2 (Clique na caixa para copiar)
            </span>
            <button
              onClick={() => handleCopyText(title2, "title2")}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${copiedTitle2
                  ? "text-emerald-600"
                  : "text-orange-500 hover:text-orange-650"
                }`}
            >
              {copiedTitle2 ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedTitle2 ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
          <div
            onClick={() => handleCopyText(title2, "title2")}
            className={`p-4 bg-slate-50 hover:bg-slate-100/70 border rounded-xl font-mono text-xs text-slate-800 break-words flex items-center justify-between cursor-pointer transition-all ${copiedTitle2
                ? "border-emerald-550 bg-emerald-50/20 shadow-sm"
                : "border-slate-200/65 hover:border-orange-300"
              }`}
          >
            <span>{title2}</span>
            <Copy
              className={`w-3.5 h-3.5 flex-shrink-0 ml-4 transition-colors ${copiedTitle2 ? "text-emerald-600" : "text-slate-400"}`}
            />
          </div>
        </div>

        {/* Title 3 Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Título 2 (Clique na caixa para copiar)
            </span>
            <button
              onClick={() => handleCopyText(title3, "title3")}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${copiedTitle3
                  ? "text-emerald-600"
                  : "text-orange-500 hover:text-orange-650"
                }`}
            >
              {copiedTitle3 ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedTitle3 ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
          <div
            onClick={() => handleCopyText(title3, "title3")}
            className={`p-4 bg-slate-50 hover:bg-slate-100/70 border rounded-xl font-mono text-xs text-slate-800 break-words flex items-center justify-between cursor-pointer transition-all ${copiedTitle3
                ? "border-emerald-550 bg-emerald-50/20 shadow-sm"
                : "border-slate-200/65 hover:border-orange-300"
              }`}
          >
            <span>{title3}</span>
            <Copy
              className={`w-3.5 h-3.5 flex-shrink-0 ml-4 transition-colors ${copiedTitle3 ? "text-emerald-600" : "text-slate-400"}`}
            />
          </div>
        </div>

        {/* Title 4 Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Título 2 (Clique na caixa para copiar)
            </span>
            <button
              onClick={() => handleCopyText(title4, "title4")}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${copiedTitle4
                  ? "text-emerald-600"
                  : "text-orange-500 hover:text-orange-650"
                }`}
            >
              {copiedTitle4 ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedTitle4 ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
          <div
            onClick={() => handleCopyText(title4, "title4")}
            className={`p-4 bg-slate-50 hover:bg-slate-100/70 border rounded-xl font-mono text-xs text-slate-800 break-words flex items-center justify-between cursor-pointer transition-all ${copiedTitle4
                ? "border-emerald-550 bg-emerald-50/20 shadow-sm"
                : "border-slate-200/65 hover:border-orange-300"
              }`}
          >
            <span>{title4}</span>
            <Copy
              className={`w-3.5 h-3.5 flex-shrink-0 ml-4 transition-colors ${copiedTitle4 ? "text-emerald-600" : "text-slate-400"}`}
            />
          </div>
        </div>

        {/* Description Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Descrição & Links (Clique na caixa para copiar)
            </span>
            <button
              onClick={() => handleCopyText(desc, "desc")}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer ${copiedDesc
                  ? "text-emerald-600"
                  : "text-orange-500 hover:text-orange-650"
                }`}
            >
              {copiedDesc ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedDesc ? "Copiada" : "Copiar Descrição"}</span>
            </button>
          </div>
          <div
            onClick={() => handleCopyText(desc, "desc")}
            className={`p-4 bg-slate-50 hover:bg-slate-100/70 border rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed cursor-pointer transition-all relative group ${copiedDesc
                ? "border-emerald-550 bg-emerald-50/20 shadow-sm"
                : "border-slate-200/65 hover:border-orange-300"
              }`}
          >
            <div>{desc}</div>
            <div className="absolute top-3 right-3 p-1 rounded bg-white border border-slate-150 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity">
              <Copy
                className={`w-3.5 h-3.5 ${copiedDesc ? "text-emerald-600" : "text-slate-400"}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
