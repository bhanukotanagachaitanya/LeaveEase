import React, { useEffect, useState, useCallback } from 'react';
import { getHolidays, createHoliday, updateHoliday, deleteHoliday } from '../services/holidayService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatDate, formatDateInput } from '../utils/dateUtils';
import { CalendarDays, Plus, Calendar, Sparkles, Trash2, Edit3, Flag } from 'lucide-react';

const HOLIDAY_TYPES = ['Festival', 'National', 'Company'];

const HolidayManagement = () => {
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [holidaysData, setHolidaysData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form & Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    occasion: '',
    description: '',
    date: formatDateInput(new Date()),
    type: 'Festival'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHolidays();
      if (res.success) {
        setHolidaysData(res.data);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load holidays');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const handleOpenAdd = () => {
    setEditingHoliday(null);
    setFormData({
      name: '',
      occasion: '',
      description: '',
      date: formatDateInput(new Date()),
      type: 'Festival'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (h) => {
    setEditingHoliday(h);
    setFormData({
      name: h.name,
      occasion: h.occasion,
      description: h.description || '',
      date: formatDateInput(h.date),
      type: h.type || 'Festival'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.occasion || !formData.date) {
      showError('Please fill in required holiday fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingHoliday) {
        await updateHoliday(editingHoliday._id, formData);
        showSuccess('Holiday updated successfully!');
      } else {
        await createHoliday(formData);
        showSuccess('Holiday declared successfully!');
      }
      setModalOpen(false);
      fetchHolidays();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save holiday');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this declared holiday?')) return;
    try {
      await deleteHoliday(id);
      showSuccess('Holiday deleted successfully');
      fetchHolidays();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete holiday');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching official company holidays..." />;
  }

  const holidays = holidaysData?.holidays || [];
  const todayHoliday = holidaysData?.todayHoliday;
  const upcomingHolidays = holidaysData?.upcomingHolidays || [];

  return (
    <div className="space-y-6">
      {/* Today's Holiday Announcement Banner */}
      {todayHoliday && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-white">
                Holiday Alert Today
              </span>
              <h2 className="text-2xl font-extrabold mt-1">Today is a Holiday: {todayHoliday.name}!</h2>
              <p className="text-xs text-amber-100 font-medium">
                Occasion: {todayHoliday.occasion} | Type: {todayHoliday.type} Holiday
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Declared Company Holidays</h2>
            <p className="text-xs text-slate-500">Official company holiday calendar & schedule</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Declare Holiday
          </button>
        )}
      </div>

      {/* Upcoming Holidays Highlight Cards */}
      {upcomingHolidays.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Upcoming Holidays ({upcomingHolidays.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingHolidays.map((h) => (
              <div
                key={h._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex items-start justify-between"
              >
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                    {h.type}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{h.name}</h4>
                  <p className="text-xs text-slate-600 font-medium">{h.occasion}</p>
                  <p className="text-xs text-brand-700 font-semibold flex items-center gap-1 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    {formatDate(h.date)}
                  </p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(h)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Holidays Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">All Declared Holidays</h3>
        </div>

        {holidays.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No company holidays declared yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Holiday Name</th>
                  <th className="py-3.5 px-6">Occasion</th>
                  <th className="py-3.5 px-6">Holiday Date</th>
                  <th className="py-3.5 px-6">Category Type</th>
                  <th className="py-3.5 px-6">Description</th>
                  {isAdmin && <th className="py-3.5 px-6 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {holidays.map((h) => (
                  <tr key={h._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{h.name}</td>
                    <td className="py-4 px-6">{h.occasion}</td>
                    <td className="py-4 px-6 font-semibold text-brand-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(h.date)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {h.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{h.description || '-'}</td>
                    {isAdmin && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(h)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(h._id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Declare / Edit Holiday Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHoliday ? 'Edit Holiday Details' : 'Declare New Company Holiday'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Holiday Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Independence Day"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Occasion / Reason *
              </label>
              <input
                type="text"
                required
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                placeholder="e.g. National Freedom Day"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Holiday Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium bg-white"
              >
                {HOLIDAY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Holiday Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide context or instructions for this holiday..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
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
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingHoliday ? 'Update Holiday' : 'Declare Holiday'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HolidayManagement;
