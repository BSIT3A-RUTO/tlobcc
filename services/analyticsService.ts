import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { PageViewEvent } from '../types';

const analyticsCollection = collection(db, 'analytics');
const pageViewsRef = collection(db, 'analytics');

export async function trackPageView(pageType: 'sermon' | 'event' | 'ministry' | 'pastor', itemId: string): Promise<void> {
  try {
    await addDoc(pageViewsRef, {
      eventType: 'pageView',
      pageType,
      itemId,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

interface AnalyticsData {
  totalViews: number;
  viewsByType: Record<string, number>;
  submissions: {
    prayers: number;
    pastoral: number;
    connects: number;
  };
  recentSubmissions: Array<{
    type: string;
    name: string;
    timestamp: Date;
  }>;
}

export async function getAnalyticsDashboard(): Promise<AnalyticsData> {
  try {
    // Get total page views from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const pageViewsQuery = query(
      pageViewsRef,
      where('eventType', '==', 'pageView'),
      where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      orderBy('timestamp', 'desc')
    );

    const pageViewsDocs = await getDocs(pageViewsQuery);
    const pageViews = pageViewsDocs.docs.map(doc => doc.data());

    // Count by type
    const viewsByType: Record<string, number> = {};
    pageViews.forEach((view: any) => {
      viewsByType[view.pageType] = (viewsByType[view.pageType] || 0) + 1;
    });

    // Get submission counts from last 30 days
    const prayersCollection = collection(db, 'prayerRequests');
    const connectsCollection = collection(db, 'connectRequests');
    const pastoralCollection = collection(db, 'pastoralRequests');

    const prayersQuery = query(
      prayersCollection,
      where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      orderBy('createdAt', 'desc')
    );
    const connectsQuery = query(
      connectsCollection,
      where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      orderBy('createdAt', 'desc')
    );
    const pastoralQuery = query(
      pastoralCollection,
      where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      orderBy('createdAt', 'desc')
    );

    const prayersDocs = await getDocs(prayersQuery);
    const connectsDocs = await getDocs(connectsQuery);
    const pastoralDocs = await getDocs(pastoralQuery);

    // Compile recent submissions
    const recentSubmissions = [
      ...prayersDocs.docs.map((d: any) => ({
        type: 'prayer',
        name: d.data().name || 'Anonymous',
        timestamp: d.data().createdAt?.toDate?.() || new Date(),
      })),
      ...connectsDocs.docs.map((d: any) => ({
        type: 'connect',
        name: d.data().name || 'Unknown',
        timestamp: d.data().createdAt?.toDate?.() || new Date(),
      })),
      ...pastoralDocs.docs.map((d: any) => ({
        type: 'pastoral',
        name: d.data().name || 'Unknown',
        timestamp: d.data().createdAt?.toDate?.() || new Date(),
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

    return {
      totalViews: pageViews.length,
      viewsByType,
      submissions: {
        prayers: prayersDocs.size,
        pastoral: pastoralDocs.size,
        connects: connectsDocs.size,
      },
      recentSubmissions,
    };
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return {
      totalViews: 0,
      viewsByType: {},
      submissions: { prayers: 0, pastoral: 0, connects: 0 },
      recentSubmissions: [],
    };
  }
}

export async function getPageViewTrends(pageType: string, days: number = 30): Promise<Array<{ date: string; count: number }>> {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const pageViewsQuery = query(
      pageViewsRef,
      where('eventType', '==', 'pageView'),
      where('pageType', '==', pageType),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'asc')
    );

    const docs = await getDocs(pageViewsQuery);
    const views = docs.docs.map(d => d.data());

    // Group by date
    const trendsByDate: Record<string, number> = {};
    views.forEach((view: any) => {
      const date = view.timestamp?.toDate?.() || new Date();
      const dateStr = date.toISOString().split('T')[0];
      trendsByDate[dateStr] = (trendsByDate[dateStr] || 0) + 1;
    });

    return Object.entries(trendsByDate).map(([date, count]) => ({ date, count }));
  } catch (error) {
    console.error('Failed to get page view trends:', error);
    return [];
  }
}

export async function getTopPages(days: number = 30): Promise<Array<{ pageType: string; itemId: string; views: number }>> {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const pageViewsQuery = query(
      pageViewsRef,
      where('eventType', '==', 'pageView'),
      where('timestamp', '>=', Timestamp.fromDate(startDate))
    );

    const docs = await getDocs(pageViewsQuery);
    const views = docs.docs.map(d => d.data());

    // Group by pageType + itemId
    const viewCounts: Record<string, number> = {};
    const pageTypes: Record<string, string> = {};
    views.forEach((view: any) => {
      const key = `${view.pageType}:${view.itemId}`;
      viewCounts[key] = (viewCounts[key] || 0) + 1;
      pageTypes[key] = view.pageType;
    });

    return Object.entries(viewCounts)
      .map(([key, count]) => {
        const [pageType, itemId] = key.split(':');
        return { pageType, itemId, views: count as number };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  } catch (error) {
    console.error('Failed to get top pages:', error);
    return [];
  }
}
