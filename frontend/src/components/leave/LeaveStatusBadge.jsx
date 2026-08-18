import React from 'react';
import { Clock, CheckCircle2, XCircle, Slash } from 'lucide-react';

const LeaveStatusBadge = ({ status }) => {
  const configs = {
    Pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
    },
    Approved: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
    },
    Rejected: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-500" />
    },
    Cancelled: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <Slash className="w-3.5 h-3.5 mr-1 text-slate-400" />
    }
  };

  const config = configs[status] || configs.Pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      {config.icon}
      {status}
    </span>
  );
};

export default LeaveStatusBadge;
