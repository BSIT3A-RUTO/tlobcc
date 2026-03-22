import { useState, useCallback, useEffect } from 'react';
import {
  getAllNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/notificationService';
import type { AdminNotification } from '../types';

interface UseAdminNotificationsResult {
  notifications: AdminNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotif: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAdminNotifications(): UseAdminNotificationsResult {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allNotifs = await getAllNotifications(50);
      setNotifications(allNotifs);
      setUnreadCount(allNotifs.filter((n) => !n.isRead).length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Refresh notifications every 30 seconds
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await markNotificationAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to mark as read';
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const markAllRead = useCallback(async () => {
    try {
      setError(null);
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to mark all as read';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const deleteNotif = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await deleteNotification(id);
        setNotifications((prev) => {
          const newNotifs = prev.filter((n) => n.id !== id);
          const wasUnread = !prev.find((n) => n.id === id)?.isRead;
          if (wasUnread) {
            setUnreadCount((c) => Math.max(0, c - 1));
          }
          return newNotifs;
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete notification';
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllRead,
    deleteNotif,
    refresh,
  };
}
