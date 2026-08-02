import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu, Shield, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-800 flex items-center justify-center text-white shadow-md font-extrabold text-sm tracking-widest">
            LE
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white leading-tight hidden sm:block text-base tracking-tight">
              LeaveEase
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Enterprise HR Management System
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isAdmin
              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              : 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
          }`}
        >
          {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
          {isAdmin ? 'Administrator' : 'Employee'}
        </span>

        {/* Dark / Light / System Theme Toggle */}
        <ThemeToggle />

        {/* Notification Center Dropdown */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-semibold flex items-center justify-center text-sm shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.department}</p>
            </div>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-fade-in"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                <p className="text-[10px] font-mono text-brand-700 dark:text-brand-400 mt-0.5">ID: {user?.employeeId}</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-700"
              >
                <User className="w-4 h-4 text-slate-400" />
                My Profile
              </Link>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
