import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, to }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
      badge: 'bg-blue-100 text-blue-800'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
      badge: 'bg-amber-100 text-amber-800'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800',
      badge: 'bg-rose-100 text-rose-800'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800',
      badge: 'bg-indigo-100 text-indigo-800'
    }
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  const cardContent = (
    <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-start justify-between transition-all duration-200 ${to ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}`}>
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {value !== undefined && value !== null ? value : 0}
        </h3>
        {subtitle && (
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 pt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className={`p-3.5 rounded-2xl border ${selectedColor.bg}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{cardContent}</Link>;
  }

  return cardContent;
};

export default StatCard;
