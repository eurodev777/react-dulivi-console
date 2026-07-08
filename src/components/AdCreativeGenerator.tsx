import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Download,
  RefreshCw,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { CreativeData } from "../types";

interface AdCreativeGeneratorProps {
  onShowToast: (message: string, type: "success" | "info") => void;
}

export default function AdCreativeGenerator({
  onShowToast,
}: AdCreativeGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [creative, setCreative] = useState<CreativeData | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string>("");
  const [adLayoutType, setAdLayoutType] = useState<number>(0); // alternate between different visual layouts for variety
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const titles = [
    "DELIVERY",
    "SITE",
    "CARDÁPIO",
  ];

  const prices = [
    {
      value: "R$ 75,00",
      annual: false,
    },
    {
      value: "R$ 60,00",
      annual: true,
    },
    {
      value: "GRÁTIS",
      annual: false
    },
  ];

  const extras = [
    "+ Robô para WhatsApp",
    "+ ANÚNCIOS ONLINE",
    "+ Tráfego Pago",
    "+ IA para Restaurantes",
    "+ Atendente Virtual",
    "+ Pagamento Online"
  ];

  const backgrounds = [
    // 1. Pastéis Distintos (Suaves)
    "#FFB3BA", // Rosa pastel
    "#FFDFBA", // Pêssego/Laranja pastel
    "#FFFFBA", // Amarelo pastel
    "#BAFFC9", // Verde menta pastel
    "#BAE1FF", // Azul bebê
    "#E2CBF7", // Lilás suave
    "#FFC4E1", // Chiclete claro
    "#C4FAF8", // Ciano bem claro

    // 2. Tons Terrosos e Boho (Modernos)
    "#264653", // Azul petróleo escuro
    "#2A9D8F", // Verde esmeralda suave
    "#E9C46A", // Amarelo mostarda
    "#F4A261", // Laranja areia
    "#E76F51", // Terracota / Coral escuro
    "#A3B18A", // Verde militar claro
    "#DDA15E", // Caramelo
    "#BC6C25", // Marrom madeira

    // 3. Vibrantes e Vivas (Material Design)
    "#F44336", // Vermelho forte
    "#9C27B0", // Roxo vivo
    "#2196F3", // Azul vibrante
    "#00BCD4", // Ciano (Turquesa)
    "#4CAF50", // Verde bandeira
    "#FFEB3B", // Amarelo vivo
    "#FF9800", // Laranja vivo
    "#E91E63", // Pink

    // 4. Mix de Frios e Quentes (Saturação média)
    "#8ECAE6", // Azul céu
    "#219EBC", // Azul cerúleo
    "#023047", // Azul noite (muito escuro)
    "#FFB703", // Amarelo gema
    "#FB8500", // Laranja tangerina
    "#8338EC", // Roxo elétrico
    "#FF006E", // Rosa neon
    "#3A86FF", // Azul royal

    // 5. Cores Escuras (Estilo Dark Mode)
    "#1A1A2E", // Azul marinho profundo
    "#16213E", // Azul noturno
    "#0F3460", // Azul intermediário escuro
    "#E94560", // Rosa avermelhado escuro
    "#2C3E50", // Cinza azulado
    "#27AE60", // Verde musgo escuro
    "#8E44AD", // Roxo escuro
    "#D35400", // Abóbora escuro
  ];

  const generateNewCreative = () => {
    const title = titles[Math.floor(Math.random() * titles.length)];

    // Se for SITE, usa dados fixos
    if (title === "SITE") {
      setCreative({
        title,
        price: { value: "R$ 90,00" },
        extra: "Entregue em 7 dias",
        background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
      });

      return;
    }

    // Demais serviços
    setCreative({
      title,
      price: prices[Math.floor(Math.random() * prices.length)],
      extra: extras[Math.floor(Math.random() * extras.length)],
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
    });
  };

  // On mount, load first creative
  useEffect(() => {
    generateNewCreative();
  }, []);

  // Whenever creative, background image, or layout type changes, redraw the canvas
  useEffect(() => {
    if (!creative) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution canvas dimensions (1080 x 1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // Preload elements
    const drawCanvas = (bgImg?: HTMLImageElement) => {
      // 1. Draw base gradient as background fallback
      ctx.fillStyle = creative.background;
      ctx.fillRect(0, 0, 1080, 1080);

      // 2. Draw background image with cover style
      if (bgImg) {
        // Source aspect ratios
        const imgRatio = bgImg.width / bgImg.height;
        let sx = 0,
          sy = 0,
          sWidth = bgImg.width,
          sHeight = bgImg.height;

        if (imgRatio > 1) {
          sWidth = bgImg.height;
          sx = (bgImg.width - sWidth) / 2;
        } else {
          sHeight = bgImg.width;
          sy = (bgImg.height - sHeight) / 2;
        }

        ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, 1080, 1080);

        // Semi-transparent ambient dark cover overlay to boost contrast
        ctx.fillStyle = "rgba(15, 23, 42, 0.65)";
        ctx.fillRect(0, 0, 1080, 1080);
      }

      // 3. Draw stylized geometric ambient details
      ctx.strokeStyle = `${creative.accentColor}33`; // 20% opacity matching accent
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.stroke();
      ctx.beginPath();
      ctx.stroke();

      drawMinimalAd(ctx, creative);

      setLoading(false);
    };

    if (bgImageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Important to prevent canvas staining (needed for download)
      img.src = bgImageUrl;
      img.onload = () => {
        drawCanvas(img);
      };
      img.onerror = () => {
        console.warn(
          "Could not load image from Pollinations; rendering with beautiful gradient.",
        );
        drawCanvas();
      };
    } else {
      drawCanvas();
    }
  }, [creative, bgImageUrl, adLayoutType]);

  const drawMinimalAd = (ctx, data) => {
    ctx.fillStyle = data.background;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.textAlign = "center";

    // --- CONFIGURAÇÃO DA SOMBRA E BORDA PADRÃO ---
    // Uma leve sombra escura para dar profundidade
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Configuração da borda (Stroke) - Branca para proteger a letra de fundos escuros/iguais
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 20; // Grossura da borda (pode ajustar se achar muito grossa)
    ctx.lineJoin = "round"; // Deixa os cantos da borda arredondados

    // Função auxiliar para desenhar o texto com a borda
    // Ela desenha a borda primeiro e pinta a cor principal por cima
    const drawTextWithOutline = (text, x, y) => {
      ctx.strokeText(text, x, y); // Desenha a borda branca (com sombra)

      // Desliga a sombra rapidamente apenas para o miolo da letra não ficar borrado
      ctx.shadowColor = "transparent";
      ctx.fillText(text, x, y); // Pinta a cor principal por dentro

      // Religa a sombra para o próximo texto
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    };

    ctx.fillStyle = "#fff";

    if (data.title === "SITE") {
      // Seu SITE na mesma linha
      ctx.font = '900 150px "Roboto"';
      drawTextWithOutline("Seu SITE", 540, 230);
    } else {
      // Seu em cima e o restante embaixo
      ctx.font = '900 120px "Roboto"';
      drawTextWithOutline("Seu", 540, 150);

      ctx.font = '900 170px "Roboto"';
      drawTextWithOutline(data.title, 540, 320);
    }

    // Por apenas
    ctx.fillStyle = "#fff";
    ctx.font = '720 105px "Roboto"';
    drawTextWithOutline(
      data.price.value === "GRÁTIS" ? "crie" : "por apenas",
      540,
      450
    );

    // Preço - Usando vermelho vibrante
    ctx.fillStyle = "#FF003C"; // Troquei para aquele vermelho neon que te passei antes, destaca mais!
    ctx.font = '900 180px "Roboto"';
    drawTextWithOutline(data.price.value, 540, 650);

    // extra
    if (data.price.value !== "GRÁTIS") {
      ctx.fillStyle = "#007AFF"; // Azul
      ctx.font = '700 70px "Roboto"';

      drawTextWithOutline(
        data.price.annual ? "mensais no plano anual" : "mensais",
        data.price.annual ? 540 : 820,
        730
      );
    }

    // Extra final
    ctx.fillStyle = "#fff"; // Esqueci de resetar a cor, então coloquei preto aqui para garantir
    ctx.font = '900 90px "Roboto"';
    drawTextWithOutline(data.extra, 540, 930);

    // Limpa as configurações de sombra e linha no final para não afetar outros desenhos do canvas
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 1;
  };

  // Download high quality ad png trigger
  const handleDownloadImage = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `dulivi_anuncio_ia_${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast("Criativo baixado com sucesso!", "success");
    } catch (err) {
      console.error(err);
      onShowToast(
        "Erro ao processar o download. Verifique se a imagem já terminou de carregar completamente.",
        "info",
      );
    }
  };

  return (
    <div className="bg-white/60 border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-900">
              Gerador de Criativos com IA
            </h2>
          </div>
        </div>

        <button
          onClick={generateNewCreative}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 font-semibold py-2 px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 disabled:cursor-not-allowed shadow-sm cursor-pointer hover:shadow-md py-2.5"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>GERAR OUTRO CRIATIVO</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
        {/* Left column: Controls & details */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 bg-opacity-40 border border-orange-100 rounded-xl space-y-3">
              <span className="text-[10px] font-bold text-orange-700 tracking-wider uppercase font-mono">
                Informações da Peça
              </span>
              {creative ? (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-800">
                    {creative.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{creative.extra}"
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200/80 text-slate-600 font-medium">
                      Accent: {creative.background}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-20 animate-pulse bg-slate-200/50 rounded" />
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleDownloadImage}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 py-3 px-5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-4.5 h-4.5" />
                <span>BAIXAR ARTE HD (PNG)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Canvas Preview Frame */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px]">
          {loading && (
            <div className="absolute inset-0 bg-slate-50/80 backdrop-filter backdrop-blur-[4px] flex flex-col items-center justify-center z-10 rounded-2xl">
              <div className="relative flex items-center justify-center mb-4">
                <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
                <ImageIcon className="w-5 h-5 text-orange-600 absolute animate-pulse" />
              </div>
              <div className="space-y-1 text-center px-4 max-w-sm">
                <p className="text-sm font-semibold text-slate-850 animate-bounce">
                  Gerando nova arte única com IA...
                </p>
                <p className="text-xs text-slate-500">
                  Isso envolve consulta rápida de copy pelo Gemini e download do
                  visual de fundo.
                </p>
              </div>
            </div>
          )}

          {/* Hidden but responsive real canvas container */}
          <div className="w-full max-w-[420px] aspect-square relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: loading ? 0.3 : 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
