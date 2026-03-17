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
}

export interface SermonRecord {
  id: string;
  title: string;
  series: string;
  speaker: string;
  date: string;
  image: string;
  videoId: string;
}

export interface EventRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface MinistryRecord {
  id: string;
  name: string;
  category: string;
  day: string;
  image: string;
  description: string;
}

export interface TestimonyRecord {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface PastorRecord {
  id: string;
  name: string;
  role: string;
  image: string;
}

export enum Section {
  HERO = 'hero',
  LINEUP = 'lineup',
  EXPERIENCE = 'experience',
  TICKETS = 'tickets',
}
