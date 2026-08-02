import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { checkSetupStatus } from '../services/authService';

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const res = await checkSetupStatus();
        if (res.success && res.data.setupNeeded) {
          if (location.pathname !== '/setup-admin') {
            navigate('/setup-admin');
          }
        }
      } catch (err) {
        console.error('Setup status check error:', err);
      } finally {
        setChecking(false);
      }
    };
    fetchSetup();
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Premium Corporate Blue Gradient SVG Vector Office Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="400" fill="url(#paint0_radial)" />
          <circle cx="1200" cy="700" r="500" fill="url(#paint1_radial)" />
          <path d="M0 400C300 350 600 500 900 450C1200 400 1440 550 1440 550V900H0V400Z" fill="#1e293b" fillOpacity="0.4" />
          <path d="M0 600C400 550 800 650 1440 580V900H0V600Z" fill="#0f172a" fillOpacity="0.6" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(90) scale(400)">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1200 700) rotate(90) scale(500)">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#1d4ed8" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Main Glassmorphism Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-all duration-300">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-blue-500 text-white font-extrabold text-2xl shadow-xl shadow-brand-900/30 transform hover:scale-105 transition-transform">
              LE
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              LeaveEase
            </h1>
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              Enterprise HR Management System
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              "Smart Leave Management for Modern Workplaces"
            </p>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="z-10 py-3 text-center text-xs text-slate-400 font-medium border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} LeaveEase Technologies Pvt. Ltd. &bull; Version 2.0
      </footer>
    </div>
  );
};

export default AuthLayout;
