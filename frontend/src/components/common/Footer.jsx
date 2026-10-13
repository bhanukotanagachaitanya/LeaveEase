import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-6 px-6 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="LeaveEase" className="w-6 h-6 object-contain" />
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            LeaveEase
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Enterprise HRMS</span>
        </Link>

        <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400 font-medium">
          <Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Terms & Conditions
          </Link>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} LeaveEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
