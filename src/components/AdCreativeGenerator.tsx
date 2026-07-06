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
    "#FFFFFF", // branco
    "#FAFAFA", // branco gelo
    "#F8F8F8",
    "#F5F5F5",
    "#F2F2F2",
    "#EEEEEE",
    "#ECECEC",
    "#E9E9E9",
  
    // beges
    "#F9F6F1",
    "#F7F3EC",
    "#F5EFE6",
    "#F3EEE8",
    "#EFE7DD",
  
    // creme
    "#FFFDF8",
    "#FFF9F0",
    "#FFF6E9",
    "#FCF7EC",
  
    // azul bem claro
    "#F4F8FF",
    "#EEF5FF",
    "#EAF2FF",
  
    // verde bem claro
    "#F2FAF5",
    "#EDF8F1",
    "#EAF7EA",
  
    // rosa bem claro
    "#FFF5F7",
    "#FDF0F3",
  
    // amarelo claro
    "#FFFBEA",
    "#FFF8DC",
    "#FCF8E8",
  
    // cinza azulado
    "#F3F5F7",
    "#EEF2F5",
  
    // lavanda clara
    "#F7F5FF",
    "#F3F0FF",
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
  
    ctx.fillStyle = "#000";

    if (data.title === "SITE") {
      // Seu SITE na mesma linha
      ctx.font = '900 150px "Open Sans"';
      ctx.fillText("Seu SITE", 540, 230);
    } else {
      // Seu em cima e o restante embaixo
      ctx.font = '900 120px "Open Sans"';
      ctx.fillText("Seu", 540, 155);
    
      ctx.font = '900 170px "Open Sans"';
      ctx.fillText(data.title, 540, 320);
    }
  
    // Por apenas
    ctx.fillStyle = "#000";
    ctx.font = '720 105px "Open Sans"';
    ctx.fillText(
      data.price.value === "GRÁTIS" ? "crie" : "por apenas",
      540,
      470
    );
  
    // Preço
    ctx.fillStyle = "#ff0000";
    ctx.font = '900 180px "Open Sans"';
    ctx.fillText(data.price.value, 540, 650);
  
    // extra
    if (data.price.value !== "GRÁTIS") {
      ctx.fillStyle = "#2E7DFF";
      ctx.font = '700 70px "Open Sans"';
    
      ctx.fillText(
        data.price.annual ? "mensais no plano anual" : "mensais",
        data.price.annual ? 540 : 820,
        720
      );
    }
  
    // // Plano anual
    // ctx.fillStyle = "#000";
    // ctx.font = '600 42px "Open Sans"';
    // ctx.fillText(`ou ${data.price.annual}`, 540, 790);
  
    // Extra
    ctx.font = '900 90px "Open Sans"';
    ctx.fillText(data.extra, 540, 930);
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
