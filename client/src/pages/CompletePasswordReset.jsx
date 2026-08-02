import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkResetStatus, completePasswordReset } from '../services/passwordResetService';
import { useToast } from '../context/ToastContext';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const CompletePasswordReset = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Password Strength Calculator
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(newPassword);

  const handleCheckPermission = async (e) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      showError('Please enter your Employee ID');
      return;
    }

    setLoading(true);
    try {
      const res = await checkResetStatus(employeeId.trim());
      if (res.success) {
        setVerified(true);
        showSuccess('Approved password reset permission verified!');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'No approved reset request found for this Employee ID');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError('New password and confirmation password do not match');
      return;
    }

    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await completePasswordReset({
        employeeId: employeeId.trim(),
        newPassword
      });
      if (res.success) {
        showSuccess('Password updated successfully! You can now log in.');
        navigate('/login');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to complete password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Password</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {!verified
            ? 'Verify your approved reset permission with your Employee ID'
            : 'Set a strong new password for your account'}
        </p>
      </div>

      {!verified ? (
        <form onSubmit={handleCheckPermission} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. EMP101"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Checking Approval...' : 'Verify Reset Permission'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      ) : (
        <form onSubmit={handleCompleteReset} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              New Password *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />

            {/* Password Strength Indicator Meter */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strength >= 1 ? (strength <= 2 ? 'bg-rose-500' : strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'} flex-1`}></div>
                  <div className={`h-full ${strength >= 2 ? (strength <= 2 ? 'bg-rose-500' : strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'} flex-1`}></div>
                  <div className={`h-full ${strength >= 3 ? (strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'} flex-1`}></div>
                  <div className={`h-full ${strength >= 4 ? 'bg-emerald-500' : 'bg-transparent'} flex-1`}></div>
                </div>
                <p className="text-[10px] font-bold text-slate-500">
                  Strength:{' '}
                  <span className={strength <= 2 ? 'text-rose-500' : strength <= 3 ? 'text-amber-500' : 'text-emerald-500'}>
                    {strength <= 2 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong'}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
            {!loading && <CheckCircle className="w-4 h-4" />}
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

export default CompletePasswordReset;
