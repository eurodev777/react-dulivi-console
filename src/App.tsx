import React, { useState } from 'react';
import Header from './components/Header';
import CopySection from './components/CopySection';
import AdCreativeGenerator from './components/AdCreativeGenerator';
import LeadGenerator from './components/LeadGenerator';
import Toast from './components/Toast';
import { ChefHat, ExternalLink, Sparkles, MapPin, Copy, Check } from 'lucide-react';

export default function App() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'info') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-orange-500/10 selection:text-orange-600">
      
      {/* Sleek, Simple Header */}
      <Header />

      {/* Main minimal container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Simple visual presentation card */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pb-4">
          <p className="text-xs font-bold text-orange-600 tracking-wider uppercase font-mono">
            SaaS Dulivi • Painel de Divulgação
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Seu Painel de Marketing Minimalista
          </h1>
          <p className="text-slate-500 text-sm">
            Copie suas copys, gere criativos para Facebook/Instagram e encontre leads nas cidades mapeadas.
          </p>
        </div>

        {/* Section 1: Minimal Copy Tool for Title, Slogan and Description */}
        <section id="divulgacao" className="scroll-mt-24">
          <CopySection onShowToast={triggerToast} />
        </section>

        {/* Section 2: AI Creative Generator */}
        <section id="criativos" className="scroll-mt-24">
          <AdCreativeGenerator onShowToast={triggerToast} />
        </section>

        {/* Section 3: Geolocation Lead Prospector */}
        <section id="leads" className="scroll-mt-24">
          <LeadGenerator onShowToast={triggerToast} />
        </section>

      </main>

      {/* Clean, simple copyright footer without unnecessary elements */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 text-center">
        <div className="max-w-5xl mx-auto px-4 text-slate-400 text-xs font-mono">
          © 2026 Dulivi SaaS • Painel Operacional de Prospecção
        </div>
      </footer>

      {/* Floating Alerts */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
