import React, { useState } from 'react';
import Modal from '../common/Modal';
import { formatDate } from '../../utils/dateUtils';
import LeaveStatusBadge from './LeaveStatusBadge';
import { CheckCircle2, XCircle, User, Calendar, FileText } from 'lucide-react';

const LeaveActionModal = ({ isOpen, onClose, leave, onConfirm, actionType }) => {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!leave) return null;

  const isApprove = actionType === 'approve';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm(leave._id, remarks);
    setLoading(false);
    setRemarks('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isApprove ? 'Approve Leave Request' : 'Reject Leave Request'}
    >
      <div className="space-y-4">
        {/* Employee Summary Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <User className="w-4 h-4 text-brand-600" />
              <span>{leave.employeeId?.name || 'Employee'}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-normal">
                {leave.employeeId?.employeeId}
              </span>
            </div>
            <LeaveStatusBadge status={leave.status} />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {formatDate(leave.fromDate)} - {formatDate(leave.toDate)} ({leave.totalDays} Days)
              </span>
            </div>
            <div className="font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
              {leave.leaveType}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex gap-2 items-start text-xs text-slate-600">
            <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="italic">"{leave.reason}"</p>
          </div>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Admin Remarks / Comments {isApprove ? '(Optional)' : '(Recommended)'}
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                isApprove
                  ? 'Add any instructions or approval notes...'
                  : 'Specify reason for rejection...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition-all ${
                isApprove
                  ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                  : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
              } disabled:opacity-50`}
            >
              {isApprove ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {loading ? 'Processing...' : isApprove ? 'Approve Leave' : 'Reject Leave'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LeaveActionModal;
