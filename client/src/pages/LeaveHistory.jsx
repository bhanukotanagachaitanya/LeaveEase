import React, { useEffect, useState, useCallback } from 'react';
import { getLeaveHistory, cancelLeave } from '../services/leaveService';
import { useToast } from '../context/ToastContext';
import LeaveStatusBadge from '../components/leave/LeaveStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/dateUtils';
import { Search, Filter, History, Trash2, Calendar, AlertCircle } from 'lucide-react';

const STATUS_TABS = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  // Cancel Confirmation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetLeave, setTargetLeave] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeaveHistory({
        status: activeTab,
        search: searchTerm,
        page: pagination.page,
        limit: 10
      });
      if (res.success) {
        setLeaveRequests(res.data.leaveRequests);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load leave history');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, pagination.page, showError]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCancelClick = (leave) => {
    setTargetLeave(leave);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetLeave) return;
    setCancelling(true);
    try {
      const res = await cancelLeave(targetLeave._id);
      if (res.success) {
        showSuccess('Leave request cancelled successfully');
        setCancelModalOpen(false);
        fetchHistory();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to cancel leave request');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Leave History</h2>
            <p className="text-xs text-slate-500">Track and manage all your submitted leave requests</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder="Search reason or type..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Fetching leave history records..." />
        ) : leaveRequests.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Leave History Records Found</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search keyword</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Dates & Duration</th>
                  <th className="py-3.5 px-6">Reason</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Admin Remarks</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {leaveRequests.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{leave.leaveType}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                        </span>
                      </div>
                      <span className="text-[11px] text-brand-700 font-bold">
                        {leave.totalDays} Days
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-600" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-4 px-6">
                      <LeaveStatusBadge status={leave.status} />
                    </td>
                    <td className="py-4 px-6 text-slate-500 italic max-w-xs truncate">
                      {leave.remarks || '-'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {leave.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelClick(leave)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
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
              Page {pagination.page} of {pagination.pages} ({pagination.total} records)
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

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Cancel Leave Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to cancel your pending <strong>{targetLeave?.leaveType}</strong> request for{' '}
            <strong>
              {formatDate(targetLeave?.fromDate)} to {formatDate(targetLeave?.toDate)}
            </strong>
            ?
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              No, Keep Request
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Leave'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveHistory;
