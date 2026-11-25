import React, { useState, useEffect } from 'react';
import { notificationsApi } from '../../api';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Bell, Check, Clock, CheckCircle2, AlertTriangle, Info, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserNotifications() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await notificationsApi.markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => ((n._id || n.id) === id ? { ...n, read: true } : n))
        );
        toast.success('Notification marked as read');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationsApi.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to mark all as read');
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications & Alerts"
        subtitle="Live tracking alerts, pickup status changes, and platform announcements."
        actions={
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <Check size={14} /> Mark all read
          </button>
        }
      />

      <div className="flex gap-2 border-b border-sand-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'all' ? 'bg-forest-900 text-white' : 'text-earth-600 hover:bg-sand-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'unread' ? 'bg-forest-900 text-white' : 'text-earth-600 hover:bg-sand-100'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No notifications"
          description={filter === 'unread' ? 'You have read all your alerts!' : 'No new notifications to display.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const notifId = item._id || item.id;
            return (
              <div
                key={notifId}
                className={`card p-4 transition-all flex items-start justify-between gap-4 border ${
                  item.read
                    ? 'bg-sand-50/50 border-sand-200'
                    : 'bg-white border-forest-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'assignment'
                        ? 'bg-terracotta-100 text-terracotta-800'
                        : item.type === 'success'
                        ? 'bg-forest-100 text-forest-800'
                        : item.type === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sand-200 text-earth-800'
                    }`}
                  >
                    {item.type === 'assignment' ? (
                      <Tag size={18} />
                    ) : item.type === 'success' ? (
                      <CheckCircle2 size={18} />
                    ) : item.type === 'warning' ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <Info size={18} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-earth-900 text-xs sm:text-sm">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-earth-600 mt-0.5 leading-relaxed">{item.message}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-earth-400 mt-2 font-mono">
                      <Clock size={11} />
                      {new Date(item.createdAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>

                {!item.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notifId)}
                    className="btn-ghost text-xs text-forest-800 hover:text-forest-950 shrink-0 p-1.5"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
