import React, { useEffect, useState, useCallback } from 'react';
import { getResetRequests, approveResetRequest, rejectResetRequest } from '../services/passwordResetService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/dateUtils';
import { Key, CheckCircle2, XCircle, Clock, ShieldAlert, User, Mail } from 'lucide-react';

const PasswordResetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  // Action Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
  const [adminRemarks, setAdminRemarks] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getResetRequests({ status: statusFilter, page: pagination.page, limit: 10 });
      if (res.success) {
        setRequests(res.data.requests);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load password reset requests');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, pagination.page, showError]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleOpenAction = (req, type) => {
    setSelectedRequest(req);
    setActionType(type);
    setAdminRemarks('');
    setModalOpen(true);
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setSubmitting(true);
    try {
      if (actionType === 'approve') {
        await approveResetRequest(selectedRequest._id, adminRemarks);
        showSuccess('Password reset request approved successfully!');
      } else {
        await rejectResetRequest(selectedRequest._id, adminRemarks);
        showSuccess('Password reset request rejected!');
      }
      setModalOpen(false);
      fetchRequests();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Password Reset Requests</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review, approve, or reject employee password reset requests
            </p>
          </div>
        </div>
      </div>

      {/* Security Rule Notice */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 text-xs flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <p className="text-slate-300">
          <strong>Security Policy:</strong> Approving a request authorizes the employee to set a new password. Administrators <strong>never</strong> see or manage plain-text employee passwords.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Approved', 'Rejected', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Fetching password reset requests..." />
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Reset Requests Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Reason for Reset</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Requested Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-brand-600" />
                        <span>{req.employeeName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {req.employeeId}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          req.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{formatDate(req.createdAt)}</td>
                    <td className="py-4 px-6 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAction(req, 'approve')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 text-xs font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenAction(req, 'reject')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-xs font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approve / Reject Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={actionType === 'approve' ? 'Approve Password Reset' : 'Reject Password Reset'}
      >
        <form onSubmit={handleConfirmAction} className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {actionType === 'approve'
              ? `Approve password reset authorization for ${selectedRequest?.employeeName} (${selectedRequest?.employeeId}).`
              : `Decline password reset request for ${selectedRequest?.employeeName}.`}
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Admin Remarks / Instructions
            </label>
            <textarea
              rows={3}
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="Add optional notes for the employee..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-sm font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 ${
                actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {submitting ? 'Processing...' : actionType === 'approve' ? 'Approve Reset' : 'Reject Reset'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PasswordResetRequests;
