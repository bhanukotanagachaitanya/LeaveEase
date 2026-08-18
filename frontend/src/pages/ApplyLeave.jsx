import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyLeave } from '../services/leaveService';
import { getHolidays } from '../services/holidayService';
import { useToast } from '../context/ToastContext';
import { calculateTotalDays, formatDateInput, isPastDate } from '../utils/dateUtils';
import { CalendarPlus, Calendar, Clock, AlertTriangle, CheckCircle, FileText, Sparkles } from 'lucide-react';

const LEAVE_TYPES = [
  { id: 'Casual Leave', name: 'Casual Leave', desc: 'Short personal time off or family commitments' },
  { id: 'Sick Leave', name: 'Sick Leave', desc: 'Medical ailments or doctor consultation appointments' },
  { id: 'Annual Leave', name: 'Annual Leave', desc: 'Earned paid annual vacation time' },
  { id: 'Maternity Leave', name: 'Maternity Leave', desc: 'Maternity leave allocation for mothers' },
  { id: 'Paternity Leave', name: 'Paternity Leave', desc: 'Paternity leave allocation for fathers' },
  { id: 'Unpaid Leave', name: 'Unpaid Leave', desc: 'Approved absence beyond paid leave balances' }
];

const ApplyLeave = () => {
  const todayStr = formatDateInput(new Date());

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    fromDate: todayStr,
    toDate: todayStr,
    reason: ''
  });
  const [todayHoliday, setTodayHoliday] = useState(null);
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHolidaysCheck = async () => {
      try {
        const res = await getHolidays();
        if (res.success && res.data.todayHoliday) {
          setTodayHoliday(res.data.todayHoliday);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHolidaysCheck();
  }, []);

  const totalDays = useMemo(() => {
    return calculateTotalDays(formData.fromDate, formData.toDate);
  }, [formData.fromDate, formData.toDate]);

  const isFromPast = isPastDate(formData.fromDate);
  const isEndBeforeStart = new Date(formData.toDate) < new Date(formData.fromDate);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leaveType || !formData.fromDate || !formData.toDate || !formData.reason.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    if (isFromPast) {
      showError('Leave start date cannot be in the past');
      return;
    }

    if (isEndBeforeStart) {
      showError('Leave end date cannot be before the start date');
      return;
    }

    if (formData.reason.trim().length < 5) {
      showError('Reason must be at least 5 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await applyLeave(formData);
      if (res.success) {
        showSuccess('Leave request submitted successfully for approval!');
        navigate('/leave-history');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Today is a Holiday Notice */}
      {todayHoliday && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3 text-amber-900">
          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Today is an official company holiday ({todayHoliday.name})!</span>
            <p className="text-amber-800">You do not need to apply for leave on declared holiday dates.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100">
          <CalendarPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Apply for Leave</h2>
          <p className="text-xs text-slate-500">Fill out the form below to submit a formal leave request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
        {/* Leave Type Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Leave Type *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LEAVE_TYPES.map((type) => (
              <label
                key={type.id}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.leaveType === type.id
                    ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{type.name}</span>
                  <input
                    type="radio"
                    name="leaveType"
                    value={type.id}
                    checked={formData.leaveType === type.id}
                    onChange={handleChange}
                    className="text-brand-600 focus:ring-brand-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{type.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              From Date (Start) *
            </label>
            <input
              type="date"
              name="fromDate"
              min={todayStr}
              required
              value={formData.fromDate}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${
                isFromPast
                  ? 'border-rose-400 bg-rose-50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                  : 'border-slate-300 focus:ring-2 focus:ring-brand-500'
              }`}
            />
            {isFromPast && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Start date cannot be in the past
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              To Date (End) *
            </label>
            <input
              type="date"
              name="toDate"
              min={formData.fromDate || todayStr}
              required
              value={formData.toDate}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${
                isEndBeforeStart
                  ? 'border-rose-400 bg-rose-50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                  : 'border-slate-300 focus:ring-2 focus:ring-brand-500'
              }`}
            />
            {isEndBeforeStart && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> End date cannot be before start date
              </p>
            )}
          </div>
        </div>

        {/* Total Days Live Display Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-100 text-brand-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Calculated Leave Duration</p>
              <p className="text-lg font-bold text-slate-900">
                {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Auto-Calculated
          </span>
        </div>

        {/* Reason Textarea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Reason for Leave *
          </label>
          <textarea
            name="reason"
            rows={4}
            required
            value={formData.reason}
            onChange={handleChange}
            placeholder="Provide detailed justification for your leave request..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || isFromPast || isEndBeforeStart || totalDays <= 0}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 focus:ring-4 focus:ring-brand-200 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
            {!loading && <CheckCircle className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeave;
