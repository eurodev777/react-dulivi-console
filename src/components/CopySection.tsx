import React, { useState } from 'react';
import { Copy, Check, Info, FileText } from 'lucide-react';

interface CopySectionProps {
  onShowToast: (message: string, type: 'success' | 'info') => void;
}

export default function CopySection({ onShowToast }: CopySectionProps) {
  const [copiedTitle1, setCopiedTitle1] = useState(false);
  const [copiedTitle2, setCopiedTitle2] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const title1 = "Sistema completo para Delivery";
  const title2 = "Cardápio Digital + Anúncios Online";
  const desc = `Estamos liberando 15 dias grátis para testar:

✅ Cardápio Digital completo
✅ Robô de atendimento no WhatsApp
✅ Sistema de pedidos online
✅ Divulgação com anúncios no Facebook, Instagram e Google (créditos dos anúncios à parte)

Conheça:
dulivi.com.br`;

  const fullText = `${title1}
${title2}

${desc}`;

  const handleCopyText = async (text: string, type: 'title1' | 'title2' | 'desc' | 'all') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'title1') {
        setCopiedTitle1(true);
        setTimeout(() => setCopiedTitle1(false), 2000);
        onShowToast("Título 1 copiado!", "success");
      } else if (type === 'title2') {
        setCopiedTitle2(true);
        setTimeout(() => setCopiedTitle2(false), 2000);
        onShowToast("Título 2 copiado!", "success");
      } else if (type === 'desc') {
        setCopiedDesc(true);
        setTimeout(() => setCopiedDesc(false), 2000);
        onShowToast("Descrição de benefícios copiada!", "success");
      } else if (type === 'all') {
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
          <p className="text-slate-500 text-xs mt-1">
            Copie os títulos e a descrição separadamente para usar rápido nos seus canais de prospecção.
          </p>
        </div>
        
        <button
          onClick={() => handleCopyText(fullText, 'all')}
          className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold font-sans transition-all duration-300 border cursor-pointer ${
            copiedAll
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600 shadow-sm'
          }`}
        >
          {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAll ? "Copiado Completo!" : "Copiar Tudo"}</span>
        </button>
      </div>

      {/* Grid Copy Block list */}
      <div className="space-y-4">
        {/* Title 1 Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Título 1</span>
            <button
              onClick={() => handleCopyText(title1, 'title1')}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${
                copiedTitle1 ? 'text-emerald-600' : 'text-orange-500 hover:text-orange-650'
              }`}
            >
              {copiedTitle1 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTitle1 ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl font-mono text-xs text-slate-800 break-words flex items-center justify-between">
            <span>{title1}</span>
          </div>
        </div>

        {/* Title 2 Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Título 2</span>
            <button
              onClick={() => handleCopyText(title2, 'title2')}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${
                copiedTitle2 ? 'text-emerald-600' : 'text-orange-500 hover:text-orange-650'
              }`}
            >
              {copiedTitle2 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTitle2 ? "Copiado" : "Copiar"}</span>
            </button>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl font-mono text-xs text-slate-800 break-words flex items-center justify-between">
            <span>{title2}</span>
          </div>
        </div>

        {/* Description Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Descrição & Links</span>
            <button
              onClick={() => handleCopyText(desc, 'desc')}
              className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${
                copiedDesc ? 'text-emerald-600' : 'text-orange-500 hover:text-orange-650'
              }`}
            >
              {copiedDesc ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedDesc ? "Copiada" : "Copiar Descrição"}</span>
            </button>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}
