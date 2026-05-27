import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm w-full bg-white rounded-xl shadow-xl border border-slate-100 p-4 pr-10 flex items-start gap-3 transition-all">
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-blue-500" />
        )}
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          {type === 'success' ? 'Sucesso' : 'Notificação'}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5 leading-normal">
          {message}
        </p>
      </div>
      
      <button
        onClick={onClose}
        className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Styled slide-in style tag direct implementation to avoid custom animations failure */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
