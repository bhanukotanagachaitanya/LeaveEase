import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-col items-center justify-center">
      <a href="/" className="flex items-center justify-center gap-2.5 group cursor-pointer">
        <img src="/logo.png" alt="LeaveEase" className="w-7 h-7 object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
        <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-800 to-brand-600 dark:from-white dark:via-brand-300 dark:to-brand-400 bg-clip-text text-transparent">
          leaveease
        </span>
      </a>
    </footer>
  );
};

export default Footer;
