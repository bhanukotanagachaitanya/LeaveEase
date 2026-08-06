import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  User,
  Users,
  FileCheck2,
  CalendarDays,
  KeyRound,
  BarChart3,
  Megaphone,
  Key,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, logout, user } = useAuth();

  const employeeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Apply Leave', path: '/apply-leave', icon: CalendarPlus },
    { name: 'Leave History', path: '/leave-history', icon: History },
    { name: 'Holidays', path: '/holidays', icon: CalendarDays },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Leave Requests', path: '/admin/leaves', icon: FileCheck2 },
    { name: 'Employee Directory', path: '/admin/employees', icon: Users },
    { name: 'Password Requests', path: '/admin/password-requests', icon: Key },
    { name: 'Holiday Management', path: '/admin/holidays', icon: CalendarDays },
    { name: 'Company Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Password Audit Logs', path: '/admin/password-audit', icon: KeyRound },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with Clickable Logo Link */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <Link
            to={isAdmin ? '/admin/dashboard' : '/dashboard'}
            onClick={onClose}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center font-extrabold text-white shadow-lg text-sm tracking-widest group-hover:scale-105 transition-transform">
              LE
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight group-hover:text-brand-400 transition-colors">
                LeaveEase
              </h2>
              <span className="text-[11px] font-semibold text-brand-400 tracking-wider uppercase">
                {isAdmin ? 'Admin Console' : 'Employee Portal'}
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Accent */}
        <div className="mx-4 my-4 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-semibold text-white text-xs">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">ID: {user?.employeeId}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-2">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Main Navigation
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-900/30'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
