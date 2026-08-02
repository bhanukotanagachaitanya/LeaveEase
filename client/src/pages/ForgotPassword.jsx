import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSecurityQuestion, resetPasswordWithSecurity } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { KeyRound, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Employee ID input, 2: Security Verification & Reset
  const [employeeId, setEmployeeId] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleFetchQuestion = async (e) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      showError('Please enter your Employee ID');
      return;
    }

    setLoading(true);
    try {
      const res = await getSecurityQuestion(employeeId.trim());
      if (res.success) {
        setQuestionData(res.data);
        setStep(2);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Employee ID not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!securityAnswer.trim()) {
      showError('Please answer the security verification question');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('New password and confirmation password do not match');
      return;
    }

    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithSecurity({
        employeeId: questionData.employeeId,
        securityAnswer,
        newPassword
      });
      if (res.success) {
        showSuccess('Password reset successfully! Please sign in with your new password.');
        navigate('/login');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">Forgot Password</h3>
        <p className="text-xs text-slate-500 mt-1">
          {step === 1
            ? 'Enter your Employee ID to retrieve verification prompt'
            : `Security Verification for ${questionData?.name}`}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleFetchQuestion} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Employee ID *
            </label>
            <input
              type="text"
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. EMP101"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Verifying Employee ID...' : 'Continue to Security Check'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-xs text-brand-900">
            <span className="font-bold block uppercase text-[10px] text-brand-600 mb-0.5">
              Security Question
            </span>
            <p className="font-semibold">{questionData?.securityQuestion}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Security Answer *
            </label>
            <input
              type="text"
              required
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter your security answer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              New Password *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-lg disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Set New Password'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <Link
          to="/login"
          className="text-xs font-bold text-slate-600 hover:text-slate-800 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
