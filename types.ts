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

export enum Section {
  HERO = 'hero',
  LINEUP = 'lineup',
  EXPERIENCE = 'experience',
  TICKETS = 'tickets',
}
