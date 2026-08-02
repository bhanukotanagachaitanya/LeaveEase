import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const options = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor }
  ];

  const currentOption = options.find((o) => o.id === theme) || options[0];
  const Icon = currentOption.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        title="Switch Theme"
      >
        <Icon className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-50 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          {options.map((opt) => {
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold ${
                  theme === opt.id
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <OptIcon className="w-4 h-4" />
                <span>{opt.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
