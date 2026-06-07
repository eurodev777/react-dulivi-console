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
      ctx.arc(100, 100, 150, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(980, 980, 200, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Draw ad layout based on adLayoutType
      if (adLayoutType === 0) {
        // Layout 0: Centered glass card layout (Modern SaaS)
        drawCenteredGlassAd(ctx, creative);
      } else if (adLayoutType === 1) {
        // Layout 1: Bold asymmetrical left side list (Facebook Banner style)
        drawAsymmetricAd(ctx, creative);
      } else {
        // Layout 2: Modern dark brutalist card grid list
        drawSplitFeatureAd(ctx, creative);
      }

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

  // Layout 0: Modern centered card overlay layout
  const drawCenteredGlassAd = (
    ctx: CanvasRenderingContext2D,
    data: CreativeData,
  ) => {
    // Elegant border frame
    ctx.strokeStyle = `${data.accentColor}dd`;
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1020, 1020);

    // Main dark container glassmorphism simulation
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    // draw round rect
    drawRoundRect(ctx, 80, 100, 920, 880, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Top logo label
    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("DULIVI", 540, 175);

    ctx.fillStyle = data.accentColor;
    ctx.font = '500 22px "Space Grotesk", sans-serif';
    ctx.fillText("◇ SISTEMA PARCELADO DE ENTREGAS ◇", 540, 215);

    // Badge: "Teste Grátis 15 Dias"
    ctx.fillStyle = data.accentColor;
    drawRoundRect(ctx, 350, 240, 380, 64, 32);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 30px "Space Grotesk", sans-serif';
    ctx.fillText(data.badge.toUpperCase(), 540, 282);

    // Slogan / title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = '800 54px "Plus Jakarta Sans", sans-serif';
    wrapText(ctx, data.title.toUpperCase(), 540, 375, 820, 68, true);

    // Bullet Benefits Header
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = '500 18px "Space Grotesk", sans-serif';
    ctx.fillText("PLANILHA DE VANTAGENS DO PACOTE", 540, 520);

    // Benefits list setup
    const benefits = [
      "Cardápio Digital completo e interativo",
      "Robô automático no WhatsApp para pedidos",
      "Recebimento direto de clientes sem taxas",
      "Divulgação programada de anúncios online",
    ];

    ctx.textAlign = "left";
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';

    benefits.forEach((benefit, index) => {
      const yPos = 585 + index * 70;

      // Draw Checkbox Background
      ctx.fillStyle = data.accentColor;
      drawRoundRect(ctx, 160, yPos - 26, 36, 36, 8);
      ctx.fill();

      // Checkmark tick
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("✓", 168, yPos + 1);

      // Benefit Text
      ctx.fillStyle = "#E2E8F0";
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(benefit, 216, yPos + 2);
    });

    // Footer brand/domain
    ctx.textAlign = "center";
    ctx.fillStyle = "#94A3B8";
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("Acesse o painel oficial para saber mais", 540, 895);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 38px "Space Grotesk", sans-serif';
    ctx.fillText("DULIVI.COM.BR", 540, 945);
  };

  // Layout 1: Left-aligned list (Facebook Ad inspired)
  const drawAsymmetricAd = (
    ctx: CanvasRenderingContext2D,
    data: CreativeData,
  ) => {
    // Side frame border highlight
    ctx.fillStyle = data.accentColor;
    ctx.fillRect(0, 0, 40, 1080);

    // Glass panel overlay covering the left side
    ctx.fillStyle = "rgba(11, 16, 30, 0.85)";
    drawRoundRect(ctx, 80, 80, 920, 920, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = data.accentColor;
    ctx.font = '800 32px "Space Grotesk", sans-serif';
    ctx.fillText("DULIVI CARDÁPIO", 140, 160);

    // Badge
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundRect(ctx, 140, 195, 280, 48, 8);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.fillText(`⚡ ${data.badge.toUpperCase()}`, 160, 226);

    // title Headline
    ctx.fillStyle = "#FFFFFF";
    ctx.font = '800 62px "Plus Jakarta Sans", sans-serif';
    wrapText(ctx, data.title.toUpperCase(), 140, 310, 800, 72, false);

    // Separator line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(140, 480);
    ctx.lineTo(820, 480);
    ctx.stroke();

    // Features Section
    const benefits = [
      "Cardápio Digital completo e profissional",
      "Robô inteligente atendendo no WhatsApp 24h",
      "Sistema de pedidos integrado sem intermédios",
      "Seu negócio anunciado com anúncios prontos",
    ];

    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    benefits.forEach((benefit, idx) => {
      const y = 540 + idx * 75;

      // Draw beautiful indicator
      ctx.fillStyle = data.accentColor;
      ctx.beginPath();
      ctx.arc(160, y + 10, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("✓", 154, y + 16);

      ctx.fillStyle = "#F1F5F9";
      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(benefit, 195, y + 19);
    });

    // Domain call text
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("Acesse via navegador e ganhe bônus:", 140, 895);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = '900 48px "Space Grotesk", sans-serif';
    ctx.fillText("dulivi.com.br", 140, 955);
  };

  // Layout 2: Modern dark split feature layout
  const drawSplitFeatureAd = (
    ctx: CanvasRenderingContext2D,
    data: CreativeData,
  ) => {
    // Soft elegant frame
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 1066, 1066);

    // Two column split representation (Glass grids card)
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    drawRoundRect(ctx, 60, 60, 960, 960, 20);
    ctx.fill();

    // Top Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#F8FAFC";
    ctx.font = '800 44px "Space Grotesk", sans-serif';
    ctx.fillText("SaaS Dulivi Delivery", 540, 140);

    // Badge Overlay
    ctx.fillStyle = data.accentColor;
    drawRoundRect(ctx, 380, 175, 320, 50, 12);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(data.badge.toUpperCase(), 540, 208);

    // Large main visual slogan text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 50px "Plus Jakarta Sans", sans-serif';
    wrapText(ctx, data.title, 540, 290, 860, 64, true);

    // Bullet Grid Cards (Grid of features)
    const features = [
      { t: "Cardápio Personalizado", d: "Seu layout, suas cores e logomarca." },
      {
        t: "Automação no WhatsApp",
        d: "Instalação imediata responde sozinho.",
      },
      { t: "Consumo Zero Taxas", d: "Rende 100% de lucro em todas as vendas." },
      { t: "Mídia Paga & Vendas", d: "Anúncios diretos integrados no SaaS." },
    ];

    const cardWidth = 410;
    const cardHeight = 180;
    const cardGap = 40;

    features.forEach((f, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);

      const x = 110 + col * (cardWidth + cardGap);
      const y = 460 + row * (cardHeight + cardGap);

      // Card body
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      drawRoundRect(ctx, x, y, cardWidth, cardHeight, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Colored Left Mark
      ctx.fillStyle = data.accentColor;
      ctx.fillRect(x, y + 30, 6, 45);

      // Title
      ctx.textAlign = "left";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(f.t, x + 24, y + 52);

      // Desc
      ctx.fillStyle = "#94A3B8";
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      wrapText(ctx, f.d, x + 24, y + 84, cardWidth - 48, 22, false, 18);
    });

    // Clean brand call
    ctx.textAlign = "center";
    ctx.fillStyle = "#64748B";
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillText("GARANTA SEUS 15 DIAS GRÁTIS EM:", 540, 915);

    ctx.fillStyle = data.accentColor;
    ctx.font = '800 38px "Space Grotesk", sans-serif';
    ctx.fillText("DULIVI.COM.BR", 540, 965);
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
