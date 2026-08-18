import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllLeaves, approveLeave, rejectLeave } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import LeaveStatusBadge from '../components/leave/LeaveStatusBadge';
import LeaveActionModal from '../components/leave/LeaveActionModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import { FileCheck2, Search, Calendar, User } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];
const LEAVE_TYPE_OPTIONS = [
  'All',
  'Casual Leave',
  'Sick Leave',
  'Annual Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Unpaid Leave'
];

const AllLeaveRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { showSuccess, showError } = useToast();

  // Sync URL search params with state
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl && statusFromUrl !== statusFilter) {
      setStatusFilter(statusFromUrl);
    }
  }, [searchParams]);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllLeaves({
        status: statusFilter,
        leaveType: leaveTypeFilter,
        search: searchTerm,
        page: pagination.page,
        limit: 10
      });

      if (res.success && res.data) {
        const fetchedList = res.data.leaveRequests || res.data.leaves || [];
        setLeaves(Array.isArray(fetchedList) ? fetchedList : []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } else {
        setLeaves([]);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load leave requests');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, leaveTypeFilter, searchTerm, pagination.page, showError]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleOpenAction = (leave, type) => {
    setSelectedLeave(leave);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirmAction = async (leaveId, remarks) => {
    try {
      if (actionType === 'approve') {
        await approveLeave(leaveId, remarks);
        showSuccess('Leave request approved successfully!');
      } else {
        await rejectLeave(leaveId, remarks);
        showSuccess('Leave request rejected!');
      }
      fetchLeaves();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update leave request status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-100 dark:border-brand-800 shadow-xs">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Leave Requests</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review, search, and approve employee leave applications</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder="Search employee, ID, reason..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white caret-brand-600 dark:caret-brand-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value;
                setStatusFilter(val);
                setSearchParams({ status: val });
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  Status: {status}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type Filter */}
          <div>
            <select
              value={leaveTypeFilter}
              onChange={(e) => {
                setLeaveTypeFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            >
              {LEAVE_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  Leave Type: {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-subtle overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Fetching leave requests..." />
        ) : !leaves || leaves.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Leave Requests Found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adjust search parameters or status filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Dates & Duration</th>
                  <th className="py-3.5 px-6">Reason</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Remarks</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-brand-600" />
                        <span>{leave.employeeId?.name || 'Unknown'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {leave.employeeId?.employeeId || 'N/A'} | {leave.employeeId?.department || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-brand-800 dark:text-brand-400">{leave.leaveType}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{leave.totalDays} Days</span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-600 dark:text-slate-400" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-4 px-6">
                      <LeaveStatusBadge status={leave.status} />
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 italic max-w-xs truncate">
                      {leave.remarks || '-'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {leave.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAction(leave, 'approve')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 text-xs font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenAction(leave, 'reject')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold uppercase">Decided</span>
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
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Page {pagination.page} of {pagination.pages} ({pagination.total} records)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <LeaveActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        leave={selectedLeave}
        actionType={actionType}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default AllLeaveRequests;
