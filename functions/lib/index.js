"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAdminOnNotification = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
admin.initializeApp();
const SENDGRID_API_KEY = functions.config().sendgrid?.key;
const ADMIN_EMAIL = functions.config().admin?.email;
const FROM_EMAIL = functions.config().admin?.from || 'noreply@yourdomain.com';
if (SENDGRID_API_KEY) {
    mail_1.default.setApiKey(SENDGRID_API_KEY);
}
exports.emailAdminOnNotification = functions.firestore
    .document('adminNotifications/{notificationId}')
    .onCreate(async (snap, context) => {
    const payload = snap.data();
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
    if (payload.name)
        bodyLines.push(`Name: ${payload.name}`);
    if (payload.email)
        bodyLines.push(`Email: ${payload.email}`);
    if (payload.category)
        bodyLines.push(`Category: ${payload.category}`);
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
        await mail_1.default.send(msg);
        console.log('Admin email sent for notification', snap.id);
    }
    catch (err) {
        console.error('Failed to send admin notification email', err);
    }
});
