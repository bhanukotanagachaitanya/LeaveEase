import React, { useEffect, useState, useCallback } from 'react';
import { getAdminDashboard, approveLeave, rejectLeave } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import LeaveStatusBadge from '../components/leave/LeaveStatusBadge';
import LeaveActionModal from '../components/leave/LeaveActionModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  KeyRound,
  UserCheck,
  CalendarDays,
  PieChart
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State for Approve / Reject actions
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await getAdminDashboard();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load LeaveEase admin analytics');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
      fetchDashboard();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to process leave action');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading LeaveEase administrator analytics..." />;
  }

  const metrics = data?.metrics || {
    totalEmployees: 0,
    activeEmployees: 0,
    totalLeaveRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  };

  const recentRequests = data?.recentRequests || [];
  const pendingQueue = recentRequests.filter((r) => r.status === 'Pending');
  const upcomingHolidays = data?.upcomingHolidays || [];
  const passwordAudits = data?.recentPasswordAudits || [];
  const leavesByType = data?.analytics?.leavesByType || [];

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-xs font-bold border border-brand-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> LeaveEase Admin Control Center
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">Organization Overview</h2>
          <p className="text-xs text-slate-400">
            Manage employee accounts, approve leave applications, declare company holidays, and monitor security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/leaves"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Manage All Requests
          </Link>
        </div>
      </div>

      {/* Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Employees"
          value={metrics.totalEmployees}
          icon={Users}
          color="indigo"
          subtitle={`${metrics.activeEmployees || 0} Active Staff`}
        />
        <StatCard
          title="Total Requests"
          value={metrics.totalLeaveRequests}
          icon={FileCheck2}
          color="blue"
          subtitle="All leave applications"
        />
        <StatCard
          title="Pending Requests"
          value={metrics.pendingRequests}
          icon={Clock}
          color="amber"
          subtitle="Requires admin decision"
        />
        <StatCard
          title="Approved Leaves"
          value={metrics.approvedRequests}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Granted applications"
        />
        <StatCard
          title="Rejected Leaves"
          value={metrics.rejectedRequests}
          icon={XCircle}
          color="rose"
          subtitle="Declined applications"
        />
      </div>

      {/* Grid Row 2: Category Bar Chart / Analytics & Password Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Category Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-800">Leave Distribution by Category</h3>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {leavesByType.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No leave category data recorded yet.</p>
            ) : (
              leavesByType.map((item) => {
                const percentage =
                  metrics.totalLeaveRequests > 0
                    ? Math.round((item.count / metrics.totalLeaveRequests) * 100)
                    : 0;
                return (
                  <div key={item._id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{item._id}</span>
                      <span>
                        {item.count} Applications ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Password Audit Logs Preview Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-800">Password Change Activity</h3>
            </div>
            <Link
              to="/admin/password-audit"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Audit Logs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {passwordAudits.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No password changes logged yet.</p>
            ) : (
              passwordAudits.slice(0, 4).map((audit) => (
                <div key={audit._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{audit.employeeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{audit.employeeId}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                    <span>By: <strong>{audit.changedBy}</strong></span>
                    <span className="text-[10px] text-slate-400">{formatDate(audit.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-800">Pending Review Queue</h3>
              <p className="text-xs text-slate-500">Leave applications waiting for administrator decision</p>
            </div>
          </div>
          <Link
            to="/admin/leaves?status=Pending"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All Pending ({metrics.pendingRequests}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No Pending Requests</p>
            <p className="text-xs text-slate-500">All leave requests have been reviewed and processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Reason</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {pendingQueue.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{leave.employeeId?.name || 'N/A'}</div>
                      <span className="text-[10px] font-mono text-slate-400">{leave.employeeId?.employeeId}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{leave.employeeId?.department || 'N/A'}</td>
                    <td className="py-4 px-6 font-semibold text-brand-700">{leave.leaveType}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">{leave.totalDays} Days</span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-slate-600" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenAction(leave, 'approve')}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleOpenAction(leave, 'reject')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
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

export default AdminDashboard;
