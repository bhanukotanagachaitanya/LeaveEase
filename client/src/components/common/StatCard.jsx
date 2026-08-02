import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colorVariants = {
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      border: 'border-l-blue-600',
      text: 'text-blue-900'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      border: 'border-l-amber-500',
      text: 'text-amber-900'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      border: 'border-l-emerald-600',
      text: 'text-emerald-900'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      border: 'border-l-rose-500',
      text: 'text-rose-900'
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      border: 'border-l-indigo-600',
      text: 'text-indigo-900'
    }
  };

  const scheme = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle border-l-4 ${scheme.border} flex items-center justify-between hover:shadow-md transition-all duration-200`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value ?? 0}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3.5 rounded-2xl ${scheme.bg} flex items-center justify-center shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
