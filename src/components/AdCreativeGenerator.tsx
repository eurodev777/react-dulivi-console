import React, { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import { CreativeData } from "../types";

interface AdCreativeGeneratorProps {
  onShowToast: (message: string, type: "success" | "info") => void;
}

const SIZE = 1080;
const PRICE = "R$ 499,00";
const PRODUCT_LINES = ["SISTEMA WEB", "APP MOBILE", "SOFTWARE", "OU APLICATIVO"];

// Fotografias públicas de tecnologia. Para funcionar sem internet,
// substitua estes endereços por imagens na pasta public do seu projeto.
const PHOTOS = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&q=85&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=85&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=85&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=85&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=85&fit=crop",
];

const THEMES = [
  { base: "#2636e8", tint: "rgba(24,32,151,0.55)", accent: "#FFEB00" },
  { base: "#f12688", tint: "rgba(151,13,90,0.58)", accent: "#FFE600" },
  { base: "#0b9bd1", tint: "rgba(2,99,155,0.58)", accent: "#FFE600" },
  { base: "#7828d6", tint: "rgba(69,13,133,0.60)", accent: "#FFEB00" },
  { base: "#ed651b", tint: "rgba(140,45,9,0.58)", accent: "#FFFF00" },
  { base: "#009e87", tint: "rgba(3,89,78,0.60)", accent: "#FFE600" },
];

type Theme = (typeof THEMES)[number];

type Variant = {
  photoIndex: number;
  themeIndex: number;
  layoutIndex: number;
  creative: CreativeData;
};

function differentRandom(length: number, previous: number) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === previous) next = Math.floor(Math.random() * length);
  return next;
}

