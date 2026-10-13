import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import Footer from '../components/common/Footer';
import { FileCheck, ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, Scale } from 'lucide-react';

const TermsAndConditions = () => {
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
            <Scale className="w-3.5 h-3.5" /> Enterprise Service Agreement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Effective Date: October 12, 2026 | Version 2.1
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            1. Acceptance of Terms
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            By accessing or using the LeaveEase Enterprise Leave Management System, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions. This agreement applies to all registered personnel, including employees, department managers, and system administrators.
          </p>
        </section>

        {/* Section 2: Authorized Use */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            2. Authorized Enterprise Use
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            LeaveEase is designated exclusively for corporate time-off tracking, leave policy administration, and employee attendance workflow management. Users may not:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
            <li>Attempt to bypass or tamper with role-based authentication or access control middleware.</li>
            <li>Submit fraudulent leave requests or misrepresent employment identity.</li>
            <li>Deploy automated scrapers, crawlers, or stress-testing scripts against the application without prior authorization.</li>
            <li>Disclose administrative master credentials or employee account access to third parties.</li>
          </ul>
        </section>

        {/* Section 3: User Accounts */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            3. Account Responsibilities & Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Users are solely responsible for maintaining the confidentiality of their authentication credentials. Any request submitted under a valid session token is deemed authorized by the designated employee. If unauthorized access is suspected, users must report the incident to their system administrator immediately and initiate a credential reset.
          </p>
        </section>

        {/* Section 4: Leave Requests & Approvals */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            4. Leave Applications and Managerial Authority
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Submitting a leave request through LeaveEase represents an application for absence that remains subject to departmental review. System notification of approval constitutes official confirmation. Approval decisions are made under company HR guidelines and remain at the discretion of authorized supervisors and administrators.
          </p>
        </section>

        {/* Section 5: System Availability */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            5. Service Availability and Maintenance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            While LeaveEase is engineered for continuous enterprise uptime, scheduled maintenance or unexpected technical interruptions may occasionally occur. The organization reserves the right to conduct routine system updates, database migrations, and security patches with advance notice where feasible.
          </p>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            6. Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            LeaveEase is provided on an standard enterprise basis. Under no circumstances shall the software creators or hosting infrastructure providers be held liable for indirect, incidental, or consequential damages resulting from downtime, improper input of leave dates, or internal managerial scheduling disputes.
          </p>
        </section>

        {/* Section 7: Amendments */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            7. Amendments and Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            These Terms may be updated periodically to reflect changes in corporate policies or statutory labor requirements. Continued use of LeaveEase following posted revisions constitutes acceptance of the updated terms. For inquiries, please reach out to <span className="font-semibold text-slate-800 dark:text-slate-200">legal@leaveease.internal</span>.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
