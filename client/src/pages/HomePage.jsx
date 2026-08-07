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
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  Menu,
  X,
  FileCheck,
  Smartphone
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState({ 0: true });

  // Interactive Leave Calculator Widget State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [simulatedStatus, setSimulatedStatus] = useState(null);

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatedDaysCount = calculateDays();

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    setSimulatedStatus('submitting');
    setTimeout(() => {
      setSimulatedStatus('success');
    }, 1000);
  };

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
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

  const faqs = [
    {
      q: 'How do employees log into LeaveEase?',
      a: 'The Administrator creates the employee account in the Employee Directory and provides the initial login credentials. Employees can log in using their email or Employee ID.'
    },
    {
      q: 'Can administrators view employee passwords?',
      a: 'Yes! Administrators can view initial assigned passwords directly in the Employee Directory using the secure Eye toggle button and copy them to clipboard.'
    },
    {
      q: 'Is LeaveEase accessible on mobile phones and desktop PCs?',
      a: 'Absolutely! LeaveEase features a fully responsive glossy design optimized for smartphones, tablets, laptops, and desktop screens.'
    },
    {
      q: 'How do leave request notifications work?',
      a: 'Notifications appear in real-time in the top navigation bell drawer. Clicking any notification automatically routes you to the corresponding leave application or audit section.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 glossy-hero selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/60 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="LeaveEase Logo"
            className="w-10 h-10 object-contain drop-shadow-md rounded-xl"
          />
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-800 to-brand-600 dark:from-white dark:via-brand-300 dark:to-brand-400 bg-clip-text text-transparent">
              LeaveEase
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block -mt-1">
              Enterprise HRMS
            </span>
          </div>
        </div>

        {/* Desktop Links & CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#features" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Features
          </a>
          <a href="#calculator" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Leave Simulator
          </a>
          <a href="#faqs" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            FAQ
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
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 py-1"
          >
            Leave Simulator
          </a>
          <a
            href="#faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 py-1"
          >
            FAQ
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
      <section className="relative px-4 sm:px-8 pt-12 pb-16 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glossy-pill text-xs font-bold text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 shadow-xs animate-float">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Smart Enterprise Employee Leave Management System</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
            Leave Management Made{' '}
            <span className="bg-gradient-to-r from-brand-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Effortless & Transparent
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Empower your workforce with instant leave applications, administrator decision consoles, real-time password visibility, and automated CSV report analytics.
          </p>
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

        {/* System Capability Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PC & Laptop Ready
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-brand-500" /> Mobile & Tablet Optimized
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-purple-500" /> Admin Password Eye View
          </span>
        </div>
      </section>

      {/* Interactive Leave Calculator & Application Simulator Widget */}
      <section id="calculator" className="px-4 sm:px-8 py-12 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-500/20">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interactive Leave Calculator Simulator</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Test leave duration calculations & real-time request submission simulation</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 self-start sm:self-center">
              Live Demo Widget
            </span>
          </div>

          <form onSubmit={handleSimulateSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Leave Category
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Date (From)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Date (To)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            {/* Live Calculation Output Card */}
            <div className="sm:col-span-3 bg-slate-100/80 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {calculatedDaysCount}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calculated Total</span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {calculatedDaysCount} Calendar Day{calculatedDaysCount !== 1 ? 's' : ''} Requested
                  </h4>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" /> Simulate Leave Request
              </button>
            </div>
          </form>

          {/* Simulation Feedback Alert */}
          {simulatedStatus === 'submitting' && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-700 dark:text-blue-300 text-xs font-bold animate-pulse text-center">
              Processing simulated leave application...
            </div>
          )}

          {simulatedStatus === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Simulation Success! Requested {calculatedDaysCount} Days of {leaveType}. Pending Admin Review.</span>
              </div>
              <button
                onClick={() => setSimulatedStatus(null)}
                className="text-[10px] uppercase font-extrabold underline"
              >
                Reset
              </button>
            </div>
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

      {/* FAQs Section */}
      <section id="faqs" className="px-4 sm:px-8 py-12 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Quick answers about LeaveEase accounts, permissions, and features
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <span>{faq.q}</span>
                {faqOpen[idx] ? <ChevronUp className="w-4 h-4 text-brand-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {faqOpen[idx] && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 font-medium border-t border-slate-100 dark:border-slate-800 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/60 dark:border-slate-800/80 px-4 sm:px-8 py-8 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LeaveEase" className="w-7 h-7 object-contain" />
            <span className="font-bold text-slate-900 dark:text-white">LeaveEase Technologies</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <Link to="/login" className="hover:text-brand-600">Portal Sign In</Link>
            <span>© 2026 LeaveEase HRMS. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
