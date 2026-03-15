import { Ministry } from './types';

export const MINISTRIES: Ministry[] = [
  { 
    id: '1', 
    name: 'Sunday Worship', 
    category: 'Main Service', 
    day: 'SUN 9AM', 
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1000&auto=format&fit=crop',
    description: 'Join us every Sunday morning for a time of passionate worship, biblical teaching, and authentic community at TLOBCC Navotas.'
  },
  { 
    id: '2', 
    name: 'Youth Ministry', 
    category: 'Next Gen', 
    day: 'SAT 4PM', 
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5ce25c59a?q=80&w=1000&auto=format&fit=crop',
    description: 'Empowering the next generation of Navotas to live out their faith boldly. A place for teenagers to connect, grow, and serve.'
  },
  { 
    id: '3', 
    name: 'Kids Church', 
    category: 'Children', 
    day: 'SUN 9AM', 
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1000&auto=format&fit=crop',
    description: 'A fun, safe, and engaging environment where children learn about God\'s love through interactive lessons and activities.'
  },
  { 
    id: '4', 
    name: 'Life Groups', 
    category: 'Community', 
    day: 'WEEKDAYS', 
    image: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=1000&auto=format&fit=crop',
    description: 'Small groups meeting throughout the week in various locations around Navotas to study the Word, pray together, and build lasting relationships.'
  },
  { 
    id: '5', 
    name: 'Prayer Meeting', 
    category: 'Spiritual Growth', 
    day: 'WED 7PM', 
    image: 'https://images.unsplash.com/photo-1544427920-c49ccfaf8c56?q=80&w=1000&auto=format&fit=crop',
    description: 'A dedicated time mid-week to seek God\'s face, intercede for our community, and experience the power of corporate prayer.'
  },
  { 
    id: '6', 
    name: 'Outreach', 
    category: 'Missions', 
    day: 'MONTHLY', 
    image: 'https://images.unsplash.com/photo-1593113514676-5f0140ae288a?q=80&w=1000&auto=format&fit=crop',
    description: 'Taking the love of Christ beyond our walls. We actively serve our local community in Navotas and beyond.'
  },
];

export const PASTORS = [
  { name: 'Ptr. Jose Santos', role: 'Lead Pastor', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' },
  { name: 'Ptr. Maria Reyes', role: 'Youth & Family Pastor', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
  { name: 'Mark Bautista', role: 'Worship Director', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop' },
];

export const SERMONS = [
  { id: 1, title: 'The Power of Grace', series: 'Foundations', speaker: 'Ptr. Jose Santos', date: 'Oct 15, 2023', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop', videoId: 'dQw4w9WgXcQ' },
  { id: 2, title: 'Walking in Faith', series: 'Foundations', speaker: 'Ptr. Jose Santos', date: 'Oct 8, 2023', image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop', videoId: 'dQw4w9WgXcQ' },
  { id: 3, title: 'A Heart of Worship', series: 'Stand-alone', speaker: 'Mark Bautista', date: 'Oct 1, 2023', image: 'https://images.unsplash.com/photo-1510915361894-faa8b2d80c85?q=80&w=800&auto=format&fit=crop', videoId: 'dQw4w9WgXcQ' },
  { id: 4, title: 'Overcoming Fear', series: 'Victory', speaker: 'Ptr. Maria Reyes', date: 'Sep 24, 2023', image: 'https://images.unsplash.com/photo-1447069387366-2a347062816e?q=80&w=800&auto=format&fit=crop', videoId: 'dQw4w9WgXcQ' },
  { id: 5, title: 'The Purpose of Prayer', series: 'Foundations', speaker: 'Ptr. Jose Santos', date: 'Sep 17, 2023', image: 'https://images.unsplash.com/photo-1544427920-c49ccfaf8c56?q=80&w=800&auto=format&fit=crop', videoId: 'dQw4w9WgXcQ' },
  { id: 6, title: 'Living Generously', series: 'Stand-alone', speaker: 'Ptr. Jose Santos', date: 'Sep 10, 2023', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop', videoId: 'dQw4w9WgXcQ' },
];

export const EVENTS = [
  { id: 1, title: 'Night of Worship', date: 'NOV 12', time: '7:00 PM', location: 'Main Sanctuary', description: 'An extended evening of praise, worship, and waiting on the Lord.' },
  { id: 2, title: 'Community Outreach', date: 'NOV 18', time: '8:00 AM', location: 'Navotas City Plaza', description: 'Serving our local community through food distribution and medical assistance.' },
  { id: 3, title: 'Next Steps Class', date: 'NOV 19', time: '11:00 AM', location: 'Room 101', description: 'New to TLOBCC? Join us to learn more about our church and how to get connected.' },
];
