import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const { message, type } = toast;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border shadow-lg ${config.bg} transition-all duration-300 animate-slide-in`}
    >
      <div className="flex items-center gap-3 pr-2">
        {config.icon}
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 transition-colors focus:outline-none"
      >
        <X className="w-4 h-4 text-slate-500 hover:text-slate-700" />
      </button>
    </div>
  );
};

export default Toast;
