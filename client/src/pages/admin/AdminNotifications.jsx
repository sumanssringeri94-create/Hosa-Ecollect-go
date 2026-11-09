import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Bell, Check, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(
    storageService.getNotifications('admin')
  );

  const handleMarkAsRead = (id) => {
    storageService.markNotificationAsRead(id);
    setNotifications(storageService.getNotifications('admin'));
    toast.success('Alert marked as reviewed');
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsAsRead('admin');
    setNotifications(storageService.getNotifications('admin'));
    toast.success('All administrator alerts marked as reviewed');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Admin Incident & Compliance Alerts"
        subtitle="Platform risk monitoring, unallocated hazardous manifests, and partner verification triggers."
        actions={
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <Check size={14} /> Mark all reviewed
          </button>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All compliance alerts clear"
          description="There are currently no urgent notifications requiring administrator intervention."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`card p-4 flex items-start justify-between gap-4 transition-colors ${
                n.read ? 'bg-white border-sand-200' : 'bg-forest-50/50 border-forest-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                  <ShieldAlert size={17} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-earth-950">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-terracotta-500" />}
                  </div>
                  <p className="text-xs text-earth-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-earth-400 mt-2 block font-mono">
                    {n.time}
                  </span>
                </div>
              </div>

              {!n.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(n.id)}
                  className="text-xs font-semibold text-forest-800 hover:underline shrink-0"
                >
                  Mark reviewed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
