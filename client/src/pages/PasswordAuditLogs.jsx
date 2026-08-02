import React, { useEffect, useState, useCallback } from 'react';
import { getPasswordAudits } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import { KeyRound, ShieldAlert, CheckCircle2, User, Globe, Lock } from 'lucide-react';

const PasswordAuditLogs = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const { showError } = useToast();

  const fetchAudits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPasswordAudits({ page: pagination.page, limit: 15 });
      if (res.success) {
        setAudits(res.data.audits);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load password audit logs');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, showError]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Password Change Activity Audit</h2>
            <p className="text-xs text-slate-500">
              Security log tracking password updates across the organization
            </p>
          </div>
        </div>
      </div>

      {/* Security Rule Notice Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-start gap-3 text-xs">
        <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-purple-300 block">Security Audit Policy:</span>
          <p className="text-slate-300 leading-snug">
            Actual password strings (old or new) are encrypted via bcrypt and are <strong>NEVER</strong> stored or displayed in plain text anywhere in the system. This audit log strictly records modification events for compliance.
          </p>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Password Change History</h3>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching password audit history..." />
        ) : audits.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No password modification activities logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Employee ID</th>
                  <th className="py-3.5 px-6">Event Status</th>
                  <th className="py-3.5 px-6">Changed By</th>
                  <th className="py-3.5 px-6">IP Address</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {audits.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-brand-600" />
                        <span>{a.employeeName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-brand-800">{a.employeeId}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Password Changed
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                          a.changedBy === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {a.changedBy}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{a.ipAddress || '127.0.0.1'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
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
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {pagination.page} of {pagination.pages} ({pagination.total} logs)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-40"
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
