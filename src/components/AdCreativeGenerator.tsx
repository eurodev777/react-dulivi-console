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

  // Fallback initial state
  const fallbackCreative: CreativeData = {
    title: "Cardápio Inteligente",
    hook: "Diga adeus às taxas abusivas dos aplicativos!",
    badge: "Teste Grátis 15 Dias",
    accentColor: "#F97316",
    bgGradientStart: "#0F172A",
    bgGradientEnd: "#1E293B",
    bgImagePrompt:
      "delicious juicy burger floating burger modern digital menu vector neon, dark background, flat design, 3D clay aesthetic, minimal, no text",
  };

  // Generate a random seed
  const getRandomSeed = () => Math.floor(Math.random() * 1000000);

  // Primary function to request new creative from server
  const generateNewCreative = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.dulivi.com.br/api/generate-creative-prompts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data: CreativeData = await response.json();
      setCreative(data);

      // Select random layout structure
      setAdLayoutType(Math.floor(Math.random() * 3));

      // Construct Pollinations URL with the Gemini generated prompt
      const seed = getRandomSeed();
      const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(data.bgImagePrompt)}?width=1085&height=1085&nologo=true&seed=${seed}&model=flux`;
      setBgImageUrl(pollinationUrl);
    } catch (error) {
      console.error(error);
      onShowToast(
        "Erro ao contatar o servidor. Usando tema de backup local.",
        "info",
      );

      const fallback = { ...fallbackCreative };
      setCreative(fallback);
      setBgImageUrl(
        `https://image.pollinations.ai/prompt/${encodeURIComponent(fallback.bgImagePrompt)}?width=1080&height=1080&nologo=true&seed=${getRandomSeed()}&model=flux`,
      );
    }
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
      const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
      grad.addColorStop(0, creative.bgGradientStart);
      grad.addColorStop(1, creative.bgGradientEnd);
      ctx.fillStyle = grad;
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

  const drawMinimalAd = (ctx: CanvasRenderingContext2D, data: CreativeData) => {
    // overlay forte
    ctx.fillStyle = "rgba(0,0,0,.65)";
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.textAlign = "center";

    // badge pequeno
    ctx.fillStyle = data.accentColor;
    drawRoundRect(ctx, 360, 70, 360, 60, 30);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = '700 30px "Space Grotesk"';
    ctx.fillText(data.badge.toUpperCase(), 540, 110);

    // titulo gigante
    const title = data.title.toUpperCase();

    ctx.fillStyle = "#fff";
    ctx.font = '900 120px "Space Grotesk"';

    wrapText(ctx, title, 540, 450, 900, 130, true);

    // hook bem menor
    ctx.fillStyle = "#CBD5E1";
    ctx.font = '500 54px "Space Grotesk"';

    wrapText(ctx, data.hook, 540, 850, 880, 50, true);

    // footer
    ctx.fillStyle = "#CBD5E1";
    ctx.font = '700 24px "Space Grotesk"';
    ctx.fillText("GARANTA SEUS 15 DIAS GRÁTIS EM:", 540, 1000);

    ctx.fillStyle = data.accentColor;
    ctx.font = '900 42px "Space Grotesk"';
    ctx.fillText("DULIVI.COM.BR", 540, 1050);
  };

  // Helper function to draw rounded corners rect
  const drawRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Helper for text wrapping in Canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    isCentered: boolean = false,
    fontSizeOverride?: number,
  ) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    const originFont = ctx.font;

    if (fontSizeOverride) {
      ctx.font = `600 ${fontSizeOverride}px "Plus Jakarta Sans", sans-serif`;
    }

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, isCentered ? x : x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, isCentered ? x : x, currentY);
    ctx.font = originFont; // restore
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
                Informações da Peça IA
              </span>
              {creative ? (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-800">
                    {creative.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{creative.hook}"
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200/80 text-slate-600 font-medium">
                      Accent: {creative.accentColor}
                    </span>
                    <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200/80 text-slate-600 font-medium">
                      Layout: Estilo #{adLayoutType + 1}
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
