import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Bell, Check, Trash2, Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserNotifications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(
    storageService.getNotifications(user?.role, user?.id)
  );

  const handleMarkAsRead = (id) => {
    const updated = storageService.markNotificationAsRead(id);
    setNotifications(storageService.getNotifications(user?.role, user?.id));
    toast.success('Notification marked as read');
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsAsRead(user?.role);
    setNotifications(storageService.getNotifications(user?.role, user?.id));
    toast.success('All notifications marked as read');
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! New status alerts and schedule reminders will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`card p-4 flex items-start justify-between gap-4 transition-colors ${
                item.read ? 'bg-white border-sand-200' : 'bg-forest-50/50 border-forest-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'success'
                      ? 'bg-forest-100 text-forest-800'
                      : item.type === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <Bell size={16} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-earth-950">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                    )}
                  </div>
                  <p className="text-xs text-earth-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-earth-400 mt-2 block">
                    {item.time}
                  </span>
                </div>
              </div>

              {!item.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(item.id)}
                  className="text-xs font-semibold text-forest-800 hover:underline shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
