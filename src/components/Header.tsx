import React from 'react';
import { ChefHat, ExternalLink, Activity, Sparkles, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <ChefHat className="w-5.5 h-5.5" />
            </div>
            
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-display font-bold text-slate-900 tracking-tight">Dulivi</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-orange-100 text-orange-700 uppercase">SaaS</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-none mt-0.5">Cardápio Digital Inteligente</p>
            </div>
          </div>

          {/* Nav pills */}
          <nav className="hidden md:flex items-center gap-1.5">
            <a 
              href="#divulgacao" 
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-orange-500" />
              <span>Copy Divulgação</span>
            </a>
            
            <a 
              href="#criativos" 
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gerador de Criativos</span>
            </a>

            <a 
              href="#leads" 
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>Prospectar Cidades</span>
            </a>
          </nav>

          {/* External platform link */}
          <div className="flex items-center gap-3">
            <a
              href="https://dulivi.com.br"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/90 py-2.5 px-4 rounded-xl border border-slate-200/30 transition-all cursor-pointer"
            >
              <span>Ir para dulivi.com.br</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