function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  const scale = Math.max(SIZE / image.naturalWidth, SIZE / image.naturalHeight);
  const w = image.naturalWidth * scale;
  const h = image.naturalHeight * scale;
  ctx.drawImage(image, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  maxWidth = 940
) {
  let size = fontSize;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  do {
    ctx.font = `900 ${size}px Arial, Helvetica, sans-serif`;
    if (ctx.measureText(value).width <= maxWidth || size <= 30) break;
    size -= 2;
  } while (true);

  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.lineWidth = Math.max(5, size * 0.11);
  ctx.strokeStyle = "rgba(0,0,0,0.82)";
  ctx.strokeText(value, x, y);
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

function drawArtwork(
  ctx: CanvasRenderingContext2D,
  variant: Variant,
  image?: HTMLImageElement
) {
  const theme: Theme = THEMES[variant.themeIndex];
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = theme.base;
  ctx.fillRect(0, 0, SIZE, SIZE);

  if (image) {
    drawCover(ctx, image);
    ctx.fillStyle = theme.tint;
    ctx.fillRect(0, 0, SIZE, SIZE);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    gradient.addColorStop(0, theme.base);
    gradient.addColorStop(1, "#101025");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.beginPath();
    ctx.arc(960, 130, 360, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gradiente mantém os títulos legíveis sem esconder a fotografia.
  const readability = ctx.createLinearGradient(0, 0, 0, SIZE);
  readability.addColorStop(0, "rgba(0,0,0,0.46)");
  readability.addColorStop(0.54, "rgba(0,0,0,0.20)");
  readability.addColorStop(1, "rgba(0,0,0,0.68)");
  ctx.fillStyle = readability;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Três composições com o MESMO texto. "OU" é sempre preservado.
  const layouts = [
    { top: 85, rowStart: 255, rowGap: 105, rowSize: 91, priceIntro: 730, price: 837 },
    { top: 105, rowStart: 285, rowGap: 101, rowSize: 87, priceIntro: 735, price: 843 },
    { top: 93, rowStart: 255, rowGap: 109, rowSize: 88, priceIntro: 743, price: 852 },
  ];
  const layout = layouts[variant.layoutIndex % layouts.length];

  drawText(ctx, "TENHA SEU PRÓPRIO", 540, layout.top, 78, "#FFFFFF");

  PRODUCT_LINES.forEach((line, index) => {
    drawText(
      ctx,
      line,
      540,
      layout.rowStart + index * layout.rowGap,
      layout.rowSize,
      index === 3 ? theme.accent : "#FFFFFF"
    );
  });

  drawText(ctx, "A PARTIR DE", 540, layout.priceIntro, 66, "#FFFFFF");
  drawText(ctx, PRICE, 540, layout.price, 151, theme.accent, 965);

  ctx.fillStyle = "rgba(0,0,0,0.42)";
  ctx.beginPath();
  ctx.roundRect(235, 940, 610, 84, 26);
  ctx.fill();
  drawText(ctx, "PAGAMENTO ÚNICO", 540, 982, 54, "#FFFFFF", 570);
}

export default function AdCreativeGenerator({
  onShowToast,
}: AdCreativeGeneratorProps) {
  const [loading, setLoading] = useState(true);
  const [variant, setVariant] = useState<Variant | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const generationRef = useRef(0);
  const lastPhotoRef = useRef(-1);
  const lastThemeRef = useRef(-1);
  const lastLayoutRef = useRef(-1);

  const generateNewCreative = useCallback(() => {
    setLoading(true);
    const photoIndex = differentRandom(PHOTOS.length, lastPhotoRef.current);
    const themeIndex = differentRandom(THEMES.length, lastThemeRef.current);
    const layoutIndex = differentRandom(3, lastLayoutRef.current);
    lastPhotoRef.current = photoIndex;
    lastThemeRef.current = themeIndex;
    lastLayoutRef.current = layoutIndex;

    setVariant({
      photoIndex,
      themeIndex,
      layoutIndex,
      creative: {
        title: "TENHA SEU PRÓPRIO SISTEMA WEB, APP MOBILE, SOFTWARE OU APLICATIVO",
        price: { value: PRICE, annual: false },
        extra: "A PARTIR DE • PAGAMENTO ÚNICO",
        background: THEMES[themeIndex].base,
      },
    });
  }, []);

  useEffect(() => {
    generateNewCreative();
  }, [generateNewCreative]);

  useEffect(() => {
    if (!variant || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setLoading(false);
      return;
    }
    canvas.width = SIZE;
    canvas.height = SIZE;
    let active = true;
    const currentGeneration = ++generationRef.current;

    const finish = (image?: HTMLImageElement) => {
      if (!active || currentGeneration !== generationRef.current) return;
      drawArtwork(ctx, variant, image);
      setLoading(false);
    };

    // A imagem é carregada com CORS para permitir exportar o Canvas.
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => finish(image);
    image.onerror = () => finish();
    image.src = PHOTOS[variant.photoIndex];

    // Evita deixar a interface travada quando o servidor de fotos não responde.
    const timeout = window.setTimeout(() => finish(), 10000);
    return () => {
      active = false;
      window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
    };
  }, [variant]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;
    try {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `criativo_sistema_a_partir_de_499_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      onShowToast("Criativo baixado com sucesso!", "success");
    } catch (error) {
      console.error("Falha ao exportar o anúncio:", error);
      onShowToast("Não foi possível baixar a imagem. Tente gerar outra arte.", "info");
    }
  };

  return (
    <div className="bg-white/60 border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-900">
            Gerador de Criativos
          </h2>
        </div>
        <button
          type="button"
          onClick={generateNewCreative}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          GERAR OUTRO CRIATIVO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50/60 border border-orange-100 rounded-xl space-y-3">
              <span className="text-[10px] font-bold text-orange-700 tracking-wider uppercase font-mono">
                Informações da peça
              </span>
              <p className="text-sm font-semibold text-slate-800">
                Tenha seu próprio sistema web, app mobile, software ou aplicativo
              </p>
              <p className="text-sm text-slate-700">
                A partir de <strong>R$ 499,00</strong> — pagamento único
              </p>
              <p className="text-xs text-slate-500">
                Foto colorida, texto grande e variação automática de composição.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={loading || !variant}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 py-3 px-5 rounded-xl text-xs md:text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              <Download className="w-[18px] h-[18px]" />
              BAIXAR ARTE HD (PNG)
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[380px]">
          {loading && (
            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[4px] flex flex-col items-center justify-center z-10 rounded-2xl">
              <div className="relative flex items-center justify-center mb-4">
                <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
                <ImageIcon className="w-5 h-5 text-orange-600 absolute animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Montando novo criativo...</p>
            </div>
          )}
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
