import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createResetRequest } from '../services/passwordResetService';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

const ForgotPasswordRequest = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId.trim() || !formData.email.trim() || !formData.reason.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await createResetRequest(formData);
      if (res.success) {
        setSubmitted(true);
        showSuccess('Password reset request submitted for Administrator review.');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit password reset request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request Password Reset</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Submit your reset request for Administrator review and approval
        </p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Request Submitted!</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your request has been sent to the Administrator. Once approved, you will be authorized to set a new password.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/complete-reset"
              className="py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Check Approved Request & Set Password
            </Link>
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="e.g. EMP101"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Registered Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="emp1@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Reason for Reset *
            </label>
            <textarea
              rows={3}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Provide context for why you are requesting a password reset..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Submitting Request...' : 'Submit Reset Request'}
            {!loading && <Send className="w-4 h-4" />}
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          to="/login"
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;
