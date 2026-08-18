import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserNotifications, markNotificationAsRead } from '../../services/notificationService';
import { Bell, Check, Sparkles, Calendar, Key, AlertCircle, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const NotificationDropdown = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await getUserNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000); // Poll every 15s for new notifications
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await markNotificationAsRead(notif._id);
        fetchNotifs();
      }
    } catch (err) {
      console.error(err);
    }

    setIsOpen(false);

    // Dynamic Navigation based on Notification Type & User Role
    switch (notif.type) {
      case 'Leave':
        navigate(isAdmin ? '/admin/leaves' : '/leave-history');
        break;
      case 'Password':
        navigate(isAdmin ? '/admin/password-requests' : '/profile');
        break;
      case 'Holiday':
        navigate(isAdmin ? '/admin/holidays' : '/holidays');
        break;
      case 'Account':
        navigate(isAdmin ? '/admin/employees' : '/profile');
        break;
      case 'System':
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
        break;
      default:
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
        break;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Holiday':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Leave':
        return <Calendar className="w-4 h-4 text-brand-600" />;
      case 'Password':
        return <Key className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-fade-in">
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold">
                  {unreadCount} Unread
                </span>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <p className="p-6 text-xs text-slate-400 text-center">No notifications at this time.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    !n.isRead
                      ? 'bg-brand-50/50 dark:bg-brand-950/20 hover:bg-brand-100/50 dark:hover:bg-brand-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex-shrink-0 mt-0.5 border border-slate-100 dark:border-slate-700">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 pt-1">
                      View details <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0 mt-2"></span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
