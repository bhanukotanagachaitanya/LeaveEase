import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import {
  CalendarPlus,
  ShieldCheck,
  Zap,
  Users,
  KeyRound,
  BarChart3,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: CalendarPlus,
      title: 'Seamless Leave Applications',
      description: 'Employees can apply for Casual, Sick, Annual, and Unpaid leaves in seconds with instant date validation.',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: ShieldCheck,
      title: 'Administrator Decision Center',
      description: 'One-click leave approvals and rejections with custom admin remarks and instant status feedback.',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      icon: KeyRound,
      title: 'Transparent Password Access',
      description: 'Admins can view assigned employee passwords with an eye toggle and copy credentials securely.',
      color: 'from-purple-500 to-indigo-400'
    },
    {
      icon: BarChart3,
      title: 'Leave Analytics & CSV Reports',
      description: 'Real-time organization metrics, approval rates, category breakdowns, and one-click CSV report downloads.',
      color: 'from-amber-500 to-orange-400'
    },
    {
      icon: Users,
      title: 'Clean Employee Management',
      description: 'Zero sample bloat. Add staff members, toggle active/inactive status, and issue instant password resets.',
      color: 'from-rose-500 to-pink-400'
    },
    {
      icon: Zap,
      title: 'Instant Real-time Notifications',
      description: 'Automatic notifications for leave approvals, rejections, password updates, and company announcements.',
      color: 'from-indigo-500 to-blue-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 glossy-hero selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/60 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-subtle">
        {/* Clickable Brand Logo - Scrolls Back to Top of Home Page */}
        <a
          href="/"
          onClick={scrollToTop}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="LeaveEase Logo"
            className="w-10 h-10 object-contain drop-shadow-md rounded-xl group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-800 to-brand-600 dark:from-white dark:via-brand-300 dark:to-brand-400 bg-clip-text text-transparent group-hover:text-brand-600 transition-colors">
              LeaveEase
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block -mt-1">
              Enterprise HRMS
            </span>
          </div>
        </a>

        {/* Desktop Links & CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#features" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Features
          </a>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              Sign In <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3 z-40 animate-fade-in">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 py-1"
          >
            Features
          </a>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-center text-xs font-bold shadow-md block"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-center text-xs font-bold shadow-md block"
              >
                Sign In to Portal
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-16 pb-16 max-w-6xl mx-auto text-center space-y-8">
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            Leave Management Made{' '}
            <span className="bg-gradient-to-r from-brand-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Effortless & Transparent
            </span>
          </h1>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Open Workspace Portal <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Sign In to Portal <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl glass-card hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white text-sm font-extrabold border border-slate-300 dark:border-slate-700 shadow-md transition-all flex items-center justify-center gap-2"
              >
                Explore Features
              </a>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="px-4 sm:px-8 py-12 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Designed for Modern Workplaces
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Everything your HR department and employees need for zero-friction leave management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Centered Clean Footer */}
      <footer className="glass-panel border-t border-white/60 dark:border-slate-800/80 px-4 sm:px-8 py-10 mt-16 flex flex-col items-center justify-center text-center">
        <a href="/" onClick={scrollToTop} className="flex items-center justify-center gap-3 cursor-pointer group">
          <img src="/logo.png" alt="LeaveEase" className="w-8 h-8 object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-800 to-brand-600 dark:from-white dark:via-brand-300 dark:to-brand-400 bg-clip-text text-transparent">
            leaveease
          </span>
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
