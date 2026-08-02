import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Register = () => {
  return (
    <div className="text-center space-y-4">
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
        <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <h3 className="text-sm font-bold">Public Registration Disabled</h3>
        <p className="mt-1 text-slate-600">
          In <strong>LeaveEase</strong>, employee accounts are provisioned exclusively by Administrators.
        </p>
      </div>

      <p className="text-xs text-slate-500">
        Please contact your HR department or Administrator to receive your employee account credentials.
      </p>

      <div className="pt-4 border-t border-slate-100">
        <Link
          to="/login"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
