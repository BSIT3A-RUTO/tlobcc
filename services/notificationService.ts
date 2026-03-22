import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { AdminNotification } from '../types';

const notificationsCollection = collection(db, 'adminNotifications');

export async function createAdminNotification(
  type: 'prayer' | 'connect' | 'pastoral-care',
  data: {
    label: string;
    name: string;
    email?: string;
    message?: string;
    category?: string;
    request?: string;
    priority?: 'normal' | 'urgent';
  }
): Promise<void> {
  try {
    await addDoc(notificationsCollection, {
      type,
      label: data.label,
      name: data.name,
      email: data.email || null,
      message: data.message || null,
      category: data.category || null,
      request: data.request || null,
      priority: data.priority || 'normal',
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to create admin notification:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(notificationsCollection, notificationId), {
      isRead: true,
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const docs = await getDocs(
      query(notificationsCollection, where('isRead', '==', false))
    );

    const updates = docs.docs.map(d =>
      updateDoc(doc(notificationsCollection, d.id), { isRead: true })
    );

    await Promise.all(updates);
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
}

export async function getUnreadNotifications(): Promise<AdminNotification[]> {
  try {
    const docs = await getDocs(
      query(
        notificationsCollection,
        where('isRead', '==', false),
        orderBy('createdAt', 'desc')
      )
    );

    return docs.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() || new Date(),
    })) as AdminNotification[];
  } catch (error) {
    console.error('Failed to get unread notifications:', error);
    return [];
  }
}

export async function getAllNotifications(limit: number = 50): Promise<AdminNotification[]> {
  try {
    const docs = await getDocs(
      query(
        notificationsCollection,
        orderBy('createdAt', 'desc')
      )
    );

    return docs.docs
      .slice(0, limit)
      .map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
      })) as AdminNotification[];
  } catch (error) {
    console.error('Failed to get all notifications:', error);
    return [];
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(notificationsCollection, notificationId), {
      isDeleted: true,
    });
  } catch (error) {
    console.error('Failed to delete notification:', error);
    throw error;
  }
}

// Email notification settings (stored in admin user profile)
export interface EmailNotificationSettings {
  enabled: boolean;
  email: string;
  notificationTypes: ('prayer' | 'connect' | 'pastoral-care')[];
  frequency: 'immediate' | 'daily' | 'weekly';
}

const adminSettingsCollection = collection(db, 'adminSettings');

export async function getEmailNotificationSettings(userId: string): Promise<EmailNotificationSettings | null> {
  try {
    const docs = await getDocs(
      query(adminSettingsCollection, where('userId', '==', userId))
    );

    if (docs.empty) return null;
    return docs.docs[0].data() as EmailNotificationSettings;
  } catch (error) {
    console.error('Failed to get email notification settings:', error);
    return null;
  }
}

export async function saveEmailNotificationSettings(
  userId: string,
  settings: EmailNotificationSettings
): Promise<void> {
  try {
    const existingDocs = await getDocs(
      query(adminSettingsCollection, where('userId', '==', userId))
    );

    if (existingDocs.empty) {
      await addDoc(adminSettingsCollection, {
        userId,
        ...settings,
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(doc(adminSettingsCollection, existingDocs.docs[0].id), {
        ...settings,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Failed to save email notification settings:', error);
    throw error;
  }
}
