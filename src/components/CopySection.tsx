
import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Download,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { CreativeData } from "../types";

interface AdCreativeGeneratorProps {
  onShowToast: (
    message: string,
    type: "success" | "info"
  ) => void;
}

const SIZE = 1080;

const TITLES = [
  "DESENVOLVIMENTO DE SISTEMAS",
  "TENHA SEU APLICATIVO",
  "TENHA SEU APP",
];

const WHATSAPP = "13 99102-7026";
const EMAIL = "joaojpmoreira25@gmail.com";

const PHOTOS = [
  "photo-1498050108023-c5249f4df085",
  "photo-1519389950473-47ba0277781c",
  "photo-1555066931-4365d14bab8c",
  "photo-1460925895917-afdab827c52f",
  "photo-1522071820081-009f0129c71c",
  "photo-1516321318423-f06f85e504b3",
  "photo-1551288049-bebda4e38f71",
];

const THEMES = [
  {
    base: "#2936E8",
    overlay: "rgba(24, 36, 164, 0.55)",
    accent: "#FFE600",
  },
  {
    base: "#E92385",
    overlay: "rgba(174, 18, 95, 0.55)",
    accent: "#FFE600",
  },
  {
    base: "#079ED1",
    overlay: "rgba(0, 105, 174, 0.55)",
    accent: "#FFE600",
  },
  {
    base: "#792ADE",
    overlay: "rgba(92, 20, 170, 0.58)",
    accent: "#FFE600",
  },
  {
    base: "#F05A19",
    overlay: "rgba(167, 48, 10, 0.55)",
    accent: "#FFE600",
  },
  {
    base: "#039F85",
    overlay: "rgba(0, 105, 85, 0.58)",
    accent: "#FFE600",
  },
];

const getDifferentIndex = (
  length: number,
  previous: number
) => {
  if (length <= 1) return 0;

  let next = Math.floor(Math.random() * length);

  while (next === previous) {
    next = Math.floor(Math.random() * length);
  }

  return next;
};

const drawCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
) => {
  const scale = Math.max(
    SIZE / img.naturalWidth,
    SIZE / img.naturalHeight
  );

  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;

  ctx.drawImage(
    img,
    (SIZE - width) / 2,
    (SIZE - height) / 2,
    width,
    height
  );
};

