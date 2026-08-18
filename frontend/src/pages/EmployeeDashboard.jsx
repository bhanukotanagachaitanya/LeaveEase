import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeaveHistory } from '../services/leaveService';
import { getHolidays } from '../services/holidayService';
import { getUserNotifications } from '../services/notificationService';
import StatCard from '../components/common/StatCard';
import LeaveStatusBadge from '../components/leave/LeaveStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  ArrowRight,
  UserCheck,
  Building,
  CalendarDays,
  Sparkles,
  Bell,
  Calendar as CalendarIcon
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [holidaysData, setHolidaysData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [leaveRes, holidayRes, notifRes] = await Promise.all([
          getLeaveHistory({ limit: 5 }),
          getHolidays(),
          getUserNotifications()
        ]);
        if (leaveRes.success) setData(leaveRes.data);
        if (holidayRes.success) setHolidaysData(holidayRes.data);
        if (notifRes.success) setNotifications(notifRes.data.notifications || []);
      } catch (err) {
        console.error('Error fetching employee dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading LeaveEase employee portal..." />;
  }

  const stats = data?.stats || {
    totalRequests: 0,
    pendingRequests: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  };

  const recentLeaves = data?.leaveRequests || [];
  const todayHoliday = holidaysData?.todayHoliday;
  const upcomingHolidays = holidaysData?.upcomingHolidays || [];

  return (
    <div className="space-y-6">
      {/* Today's Holiday Banner */}
      {todayHoliday && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-white">
                Holiday Announcement
              </span>
              <h2 className="text-2xl font-extrabold mt-1">Today is a Holiday: {todayHoliday.name}!</h2>
              <p className="text-xs text-amber-100 font-medium">
                Occasion: {todayHoliday.occasion} | Category: {todayHoliday.type}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-blue-600 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="z-10 space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm">
            <UserCheck className="w-3.5 h-3.5" /> LeaveEase Employee Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-sm text-blue-100 font-medium">
            Manage your leave balances, view declared company holidays, and track request statuses.
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs text-blue-200 font-mono">
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> {user?.department}
            </span>
            <span>•</span>
            <span>Employee ID: {user?.employeeId}</span>
          </div>
        </div>

        <Link
          to="/apply-leave"
          className="z-10 px-5 py-3 bg-white text-brand-800 hover:bg-blue-50 text-sm font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <CalendarPlus className="w-4 h-4 text-brand-600" />
          Apply For Leave
        </Link>
      </div>

      {/* Dashboard Metric Stat Cards - Interactive Clickable Redirection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={FileText}
          color="blue"
          subtitle="All leave submissions"
          to="/leave-history?status=All"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={Clock}
          color="amber"
          subtitle="Awaiting admin review"
          to="/leave-history?status=Pending"
        />
        <StatCard
          title="Approved Leaves"
          value={stats.approvedLeaves}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Granted leave requests"
          to="/leave-history?status=Approved"
        />
        <StatCard
          title="Rejected Leaves"
          value={stats.rejectedLeaves}
          icon={XCircle}
          color="rose"
          subtitle="Declined applications"
          to="/leave-history?status=Rejected"
        />
      </div>

      {/* Grid Row: Upcoming Holidays & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Holidays Widget */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Upcoming Company Holidays</h3>
            </div>
            <Link
              to="/holidays"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Full Calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingHolidays.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No upcoming declared holidays.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcomingHolidays.slice(0, 4).map((h) => (
                <div
                  key={h._id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-start justify-between"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                      {h.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{h.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{h.occasion}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-400 flex items-center gap-1 whitespace-nowrap">
                    <CalendarIcon className="w-3 h-3" /> {formatDate(h.date)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent Notifications</h3>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No recent notifications.</p>
            ) : (
              notifications.slice(0, 4).map((n) => (
                <div key={n._id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Leave Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Recent Leave Applications</h3>
            <p className="text-xs text-slate-500">Your latest submitted requests</p>
          </div>
          <Link
            to="/leave-history"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View Full History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLeaves.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Leave Requests Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't submitted any leave applications yet. Click below to submit your first request.
            </p>
            <Link
              to="/apply-leave"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700"
            >
              <CalendarPlus className="w-4 h-4" /> Apply Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Leave Type</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Days</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {recentLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">{leave.leaveType}</td>
                    <td className="py-4 px-6">
                      {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                    </td>
                    <td className="py-4 px-6 font-semibold text-brand-700 dark:text-brand-400">{leave.totalDays} Days</td>
                    <td className="py-4 px-6">
                      <LeaveStatusBadge status={leave.status} />
                    </td>
                    <td className="py-4 px-6 text-slate-500">{formatDate(leave.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
