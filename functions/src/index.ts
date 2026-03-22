import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

admin.initializeApp();

const SENDGRID_API_KEY = functions.config().sendgrid?.key;
const ADMIN_EMAIL = functions.config().admin?.email;
const FROM_EMAIL = functions.config().admin?.from || 'noreply@yourdomain.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface AdminNotification {
  type: 'connect' | 'prayer';
  category?: string;
  name?: string;
  email?: string | null;
  request?: string;
  message?: string | null;
  createdAt?: FirebaseFirestore.Timestamp;
  isRead?: boolean;
  label?: string;
}

export const emailAdminOnNotification = functions.firestore
  .document('adminNotifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const payload = snap.data() as AdminNotification;
    if (!SENDGRID_API_KEY || !ADMIN_EMAIL) {
      console.warn('SendGrid or admin email not configured; skipping email send.');
      return;
    }

    const isUrgent = payload.type === 'prayer';
    const subject = isUrgent
      ? `🔥 URGENT Prayer Request — ${payload.name ?? 'Anonymous'}`
      : `New Connect Signup: ${payload.category ?? 'Connect'}`;

    const bodyLines = [
      `${isUrgent ? 'URGENT: Prayer request submitted.' : 'A new connect submission has arrived.'}`,
      '',
    ];
    if (payload.name) bodyLines.push(`Name: ${payload.name}`);
    if (payload.email) bodyLines.push(`Email: ${payload.email}`);
    if (payload.category) bodyLines.push(`Category: ${payload.category}`);
    if (payload.type === 'prayer' && payload.request) {
      bodyLines.push('Request:');
      bodyLines.push(payload.request);
    }
    if (payload.type === 'connect' && payload.message) {
      bodyLines.push('Message:');
      bodyLines.push(payload.message);
    }
    bodyLines.push('');
    bodyLines.push('View this in your admin dashboard: [your app link]');

    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject,
      text: bodyLines.join('\n'),
      html: `<div>${bodyLines.map((line) => line === '' ? '<br>' : `<p>${line}</p>`).join('')}</div>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Admin email sent for notification', snap.id);
    } catch (err) {
      console.error('Failed to send admin notification email', err);
    }
  });
