import { X } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsTabProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

export default function NotificationsTab({ notifications, removeNotification }: NotificationsTabProps) {
  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      case 'urgent':
        return 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No notifications yet. Task completions and updates will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`
                rounded-xl p-4 text-white flex items-start justify-between
                ${getNotificationStyles(notification.type)}
              `}
            >
              <div>
                <p className="font-semibold">{notification.message}</p>
                <p className="text-sm opacity-80 mt-1">
                  {notification.timestamp.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}