const drawFallback = (
  ctx: CanvasRenderingContext2D,
  background: string
) => {
  const gradient = ctx.createLinearGradient(
    0,
    0,
    SIZE,
    SIZE
  );

  gradient.addColorStop(0, background);
  gradient.addColorStop(1, "#10152E");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.save();
  ctx.globalAlpha = 0.18;

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(950, 100, 400, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#00FFFF";
  ctx.beginPath();
  ctx.arc(100, 970, 400, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

export default function AdCreativeGenerator({
  onShowToast,
}: AdCreativeGeneratorProps) {
  const [loading, setLoading] = useState(true);

  const [creative, setCreative] =
    useState<CreativeData | null>(null);

  const [bgImageUrl, setBgImageUrl] = useState("");

  const [layoutType, setLayoutType] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(
    null
  );

  const lastTitle = useRef(-1);
  const lastPhoto = useRef(-1);
  const lastTheme = useRef(-1);

  const generateNewCreative = () => {
    setLoading(true);

    const titleIndex = getDifferentIndex(
      TITLES.length,
      lastTitle.current
    );

    const photoIndex = getDifferentIndex(
      PHOTOS.length,
      lastPhoto.current
    );

    const nextTheme = getDifferentIndex(
      THEMES.length,
      lastTheme.current
    );

    lastTitle.current = titleIndex;
    lastPhoto.current = photoIndex;
    lastTheme.current = nextTheme;

    setThemeIndex(nextTheme);

    setLayoutType((current) => (current + 1) % 3);

    setCreative({
      title: TITLES[titleIndex],
      price: {
        value: "R$ 499,00",
        annual: false,
      },
      extra: `WhatsApp: ${WHATSAPP} | ${EMAIL}`,
      background: THEMES[nextTheme].base,
    });

    setBgImageUrl(
      `https://images.unsplash.com/${PHOTOS[photoIndex]}?auto=format&fit=crop&w=1400&q=85`
    );
  };

  useEffect(() => {
    generateNewCreative();
  }, []);

  useEffect(() => {
    if (!creative) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = SIZE;
    canvas.height = SIZE;

    let cancelled = false;

    const theme = THEMES[themeIndex];

    const drawText = (
      text: string,
      x: number,
      y: number,
      size: number,
      color: string,
      maxWidth = 950,
      weight = 900
    ) => {
      ctx.save();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = `${weight} ${size}px Arial, sans-serif`;

      ctx.fillStyle = color;

      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 13;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;

      ctx.strokeStyle = "rgba(0,0,0,0.65)";
      ctx.lineWidth = Math.max(4, size * 0.075);
      ctx.lineJoin = "round";

      ctx.strokeText(text, x, y, maxWidth);
      ctx.fillText(text, x, y, maxWidth);

      ctx.restore();
    };

    const drawTitle = (title: string) => {
      const titleColor = "#FFFFFF";

      if (title === "DESENVOLVIMENTO DE SISTEMAS") {
        drawText(
          "DESENVOLVIMENTO",
          540,
          215,
          99,
          titleColor,
          985
        );

        drawText(
          "DE SISTEMAS",
          540,
          345,
          119,
          theme.accent,
          985
        );
      } else if (title === "TENHA SEU APLICATIVO") {
        drawText(
          "TENHA SEU",
          540,
          205,
          119,
          titleColor
        );

        drawText(
          "APLICATIVO",
          540,
          345,
          145,
          theme.accent,
          980
        );
      } else {
        drawText(
          "TENHA SEU",
          540,
          205,
          129,
          titleColor
        );

        drawText(
          "APP",
          540,
          345,
          205,
          theme.accent
        );
      }
    };

    const drawPrice = () => {
      const priceY =
        layoutType === 0
          ? 655
          : layoutType === 1
            ? 630
            : 680;

      drawText(
        "A PARTIR DE",
        540,
        priceY - 112,
        72,
        "#FFFFFF"
      );

      drawText(
        "R$ 499,00",
        540,
        priceY,
        170,
        theme.accent,
        990
      );

      drawText(
        "PAGAMENTO ÚNICO",
        540,
        priceY + 118,
        67,
        "#FFFFFF",
        960
      );
    };

    const drawContact = () => {
      ctx.save();

      const gradient = ctx.createLinearGradient(
        0,
        855,
        0,
        1080
      );

      gradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      gradient.addColorStop(
        1,
        "rgba(0,0,0,0.85)"
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 845, SIZE, 235);

      ctx.restore();

      drawText(
        `WhatsApp: ${WHATSAPP}`,
        540,
        936,
        64,
        "#FFFFFF",
        950
      );

      drawText(
        EMAIL,
        540,
        1020,
        43,
        theme.accent,
        965,
        800
      );
    };

    const render = (img?: HTMLImageElement) => {
      if (cancelled) return;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Fundo colorido como alternativa.
      drawFallback(ctx, creative.background);

      // Foto permanece visível por trás do texto.
      if (img) {
        drawCover(ctx, img);

        ctx.fillStyle = theme.overlay;
        ctx.fillRect(0, 0, SIZE, SIZE);
      }

      // Escurecimento para melhorar a leitura.
      const overlay = ctx.createLinearGradient(
        0,
        0,
        0,
        SIZE
      );

      overlay.addColorStop(
        0,
        "rgba(0,0,0,0.30)"
      );

      overlay.addColorStop(
        0.55,
        "rgba(0,0,0,0.18)"
      );

      overlay.addColorStop(
        1,
        "rgba(0,0,0,0.45)"
      );

      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Detalhes modernos.
      ctx.save();

      ctx.strokeStyle =
        "rgba(255,255,255,0.24)";

      ctx.lineWidth = 4;

      ctx.strokeRect(34, 34, 1012, 1012);

      ctx.restore();

      drawTitle(creative.title);
      drawPrice();
      drawContact();

      setLoading(false);
    };

    if (!bgImageUrl) {
      render();
      return () => {
        cancelled = true;
      };
    }

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      render(img);
    };

    img.onerror = () => {
      console.warn(
        "Foto indisponível. Usando fundo colorido."
      );

      render();
    };

    img.src = bgImageUrl;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [
    creative,
    bgImageUrl,
    layoutType,
    themeIndex,
  ]);

  const handleDownloadImage = () => {
    if (loading) return;

    try {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const dataUrl = canvas.toDataURL(
        "image/png"
      );

      const link = document.createElement("a");

      link.download =
        `anuncio_sistemas_${Date.now()}.png`;

      link.href = dataUrl;

      document.body.appendChild(link);

      link.click();
      link.remove();

      onShowToast(
        "Criativo baixado com sucesso!",
        "success"
      );
    } catch (error) {
      console.error(error);

      onShowToast(
        "Não foi possível baixar a imagem.",
        "info"
      );
    }
  };

  return (
    <div className="bg-white/60 border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
            Gerador de Criativos com IA
          </h2>
        </div>

        <button
          onClick={generateNewCreative}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 cursor-pointer"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              loading ? "animate-spin" : ""
            }`}
          />

          GERAR OUTRO CRIATIVO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-3">
              <span className="text-[10px] font-bold text-orange-700 tracking-wider uppercase">
                Informações da Peça
              </span>

              {creative ? (
                <div className="space-y-3">
                  <div className="text-base font-bold text-slate-900">
                    {creative.title}
                  </div>

                  <div className="text-xs text-slate-600">
                    A PARTIR DE
                  </div>

                  <div className="text-3xl font-black text-orange-600">
                    R$ 499,00
                  </div>

                  <div className="text-xs font-bold text-slate-700">
                    PAGAMENTO ÚNICO
                  </div>

                  <div className="border-t border-orange-100 pt-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-700 break-words">
                      WhatsApp: {WHATSAPP}
                    </div>

                    <div className="text-xs text-slate-600 break-all">
                      {EMAIL}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">
                      1080 × 1080
                    </span>

                    <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">
                      PNG HD
                    </span>

                    <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">
                      Layout {layoutType + 1}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-24 animate-pulse bg-slate-200/50 rounded" />
              )}
            </div>

            <button
              onClick={handleDownloadImage}
              disabled={loading || !creative}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 py-3 px-5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 shadow-md cursor-pointer"
            >
              <Download className="w-5 h-5" />

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

              <p className="text-sm font-semibold text-slate-800">
                Gerando nova arte...
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Preparando foto, cores e textos.
              </p>
            </div>
          )}

          <div className="w-full max-w-[420px] aspect-square relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
              style={{
                opacity: loading ? 0.3 : 1,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
