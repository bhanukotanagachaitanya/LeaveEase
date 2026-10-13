import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import Footer from '../components/common/Footer';
import {
  CalendarPlus,
  ShieldCheck,
  Users,
  BarChart3,
  Calendar,
  Lock,
  ArrowRight,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: CalendarPlus,
      title: 'Leave Request Processing',
      description: 'Submit Casual, Sick, Annual, and Unpaid leave requests with immediate duration calculations and policy validation.'
    },
    {
      icon: ShieldCheck,
      title: 'Manager Approval Center',
      description: 'Review pending department leave submissions with one-click approvals, rejections, and required review remarks.'
    },
    {
      icon: Calendar,
      title: 'Company Holiday Calendars',
      description: 'Publish and distribute statutory and company-specific holidays across all departments in a single shared schedule.'
    },
    {
      icon: Lock,
      title: 'Role-Based Access & Security',
      description: 'Stateless JWT authentication with bcrypt password encryption, department boundaries, and comprehensive audit logs.'
    },
    {
      icon: Users,
      title: 'Employee Directory Management',
      description: 'Maintain accurate personnel profiles, department assignments, and active employment statuses.'
    },
    {
      icon: BarChart3,
      title: 'Auditing & CSV Reporting',
      description: 'Generate organizational leave metrics, department breakdowns, and export records for payroll reconciliation.'
    }
  ];

  const highlights = [
    'Automated leave quota tracking and balance deductions',
    'Real-time in-app notifications on approval decisions',
    'Security audit trail for credential modifications',
    'Responsive interface for desktop and tablet displays'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="LeaveEase Logo"
            className="w-9 h-9 object-contain"
          />
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              LeaveEase
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block -mt-1">
              Enterprise HRMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="#features"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Capabilities
          </a>
          <Link
            to="/privacy"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Terms
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Sign In to Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3 z-40">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 py-1"
          >
            Capabilities
          </a>
          <Link
            to="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 py-1"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 py-1"
          >
            Terms & Conditions
          </Link>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className="w-full py-2.5 rounded-lg bg-brand-600 text-white text-center text-xs font-semibold block shadow-sm"
              >
                Open Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full py-2.5 rounded-lg bg-brand-600 text-white text-center text-xs font-semibold block shadow-sm"
              >
                Sign In to Portal
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="px-4 sm:px-8 pt-16 pb-14 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          Enterprise Leave Management System
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
          Streamline Employee Leave Requests and Approvals
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A dedicated portal for staff to submit time-off requests, department supervisors to process approvals, and administrators to track company holiday schedules and leave balances.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Access Workspace <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Sign In to Portal <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                Review Capabilities
              </a>
            </>
          )}
        </div>

        {/* Feature Checklist */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="px-4 sm:px-8 py-14 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Core Administrative Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Standardized tools engineered for accurate attendance administration and audit compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
