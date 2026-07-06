import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  RefreshCw,
  Copy,
  Check,
  Users,
  ShieldAlert,
  FileText,
  ClipboardCopy,
} from "lucide-react";

interface LeadGeneratorProps {
  onShowToast: (message: string, type: "success" | "info") => void;
}

export default function LeadGenerator({ onShowToast }: LeadGeneratorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCityName, setCopiedCityName] = useState<string | null>(null);

  useEffect(() => {
    const savedCity = localStorage.getItem("copiedCity");
    if (savedCity) {
      setCopiedCityName(savedCity);
    }
  }, []);

  // Individual copy handler
  const handleCopyCity = async (cityName: string) => {
    try {
      await navigator.clipboard.writeText(cityName);

      setCopiedCityName(cityName);
      localStorage.setItem("copiedCity", cityName);

      onShowToast(
        `Cidade "${cityName}" copiada para a área de transferência!`,
        "success",
      );
    } catch (err) {
      onShowToast("Erro ao copiar. Copie manualmente os dados.", "info");
    }
  };

  const cities = [
    "São Paulo",
    "Rio de Janeiro",
    "Brasília",
    "Belo Horizonte",
    "Curitiba",
    "Fortaleza",
    "Salvador",
    "Goiânia",
    "Campinas",
    "Recife",
    "Manaus",
    "Porto Alegre",
    "Guarulhos",
    "Belém",
    "São Bernardo do Campo",
    "Santo André",
    "Osasco",
    "São José dos Campos",
    "Ribeirão Preto",
    "Sorocaba",
    "Joinville",
    "Florianópolis",
    "São José do Rio Preto",
    "Jundiaí",
    "Santos",
    "Uberlândia",
    "Londrina",
    "Maringá",
    "Caxias do Sul",
    "Blumenau",
    "Vitória",
    "Campo Grande",
    "Cuiabá",
    "São Luís",
    "Maceió",
    "Natal",
    "João Pessoa",
    "Aracaju",
    "Teresina",
    "Feira de Santana",
    "Juiz de Fora",
    "Piracicaba",
    "Bauru",
    "Pelotas",
    "Vila Velha",
    "Anápolis",
    "Uberaba",
    "Franca",
    "Limeira",
    "Taubaté",
    "Porto Velho",
    "Boa Vista",
    "Macapá",
    "Rio Branco",
    "Parauapebas",
    "Marabá",
    "Santarém",
    "Juazeiro do Norte",
    "Petrolina",
    "Caruaru",
    "Olinda",
    "Paulista",
    "Campina Grande",
    "Caucaia",
    "Vitória da Conquista",
    "Juazeiro",
    "Imperatriz",
    "Parnamirim",
    "Mossoró",
    "Ponta Grossa",
    "Cascavel",
    "Itajaí",
    "São José",
    "Santa Maria",
    "Canoas",
    "Gravataí",
    "Chapecó",
    "Niterói",
    "Duque de Caxias",
    "Nova Iguaçu",
    "Belford Roxo",
    "Betim",
    "Contagem",
    "Montes Claros",
    "Mauá",
    "Diadema",
    "Carapicuíba",
    "Itaquaquecetuba",
    "Barueri",
    "Suzano",
    "Sumaré",
    "Guarujá",
    "Cotia",
    "Taboão da Serra",
    "Araraquara",
    "Divinópolis",
    "Itapevi",
    "Rondonópolis",
    "Várzea Grande",
    "Dourados",
  ];

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/60 border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-900">
              Gerador de Leads por Cidade
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Info Banner Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* COPIADO */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100/30 rounded-xl p-4 flex items-center gap-4">
            <div>
              <span className="text-[10px] text-emerald-650 font-bold uppercase tracking-wide">
                Último copiado
              </span>
              <h3 className="text-base font-bold text-slate-800 leading-tight">
                {copiedCityName}
              </h3>
            </div>
          </div>
        </div>

        {/* Search bar inside prospecting panel */}
        {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar cidades ou oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 placeholder-slate-400 shadow-sm transition-all focus:ring-1 focus:ring-emerald-500"
            />
          </div> */}

        {/* List grid of cities */}
        <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Cidade</div>
            <div className="col-span-7 text-right">Ações</div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[1300px] overflow-y-auto">
            {filteredCities.map((city) => (
              <div
                key={city}
                onClick={() => handleCopyCity(city)}
                className="cursor-pointer grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center px-5 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="col-span-8">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-850 leading-tight">
                    {city}
                  </h4>

                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                    Clique para copiar o nome da cidade
                  </p>
                </div>

                <div className="col-span-4 text-left sm:text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCity(city);
                    }}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${copiedCityName === city
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                  >
                    {copiedCityName === city ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copiada!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
