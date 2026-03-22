import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { getAnalyticsDashboard, getPageViewTrends, getTopPages } from '../../services/analyticsService';

interface AnalyticsData {
  totalViews: number;
  viewsByType: Record<string, number>;
  submissions: {
    prayers: number;
    pastoral: number;
    connects: number;
  };
}

interface Trend {
  date: string;
  count: number;
}

interface TopPage {
  pageType: string;
  itemId: string;
  views: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'sermon' | 'event' | 'ministry' | 'pastor'>('sermon');
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalyticsDashboard();
        setAnalytics(data);

        const trendsData = await getPageViewTrends(selectedType, dateRange);
        setTrends(trendsData);

        const topPagesData = await getTopPages(dateRange);
        setTopPages(topPagesData);
      } catch (error) {
        console.error('Failed to load analytics:', error);
        // Set default values on error
        setAnalytics({
          totalViews: 0,
          viewsByType: {},
          submissions: { prayers: 0, pastoral: 0, connects: 0 },
        });
        setTrends([]);
        setTopPages([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedType, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  // Simple bar chart renderer
  const renderSimpleBarChart = (data: Trend[]) => {
    if (data.length === 0) {
      return <p className="text-sm text-slate-400">No data available</p>;
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
      <div className="space-y-2">
        {data.map((item) => {
          const height = (item.count / maxCount) * 100;
          return (
            <div key={item.date} className="flex items-end gap-2">
              <span className="text-xs text-slate-400 w-16">{item.date}</span>
              <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#4fb7b3] to-[#3a9a97] transition-all"
                  style={{ width: `${height}%` }}
                />
              </div>
              <span className="text-xs text-slate-300 w-12 text-right">{item.count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-400 mb-2">Total Page Views</p>
          <p className="text-3xl font-bold text-[#4fb7b3]">{analytics?.totalViews || 0}</p>
          <p className="text-xs text-slate-400 mt-2">Last {dateRange} days</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-400 mb-2">Total Submissions</p>
          <p className="text-3xl font-bold text-emerald-400">
            {(analytics?.submissions.prayers || 0) +
              (analytics?.submissions.pastoral || 0) +
              (analytics?.submissions.connects || 0)}
          </p>
          <p className="text-xs text-slate-400 mt-2">Prayers, pastoral, connects</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-400 mb-2">Avg Daily Views</p>
          <p className="text-3xl font-bold text-blue-400">
            {analytics ? Math.round((analytics.totalViews / dateRange) * 10) / 10 : 0}
          </p>
          <p className="text-xs text-slate-400 mt-2">Per day average</p>
        </div>
      </div>

      {/* Submission Types Breakdown */}
      {analytics && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Submissions by Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
              <p className="text-sm text-slate-400 mb-2">Prayer Requests</p>
              <p className="text-2xl font-bold text-blue-400">{analytics.submissions.prayers}</p>
              <div className="mt-2 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${
                      ((analytics.submissions.prayers /
                        (analytics.submissions.prayers +
                          analytics.submissions.pastoral +
                          analytics.submissions.connects)) *
                        100) || 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
              <p className="text-sm text-slate-400 mb-2">Pastoral Care</p>
              <p className="text-2xl font-bold text-emerald-400">{analytics.submissions.pastoral}</p>
              <div className="mt-2 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${
                      ((analytics.submissions.pastoral /
                        (analytics.submissions.prayers +
                          analytics.submissions.pastoral +
                          analytics.submissions.connects)) *
                        100) || 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/50 border border-white/5">
              <p className="text-sm text-slate-400 mb-2">Connect Signups</p>
              <p className="text-2xl font-bold text-purple-400">{analytics.submissions.connects}</p>
              <div className="mt-2 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${
                      ((analytics.submissions.connects /
                        (analytics.submissions.prayers +
                          analytics.submissions.pastoral +
                          analytics.submissions.connects)) *
                        100) || 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page View Trends */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp size={20} />
            Page View Trends
          </h3>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value) as 7 | 30 | 90)}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            {(['sermon', 'event', 'ministry', 'pastor'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-[#4fb7b3] text-black'
                    : 'bg-slate-900/50 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {trends.length > 0 ? (
          renderSimpleBarChart(trends)
        ) : (
          <p className="text-sm text-slate-400">No data for this content type in the selected period</p>
        )}
      </div>

      {/* Top Pages */}
      {topPages.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Top Performing Content
          </h3>
          <div className="space-y-2">
            {topPages.slice(0, 10).map((page, idx) => (
              <div
                key={`${page.pageType}-${page.itemId}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-6">{idx + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">{page.pageType}</p>
                    <p className="text-xs text-slate-400">{page.itemId.slice(0, 12)}...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#4fb7b3]">{page.views}</p>
                  <p className="text-xs text-slate-400">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Notice */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
        <p className="text-sm text-slate-400">
          💡 Analytics dashboard shows last 30 days of data. Data is tracked automatically when users visit pages.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
