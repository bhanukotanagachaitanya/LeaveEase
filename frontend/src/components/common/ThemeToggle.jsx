import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none shadow-sm flex items-center justify-center border border-slate-300/50 dark:border-slate-700/50"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme Mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transform rotate-0 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 dark:text-slate-200 transform rotate-0 transition-transform duration-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
