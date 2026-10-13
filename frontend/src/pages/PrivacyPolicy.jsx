import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import Footer from '../components/common/Footer';
import { Shield, ArrowLeft, Lock, FileText, Server, Eye, Database } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="LeaveEase Logo"
            className="w-8 h-8 object-contain"
          />
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              LeaveEase
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block -mt-1">
              Enterprise HRMS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" /> Privacy & Compliance Notice
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Effective Date: October 12, 2026 | Version 2.1
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            1. Overview and Scope
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            This Privacy Policy describes how LeaveEase handles personal and organizational data collected through our Employee Leave Management System. LeaveEase operates solely as an internal workforce management utility for registered corporate organizations and their authorized employees. We do not sell data, track browsing behavior across third-party websites, or display commercial advertisements.
          </p>
        </section>

        {/* Section 2: Data Collection */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            2. Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            To provide accurate leave tracking and secure role-based access, the system processes the following categories of data:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <li>
              <strong>Account & Profile Credentials:</strong> Full name, employee ID, company email address, department designation, role assignment (Employee or Administrator), and cryptographically salted password hashes.
            </li>
            <li>
              <strong>Leave Request Details:</strong> Submitted leave dates, categories (Casual, Sick, Annual, or Unpaid), duration, employee-provided reason descriptions, and managerial decision remarks.
            </li>
            <li>
              <strong>Holiday & Calendar Entries:</strong> Organization-wide statutory and company-specific holiday schedules.
            </li>
            <li>
              <strong>Security Audit Logs:</strong> Timestamped records of credential changes, password reset events, and originating client IP addresses recorded for system integrity audits.
            </li>
          </ul>
        </section>

        {/* Section 3: Use of Information */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            3. How Information Is Used
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Collected information is utilized strictly to provide internal HR administration services:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <li>Verifying employee identity and enforcing role-based permissions.</li>
            <li>Routing submitted leave requests to designated department administrators for approval.</li>
            <li>Calculating accurate annual leave balances and remaining quotas.</li>
            <li>Delivering in-app system notifications regarding approval decisions and company announcements.</li>
            <li>Generating audit reports for administrative compliance and internal workforce planning.</li>
          </ul>
        </section>

        {/* Section 4: Security Safeguards */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            4. Security Standards & Safeguards
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            LeaveEase implements strict technical security controls to safeguard sensitive enterprise records:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <li>
              <strong>Password Protection:</strong> User passwords are encrypted using one-way bcrypt hashing with individual salt rounds. Plain-text passwords are never stored in databases or logged.
            </li>
            <li>
              <strong>Stateless Authentication:</strong> Sessions are secured through signed JSON Web Tokens (JWT) with defined expiration windows.
            </li>
            <li>
              <strong>Transport Security:</strong> All client-server communications in production require Transport Layer Security (TLS/HTTPS).
            </li>
            <li>
              <strong>Access Boundaries:</strong> Strict role-based middleware ensures employees cannot access unauthorized personnel records or administrative controls.
            </li>
          </ul>
        </section>

        {/* Section 5: Data Retention */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            5. Data Retention & Deletion
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Employee records and leave histories are retained for the duration of the organization active subscription or internal deployment lifecycle, in accordance with applicable labor regulations and corporate record-retention requirements. Upon employee offboarding or written administrative request, accounts can be deactivated or permanently expunged from the database by an authorized administrator.
          </p>
        </section>

        {/* Section 6: Contact */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            6. Inquiries and Compliance Contact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            If you have questions regarding this Privacy Policy or system security procedures, please contact your organization designated LeaveEase Administrator or our support team at <span className="font-semibold text-slate-800 dark:text-slate-200">security@leaveease.internal</span>.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
