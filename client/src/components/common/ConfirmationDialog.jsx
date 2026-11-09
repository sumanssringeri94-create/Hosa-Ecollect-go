import React from 'react';
import Modal from './Modal';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action will proceed with the update.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'success', 'info'
  loading = false,
}) {
  const iconConfig = {
    warning: { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    danger: { icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' },
    success: { icon: CheckCircle, color: 'text-forest-600 bg-forest-50 border-forest-200' },
    info: { icon: Info, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  };

  const { icon: Icon, color } = iconConfig[type] || iconConfig.warning;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 ${color}`}>
          <Icon size={28} />
        </div>

        <h3 className="text-lg font-bold text-earth-900 mb-2">{title}</h3>
        <p className="text-sm text-earth-600 leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 ${
              type === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-xl'
                : 'btn-primary'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
