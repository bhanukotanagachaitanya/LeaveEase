import React, { useEffect, useState, useCallback } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  resetEmployeePassword
} from '../services/adminService';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/dateUtils';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Key,
  Eye,
  EyeOff,
  Copy,
  Lock
} from 'lucide-react';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  // Password visibility state per employee ID
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form states
  const [addFormData, setAddFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    department: 'Engineering',
    role: 'employee'
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    isActive: true
  });

  const [resetPassword, setResetPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchEmployeesList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEmployees({
        search,
        department: departmentFilter,
        status: statusFilter,
        page: pagination.page,
        limit: 10
      });
      if (res.success) {
        setEmployees(res.data.employees);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showError('Failed to fetch employee list');
    } finally {
      setLoading(false);
    }
  }, [search, departmentFilter, statusFilter, pagination.page, showError]);

  useEffect(() => {
    fetchEmployeesList();
  }, [fetchEmployeesList]);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPassword = (pass) => {
    if (!pass) return;
    navigator.clipboard.writeText(pass);
    showSuccess('Password copied to clipboard!');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createEmployee(addFormData);
      if (res.success) {
        showSuccess('Employee account created successfully!');
        setAddModalOpen(false);
        setAddFormData({
          name: '',
          employeeId: '',
          email: '',
          password: '',
          department: 'Engineering',
          role: 'employee'
        });
        fetchEmployeesList();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (emp) => {
    setSelectedEmployee(emp);
    setEditFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      role: emp.role,
      isActive: emp.isActive
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await updateEmployee(selectedEmployee._id, editFormData);
      if (res.success) {
        showSuccess('Employee details updated');
        setEditModalOpen(false);
        fetchEmployeesList();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (emp) => {
    try {
      const res = await toggleEmployeeStatus(emp._id);
      if (res.success) {
        showSuccess(`Account ${emp.isActive ? 'deactivated' : 'activated'}`);
        fetchEmployeesList();
      }
    } catch (err) {
      showError('Failed to toggle employee status');
    }
  };

  const handleResetOpen = (emp) => {
    setSelectedEmployee(emp);
    setResetPassword('');
    setResetModalOpen(true);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetPassword || resetPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      const res = await resetEmployeePassword(selectedEmployee._id, resetPassword);
      if (res.success) {
        showSuccess('Employee password reset successfully!');
        setResetModalOpen(false);
        fetchEmployeesList();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee account?')) return;
    try {
      const res = await deleteEmployee(id);
      if (res.success) {
        showSuccess('Employee account deleted');
        fetchEmployeesList();
      }
    } catch (err) {
      showError('Failed to delete employee');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-600 rounded-2xl border border-brand-100 dark:border-brand-800">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Employee Directory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage organization staff, view assigned passwords, and toggle account statuses
            </p>
          </div>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add New Employee
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, email..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading employee directory..." />
        ) : employees.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Employees Found</p>
            <p className="text-xs text-slate-500 mt-1">Click 'Add New Employee' to register staff members.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Assigned Password</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {employees.map((emp) => {
                  const isVisible = visiblePasswords[emp._id];
                  const passwordDisplay = emp.initialPassword || 'Password123';
                  return (
                    <tr key={emp._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div>{emp.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {emp.employeeId}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-semibold">{emp.department}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{emp.email}</td>
                      <td className="py-4 px-6 font-mono">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg w-fit border border-slate-200 dark:border-slate-700">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {isVisible ? passwordDisplay : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(emp._id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Toggle Password View"
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          {isVisible && (
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(passwordDisplay)}
                              className="text-brand-600 hover:text-brand-700"
                              title="Copy Password"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(emp)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                            emp.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {emp.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResetOpen(emp)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditOpen(emp)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Employee">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={addFormData.name}
              onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
              placeholder="e.g. Robert Martin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              required
              value={addFormData.employeeId}
              onChange={(e) => setAddFormData({ ...addFormData, employeeId: e.target.value })}
              placeholder="e.g. EMP104"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={addFormData.email}
              onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
              placeholder="robert@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Assigned Password *
            </label>
            <input
              type="text"
              required
              value={addFormData.password}
              onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
              placeholder="Assign employee initial password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Department *
            </label>
            <select
              value={addFormData.department}
              onChange={(e) => setAddFormData({ ...addFormData, department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Employee Profile">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Department *
            </label>
            <select
              value={editFormData.department}
              onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Admin Password Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={`Reset Password: ${selectedEmployee?.name}`}
      >
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              New Assigned Password *
            </label>
            <input
              type="text"
              required
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="Enter new password for employee..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Set Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllEmployees;
