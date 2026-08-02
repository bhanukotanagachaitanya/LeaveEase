import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { setupFirstAdmin } from '../services/authService';
import { ShieldCheck, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';

const SetupAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: 'ADM001',
    email: '',
    department: 'Human Resources',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.employeeId.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      showError('Please fill in all required Administrator details');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Password and Password Confirmation do not match');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await setupFirstAdmin(formData);
      if (res.success) {
        login(res.data.user, res.data.token);
        showSuccess('Primary Administrator initialized successfully!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to initialize Administrator account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-xl mb-3">
          LE
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">System Initialization</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Create the primary Administrator account for LeaveEase Enterprise HRMS
        </p>
      </div>

      <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs mb-6 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">One-Time Setup Requirement:</span>
          <p className="text-[11px] mt-0.5 text-amber-800 dark:text-amber-400 leading-relaxed">
            After this initial administrator is registered, this initialization page will be permanently locked.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter Administrator Full Name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Administrator ID *
          </label>
          <input
            type="text"
            required
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            placeholder="ADM001"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold uppercase font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="admin@company.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Department *
          </label>
          <input
            type="text"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Human Resources"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Password *
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
          className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? 'Initializing System...' : 'Create Administrator Account'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};

export default SetupAdmin;
