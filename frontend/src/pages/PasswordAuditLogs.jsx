import React, { useEffect, useState, useCallback } from 'react';
import { getPasswordAudits } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import { KeyRound, CheckCircle2, User, Globe, Lock } from 'lucide-react';

const PasswordAuditLogs = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const { showError } = useToast();

  const fetchAudits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPasswordAudits({ page: pagination?.page || 1, limit: 15 });
      if (res && res.success && res.data) {
        setAudits(res.data.audits || []);
        setPagination(
          res.data.pagination || {
            page: 1,
            total: (res.data.audits || []).length,
            pages: 1
          }
        );
      } else {
        setAudits([]);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load password audit logs');
      setAudits([]);
    } finally {
      setLoading(false);
    }
  }, [pagination?.page, showError]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 rounded-xl border border-slate-200 dark:border-slate-700">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Password Change Activity Audit</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Security log tracking password updates across the organization
            </p>
          </div>
        </div>
      </div>

      {/* Security Rule Notice Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-start gap-3 text-xs">
        <Lock className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-brand-300 block">Security Audit Policy:</span>
          <p className="text-slate-300 leading-snug">
            Actual password strings are encrypted via bcrypt and are <strong>NEVER</strong> stored or displayed in plain text anywhere in the system. This audit log strictly records modification events for compliance.
          </p>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Password Change History</h3>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching password audit history..." />
        ) : audits.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500 dark:text-slate-400">
            No password modification activities logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Employee ID</th>
                  <th className="py-3.5 px-6">Event Status</th>
                  <th className="py-3.5 px-6">Changed By</th>
                  <th className="py-3.5 px-6">IP Address</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {audits.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        <span>{a.employeeName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-brand-800 dark:text-brand-300">{a.employeeId}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Password Changed
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                          a.changedBy === 'Admin'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {a.changedBy}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{a.ipAddress || '127.0.0.1'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {new Date(a.createdAt).toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Page {pagination.page} of {pagination.pages} ({pagination.total} logs)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordAuditLogs;
