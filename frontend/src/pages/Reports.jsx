import React, { useEffect, useState } from 'react';
import { getAdminDashboard, getAllLeaves } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart3, Download, PieChart, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAdminDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [showError]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await getAllLeaves({ limit: 1000 });
      if (res.success && res.data.leaves) {
        const leaves = res.data.leaves;

        const headers = [
          'Leave ID',
          'Employee Name',
          'Employee ID',
          'Department',
          'Leave Type',
          'From Date',
          'To Date',
          'Total Days',
          'Status',
          'Reason',
          'Admin Remarks',
          'Applied Date'
        ];

        const csvRows = [headers.join(',')];

        leaves.forEach((l) => {
          const row = [
            `"${l._id}"`,
            `"${l.employeeId?.name || ''}"`,
            `"${l.employeeId?.employeeId || ''}"`,
            `"${l.employeeId?.department || ''}"`,
            `"${l.leaveType}"`,
            `"${formatDate(l.fromDate)}"`,
            `"${formatDate(l.toDate)}"`,
            l.totalDays,
            `"${l.status}"`,
            `"${(l.reason || '').replace(/"/g, '""')}"`,
            `"${(l.remarks || '').replace(/"/g, '""')}"`,
            `"${formatDate(l.createdAt)}"`
          ];
          csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Leave_Management_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showSuccess('CSV Report generated and downloaded successfully!');
      }
    } catch (err) {
      showError('Failed to generate CSV export');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Generating report analytics..." />;
  }

  const metrics = data?.metrics || {};
  const leavesByType = data?.analytics?.leavesByType || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Reports & Leave Analytics</h2>
            <p className="text-xs text-slate-500">Corporate analytics breakdown and data export utilities</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Generating CSV...' : 'Export Full CSV Report'}
        </button>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Pending Rate</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {metrics.totalLeaveRequests > 0
                ? Math.round((metrics.pendingRequests / metrics.totalLeaveRequests) * 100)
                : 0}
              %
            </h4>
            <p className="text-xs text-slate-400 font-medium">({metrics.pendingRequests} applications)</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Approval Rate</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {metrics.totalLeaveRequests > 0
                ? Math.round((metrics.approvedRequests / metrics.totalLeaveRequests) * 100)
                : 0}
              %
            </h4>
            <p className="text-xs text-slate-400 font-medium">({metrics.approvedRequests} approved)</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Rejection Rate</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {metrics.totalLeaveRequests > 0
                ? Math.round((metrics.rejectedRequests / metrics.totalLeaveRequests) * 100)
                : 0}
              %
            </h4>
            <p className="text-xs text-slate-400 font-medium">({metrics.rejectedRequests} declined)</p>
          </div>
        </div>
      </div>

      {/* Leave Type Breakdown Table / Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <PieChart className="w-5 h-5 text-brand-600" />
          <h3 className="text-base font-bold text-slate-800">Leave Applications Breakdown by Category</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {leavesByType.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No category data recorded yet.</p>
          ) : (
            leavesByType.map((item) => {
              const percentage = metrics.totalLeaveRequests > 0
                ? Math.round((item.count / metrics.totalLeaveRequests) * 100)
                : 0;
              return (
                <div key={item._id} className="py-3 flex items-center justify-between">
                  <div className="space-y-1 w-full max-w-md">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{item._id}</span>
                      <span>{item.count} Applications ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
