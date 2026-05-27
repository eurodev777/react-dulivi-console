import React, { useState, useEffect } from 'react';
import { Search, MapPin, RefreshCw, Copy, Check, Users, ShieldAlert, FileText, ClipboardCopy } from 'lucide-react';
import { LeadData, CityLead } from '../types';

interface LeadGeneratorProps {
  onShowToast: (message: string, type: 'success' | 'info') => void;
}

export default function LeadGenerator({ onShowToast }: LeadGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCityIndex, setCopiedCityIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Standard initial fallback
  const fallbackLeads: LeadData = {
    state: "São Paulo",
    uf: "SP",
    cities: [
      { name: "São Paulo", metric: "Metrópole gigante, +40 mil pizzarias e miguelarias." },
      { name: "Campinas", metric: "Grande polo tecnológico e acadêmico, alto delivery." },
      { name: "Santos", metric: "Litoral populoso com forte consumo noturno de lanches." },
      { name: "São José dos Campos", metric: "Polo industrial do Vale do Paraíba, ticket médio alto." },
      { name: "Ribeirão Preto", metric: "Capital do agronegócio e forte rede de gastronomia regional." },
      { name: "Sorocaba", metric: "Crescimento contínuo de lanchonetes de bairro e residenciais." },
      { name: "Santo André", metric: "Região do ABC paulista próspera com alta lanchonetes." },
      { name: "São Bernardo do Campo", metric: "Demanda industrial robusta por almoço e janta rápidos." },
      { name: "Osasco", metric: "Grande comércio central e densidade demográfica expressiva." },
      { name: "Guarulhos", metric: "Segunda maior cidade do estado com alta taxa de lanches rápidos." },
      { name: "Piracicaba", metric: "Grande circulação de estudantes universitários ativos." },
      { name: "Jundiaí", metric: "IDH muito alto e público adepto a lanches gourmet e artesanais." },
      { name: "Mogi das Cruzes", metric: "Área metropolitana em expansão veloz com novos restaurantes." },
      { name: "Bauru", metric: "Polo de educação do interior com forte demanda por pizzas de zap." },
      { name: "Barueri", metric: "Bairro nobre de Alphaville com consumo de alto ticket de delivery." },
      { name: "São José do Rio Preto", metric: "Indústrias alimentícias prósperas no noroeste paulista." },
      { name: "Taubaté", metric: "Polo universitário próspero com cultura forte de lanches do zap." },
      { name: "Limeira", metric: "Forte indústria e rotina de pedidos em lanchonetes locais." },
      { name: "Praia Grande", metric: "Polo turístico do litoral com giro alto de pedidos de pizza." },
      { name: "Indaiatuba", metric: "Destaque de IDH e mercado nobre aberto a soluções modernas." }
    ]
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: LeadData = await response.json();
      setLeadData(data);
    } catch (error) {
      console.error(error);
      onShowToast("Erro na API da Gemini. Carregando lista de São Paulo como fallback.", "info");
      setLeadData(fallbackLeads);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Individual copy handler
  const handleCopyCity = async (cityName: string, index: number) => {
    try {
      await navigator.clipboard.writeText(cityName);
      setCopiedCityIndex(index);
      onShowToast(`Cidade "${cityName}" copiada para a área de transferência!`, "success");
      setTimeout(() => setCopiedCityIndex(null), 1500);
    } catch (err) {
      onShowToast("Erro ao copiar. Copie manualmente os dados.", "info");
    }
  };

  // Bulk copy all cities handler
  const handleCopyAll = async () => {
    if (!leadData) return;
    try {
      const allNames = leadData.cities.map(c => c.name).join(', ');
      await navigator.clipboard.writeText(allNames);
      setCopiedAll(true);
      onShowToast(`Lista completa com as 20 cidades do estado copiada!`, "success");
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      onShowToast("Erro ao copiar dados para a planilha.", "info");
    }
  };

  const filteredCities = leadData
    ? leadData.cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.metric.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Escolhe automaticamente estados promissores do Brasil e mapeia 20 grandes polos de lanches para prospecção da Dulivi.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>GERAR OUTRA LISTA</span>
        </button>
      </div>

      {leadData ? (
        <div className="space-y-6">
          {/* Top Info Banner Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl font-bold text-emerald-700 border border-emerald-100">
                {leadData.uf || "SP"}
              </div>
              <div>
                <span className="text-[10px] text-emerald-650 font-bold uppercase tracking-wide">Estado Selecionado</span>
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {leadData.state}
                </h3>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 border border-blue-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Público Filtrado</span>
                <h3 className="text-sm font-semibold text-slate-800">
                  Alta População e Delivery Exponencial
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Mapeamento Geográfico</span>
                <div className="text-xs text-slate-600 font-medium font-mono">{leadData.cities.length} Cidades Listadas</div>
              </div>

              <button
                id="btn-copy-allcities"
                onClick={handleCopyAll}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                  copiedAll
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm cursor-pointer'
                }`}
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Todas copiadas!</span>
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar Lista (Bulk)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search bar inside prospecting panel */}
          <div className="relative">
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
          </div>

          {/* List grid of cities */}
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">UF</div>
              <div className="col-span-4">Cidade</div>
              <div className="col-span-5">Indicativo Comercial / Niche</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>

            {loading ? (
              <div className="p-12 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 items-center animate-pulse">
                    <div className="w-8 h-8 rounded bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-1/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCities.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {filteredCities.map((city, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center px-5 py-4 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* UF badge */}
                    <div className="col-span-1 flex items-center justify-start">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-100/40">
                        {leadData.uf || "SP"}
                      </span>
                    </div>

                    {/* City Name */}
                    <div className="col-span-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-850 leading-tight">
                        {city.name}
                      </h4>
                    </div>

                    {/* Metric info */}
                    <div className="col-span-5">
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-normal">
                        {city.metric}
                      </p>
                    </div>

                    {/* Copy actions */}
                    <div className="col-span-2 text-left sm:text-right">
                      <button
                        onClick={() => handleCopyCity(city.name, idx)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all duration-300 ${
                          copiedCityIndex === idx
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        {copiedCityIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 animate-scale" />
                            <span>Copiada!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-405 flex flex-col items-center justify-center">
                <p className="text-sm font-semibold">Nenhuma cidade localizada.</p>
                <p className="text-xs text-slate-400 mt-1">Tente ajustar a barra de busca acima.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center animate-pulse flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-650">Carregando lista de leads...</p>
        </div>
      )}
    </div>
  );
}
