import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Download,
  RefreshCw,
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
    "CARDÁPIO DIGITAL",
    "ANÚNCIOS ON-LINE",
    "TRÁFEGO PAGO",
    "ANÚNCIOS POR R$300 MENSAL",
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
      annual: false,
    },
  ];

  const extras = [
    "+ Robô para WhatsApp",
    "+ ANÚNCIOS ONLINE",
    "+ Tráfego Pago",
    "+ IA para Restaurantes",
    "+ Atendente Virtual",
    "+ Pagamento Online",
  ];

  // Descrição fixa do novo plano de anúncios
  const anunciosDescricao =
    "TRAFEGO PAGO - 8 POSTS POR MES - SITE COMPLETO HOSPEDAGEM INCLUSA";

  // Paleta bem maior para cada criativo sair com uma identidade diferente
  const backgrounds = [
    // Pastéis
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
    "#E2CBF7", "#FFC4E1", "#C4FAF8", "#FFD6E0", "#D7F9F1",
    "#FDE2E4", "#E2ECE9", "#BEE1E6", "#F0EFEB", "#DFE7FD",

    // Vermelhos, rosas e magentas
    "#E63946", "#D90429", "#EF233C", "#FF0054", "#FF006E",
    "#E91E63", "#C9184A", "#A4133C", "#B5179E", "#F72585",
    "#9D4EDD", "#C77DFF", "#FF4D6D", "#FF758F", "#FF8FA3",

    // Laranjas, amarelos e dourados
    "#FB8500", "#FF7B00", "#FF8800", "#FF9505", "#F48C06",
    "#F77F00", "#FFB703", "#FFC300", "#FFD60A", "#FFEA00",
    "#E9C46A", "#F4A261", "#DDA15E", "#E85D04", "#DC2F02",

    // Verdes
    "#06D6A0", "#00B894", "#2A9D8F", "#40916C", "#52B788",
    "#74C69D", "#95D5B2", "#2D6A4F", "#1B4332", "#4CAF50",
    "#43AA8B", "#90BE6D", "#A7C957", "#588157", "#3A5A40",

    // Azuis e cianos
    "#00B4D8", "#0096C7", "#0077B6", "#023E8A", "#03045E",
    "#2196F3", "#3A86FF", "#4361EE", "#4895EF", "#4CC9F0",
    "#118AB2", "#277DA1", "#577590", "#8ECAE6", "#219EBC",

    // Roxos
    "#7209B7", "#560BAD", "#480CA8", "#3A0CA3", "#8338EC",
    "#7B2CBF", "#5A189A", "#4A148C", "#6A4C93", "#8E44AD",
    "#9C27B0", "#6C63FF", "#5E60CE", "#6930C3", "#7400B8",

    // Escuros
    "#0B132B", "#1C2541", "#1A1A2E", "#16213E", "#0F3460",
    "#111827", "#1F2937", "#0F172A", "#18181B", "#27272A",
    "#2C3E50", "#263238", "#212121", "#001219", "#14213D",

    // Terrosos e sofisticados
    "#264653", "#E76F51", "#BC6C25", "#9C6644", "#7F5539",
    "#B08968", "#6F4E37", "#8D6E63", "#A98467", "#6B705C",
    "#A5A58D", "#CB997E", "#D4A373", "#B56576", "#355070",

    // Neon / alto impacto
    "#FF003C", "#00F5D4", "#00BBF9", "#F15BB5", "#FEE440",
    "#9B5DE5", "#00F0FF", "#39FF14", "#FF3131", "#FF10F0",
    "#7DF9FF", "#CCFF00", "#FF5F1F", "#FE019A", "#7CFF01",
  ];

  const lastBackgroundRef = useRef<string>("");

  const getRandomBackground = () => {
    let next = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // Evita repetir exatamente a mesma cor em dois criativos seguidos
    if (backgrounds.length > 1) {
      while (next === lastBackgroundRef.current) {
        next = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      }
    }

    lastBackgroundRef.current = next;
    return next;
  };

  const generateNewCreative = () => {
    setLoading(true);
    setAdLayoutType((current) => current + 1);

    const title = titles[Math.floor(Math.random() * titles.length)];

    // Novo pacote mensal: título e descrição SEMPRE fixos
    if (title === "ANÚNCIOS POR R$300 MENSAL") {
      setCreative({
        title,
        price: {
          value: "R$ 300,00",
          annual: false,
        },
        extra: anunciosDescricao,
        background: getRandomBackground(),
      });

      return;
    }

    // Mantém os planos que já existiam
    if (title === "ANÚNCIOS ON-LINE" || title === "TRÁFEGO PAGO") {
      setCreative({
        title,
        price: {
          value: "R$ 97,00",
          annual: false,
        },
        extra: "Plano de 15 dias",
        background: getRandomBackground(),
      });

      return;
    }

    // DELIVERY e CARDÁPIO DIGITAL continuam funcionando normalmente
    setCreative({
      title,
      price: prices[Math.floor(Math.random() * prices.length)],
      extra: extras[Math.floor(Math.random() * extras.length)],
      background: getRandomBackground(),
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
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
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

  const drawMinimalAd = (
    ctx: CanvasRenderingContext2D,
    data: CreativeData,
  ) => {
    ctx.fillStyle = data.background;
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // Sombra + contorno para manter boa leitura em qualquer cor de fundo
    ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 18;
    ctx.lineJoin = "round";

    const drawTextWithOutline = (
      text: string,
      x: number,
      y: number,
    ) => {
      ctx.strokeText(text, x, y);
      ctx.shadowColor = "transparent";
      ctx.fillText(text, x, y);
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    };

    // Desenha texto quebrando automaticamente quando ficar largo demais
    const drawWrappedText = (
      text: string,
      x: number,
      startY: number,
      maxWidth: number,
      lineHeight: number,
    ) => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;

        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      lines.forEach((line, index) => {
        drawTextWithOutline(line, x, startY + index * lineHeight);
      });

      return lines.length;
    };

    // ==========================================================
    // NOVO PACOTE: ANÚNCIOS POR R$300 MENSAL
    // ==========================================================
    if (data.title === "ANÚNCIOS POR R$300 MENSAL") {
      ctx.fillStyle = "#FFFFFF";

      ctx.font = '900 145px "Roboto"';
      drawTextWithOutline("ANÚNCIOS", 540, 185);

      ctx.fillStyle = "#FFE600";
      ctx.font = '900 155px "Roboto"';
      drawTextWithOutline("POR R$300", 540, 360);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = '900 130px "Roboto"';
      drawTextWithOutline("MENSAL", 540, 515);

      // Faixa visual para separar título da descrição
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.fillRect(70, 590, 940, 385);

      // A descrição é sempre exatamente a mesma no dado do criativo.
      // No canvas, os trechos são quebrados em linhas para caber bem.
      const descriptionParts = data.extra.split(" - ");

      ctx.fillStyle = "#FFFFFF";
      ctx.font = '900 62px "Roboto"';

      let currentY = 690;

      descriptionParts.forEach((part) => {
        const lineCount = drawWrappedText(
          part,
          540,
          currentY,
          860,
          72,
        );

        currentY += lineCount * 72 + 18;
      });

      ctx.shadowColor = "transparent";
      ctx.lineWidth = 1;
      return;
    }

    // ==========================================================
    // DEMAIS SERVIÇOS
    // ==========================================================
    ctx.fillStyle = "#FFFFFF";
    ctx.font = '900 105px "Roboto"';
    drawTextWithOutline("Seu", 540, 135);

    if (data.title === "CARDÁPIO DIGITAL") {
      ctx.font = '900 145px "Roboto"';
      drawTextWithOutline("CARDÁPIO", 540, 300);

      ctx.fillStyle = "#FFE600";
      ctx.font = '900 130px "Roboto"';
      drawTextWithOutline("DIGITAL", 540, 440);
    } else {
      ctx.font = '900 130px "Roboto"';
      drawWrappedText(data.title, 540, 325, 900, 135);
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.font = '720 92px "Roboto"';
    drawTextWithOutline(
      data.price.value === "GRÁTIS" ? "crie" : "por apenas",
      540,
      570,
    );

    ctx.fillStyle = "#FF003C";
    ctx.font = '900 170px "Roboto"';
    drawTextWithOutline(data.price.value, 540, 750);

    if (data.price.value !== "GRÁTIS") {
      ctx.fillStyle = "#00D9FF";
      ctx.font = '800 58px "Roboto"';
      drawTextWithOutline(
        data.price.annual ? "mensais no plano anual" : "mensais",
        540,
        825,
      );
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.font = '900 64px "Roboto"';
    drawWrappedText(data.extra, 540, 950, 900, 70);

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