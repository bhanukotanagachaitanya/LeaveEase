import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../services/authService';
import { getHolidays } from '../services/holidayService';
import { Eye, EyeOff, Calendar, Sparkles, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' | 'admin'
  const [identifier, setIdentifier] = useState(
    localStorage.getItem('remember_identifier') || ''
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('remember_identifier'));

  const [loading, setLoading] = useState(false);
  const [loginSuccessOverlay, setLoginSuccessOverlay] = useState(false);
  const [holidayWidget, setHolidayWidget] = useState(null);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Fetch Public Holiday Widget info
  useEffect(() => {
    const fetchPublicHoliday = async () => {
      try {
        const res = await getHolidays();
        if (res.success) {
          setHolidayWidget({
            todayHoliday: res.data.todayHoliday,
            nextUpcoming: res.data.nextUpcoming
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPublicHoliday();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      showError('Please enter your credentials');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({
        identifier: identifier.trim(),
        password,
        role: activeTab // Strict role validation passed ('employee' or 'admin')
      });

      if (res.success) {
        if (rememberMe) {
          localStorage.setItem('remember_identifier', identifier.trim());
        } else {
          localStorage.removeItem('remember_identifier');
        }

        // Trigger 1.5s Enterprise Login Animation
        setLoginSuccessOverlay(true);
        setTimeout(() => {
          login(res.data.user, res.data.token);

          // Only show Welcome toast if not already shown during this browser session
          const welcomeShown = sessionStorage.getItem('welcome_shown');
          if (!welcomeShown) {
            showSuccess(`Welcome to LeaveEase, ${res.data.user.name}!`);
            sessionStorage.setItem('welcome_shown', 'true');
          }

          if (res.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="relative">
      {/* 1.5s Enterprise Login Success Animation Overlay */}
      {loginSuccessOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-brand-600 flex items-center justify-center font-extrabold text-white text-3xl shadow-2xl animate-bounce mb-4">
            LE
          </div>
          <h3 className="text-xl font-bold tracking-tight">Authenticating LeaveEase Session...</h3>
          <p className="text-xs text-brand-300 mt-1">Establishing secure role-based connection</p>
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mt-6" />
        </div>
      )}

      {/* Holiday Countdown Widget (Above Login Card) */}
      <div className="mb-6 p-4 bg-slate-800/90 text-white rounded-2xl border border-slate-700/80 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            Today: <strong className="text-white">{todayFormatted}</strong>
          </span>
        </div>

        {holidayWidget?.todayHoliday ? (
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Today is a Holiday: {holidayWidget.todayHoliday.name}!</span>
          </div>
        ) : holidayWidget?.nextUpcoming ? (
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Next Holiday</p>
              <p className="font-bold text-white">{holidayWidget.nextUpcoming.name}</p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-brand-600/30 border border-brand-400 text-brand-300 text-xs font-bold">
                {holidayWidget.nextUpcoming.daysRemaining || 0} Days Remaining
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">No upcoming company holidays scheduled.</div>
        )}
      </div>

      {/* Dual Tab Switcher */}
      <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('employee')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'employee'
              ? 'bg-white dark:bg-slate-900 text-brand-800 dark:text-brand-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Employee Login
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'admin'
              ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          Administrator Login
        </button>
      </div>

      {/* Login Form with Fixed High-Contrast Input Visibility */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            {activeTab === 'admin' ? 'Administrator ID or Email *' : 'Employee ID or Full Name *'}
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={activeTab === 'admin' ? 'Enter Administrator ID' : 'Enter Employee ID or Name'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password *
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 font-semibold">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Remember Me on this device</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || loginSuccessOverlay}
          className={`w-full py-3 px-4 ${
            activeTab === 'admin'
              ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-200'
              : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-200'
          } text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2`}
        >
          {loading ? 'Authenticating...' : `Sign In as ${activeTab === 'admin' ? 'Administrator' : 'Employee'}`}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          LeaveEase Enterprise HRMS Security v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;
