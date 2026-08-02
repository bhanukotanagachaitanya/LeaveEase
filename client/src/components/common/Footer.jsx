import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-medium bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <p>
        &copy; {new Date().getFullYear()} LeaveEase Technologies Pvt. Ltd. &bull; Enterprise Leave Management System &bull; <span className="font-bold text-brand-600 dark:text-brand-400">v2.0</span>
      </p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
        "Smart Leave Management for Modern Workplaces"
      </p>
    </footer>
  );
};

export default Footer;
