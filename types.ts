/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Ministry {
  id: string;
  name: string;
  category: string;
  image: string;
  day: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface SiteMetadata {
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  ctaPrimary: string;
  ctaSecondary: string;
  marqueeText: string;
  bannerText?: string;
}

export interface EventRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  postLink?: string;
  registerLink?: string;
  publishAt?: string;
  orderIndex?: number;
  published?: boolean;
  publishedAt?: string;
  scheduledPublishAt?: string;
  views?: number;
}

export interface SermonRecord {
  id: string;
  title: string;
  series: string;
  speaker: string;
  date: string;
  image: string;
  videoId: string;
  orderIndex?: number;
  published?: boolean;
  publishedAt?: string;
  scheduledPublishAt?: string;
  views?: number;
}

export interface MinistryRecord {
  id: string;
  name: string;
  category: string;
  day: string;
  image: string;
  description: string;
  orderIndex?: number;
  published?: boolean;
  publishedAt?: string;
  scheduledPublishAt?: string;
  views?: number;
}

export interface PastorRecord {
  id: string;
  name: string;
  role: string;
  image: string;
  orderIndex?: number;
  published?: boolean;
  publishedAt?: string;
  scheduledPublishAt?: string;
  views?: number;
}

export interface TestimonyRecord {
  id: string;
  quote: string;
  author: string;
  role: string;
  orderIndex?: number;
  published?: boolean;
  publishedAt?: string;
  scheduledPublishAt?: string;
  views?: number;
}

export interface PrayerRequestRecord {
  id: string;
  name?: string;
  email?: string;
  request: string;
  createdAt?: Date;
}

export interface ConnectRequestRecord {
  id: string;
  name: string;
  email?: string;
  category?: string;
  message?: string;
  createdAt?: Date;
}

export interface PastoralCareRequestRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceType: 'child-dedication' | 'house-dedication' | 'business-dedication' | 'funeral-service';
  datePreference: string;
  timePreference: string;
  message?: string;
  createdAt?: Date;
}

export interface LivestreamConfig {
  status: boolean;
  nextService: string;
  streamUrl?: string;
}

export enum Section {
  HERO = 'hero',
  LINEUP = 'lineup',
  EXPERIENCE = 'experience',
  TICKETS = 'tickets',
}

export interface PageViewEvent {
  id?: string;
  pageType: 'sermon' | 'event' | 'ministry' | 'pastor';
  itemId: string;
  timestamp: string;
  userAgent?: string;
}

export interface AdminNotification {
  id?: string;
  type: 'prayer' | 'connect' | 'pastoral-care';
  label: string;
  name: string;
  email?: string;
  message?: string;
  category?: string;
  request?: string;
  isRead: boolean;
  createdAt: string;
  priority?: 'normal' | 'urgent';
}

