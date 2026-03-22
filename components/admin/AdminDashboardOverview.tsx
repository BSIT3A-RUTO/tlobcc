import React, { useEffect, useState } from 'react';
import { TrendingUp, FileText, Clock, CheckCircle2, AlertCircle, Bell } from 'lucide-react';
import { getAnalyticsDashboard } from '../../services/analyticsService';

interface DashboardStats {
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

interface AdminDashboardOverviewProps {
  prayerRequestCount: number;
  unreadNotifications: number;
  recentNotifications: Array<any>;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  prayerRequestCount,
  unreadNotifications,
  recentNotifications,
}) => {
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalyticsDashboard();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
        // Set default empty data instead of crashing
        setAnalytics({
          totalViews: 0,
          viewsByType: {},
          submissions: { prayers: 0, pastoral: 0, connects: 0 },
          recentSubmissions: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = 'blue',
  }: {
    icon: any;
    title: string;
    value: number | string;
    subtitle: string;
    color?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  }) => {
    const colorClasses: Record<string, string> = {
      blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      green: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      red: 'text-red-400 border-red-500/20 bg-red-500/5',
      purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      orange: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
    };

    return (
      <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
          </div>
          <Icon size={24} className="opacity-60" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          title="Page Views"
          value={analytics?.totalViews || 0}
          subtitle="Last 30 days"
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Prayer Requests"
          value={prayerRequestCount}
          subtitle="Total submissions"
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          title="Unread"
          value={unreadNotifications}
          subtitle="Waiting for review"
          color="red"
        />
        <StatCard
          icon={FileText}
          title="Submissions"
          value={
            (analytics?.submissions.prayers || 0) +
            (analytics?.submissions.pastoral || 0) +
            (analytics?.submissions.connects || 0)
          }
          subtitle="Last 30 days"
          color="orange"
        />
      </div>

      {/* Views by Type */}
      {analytics && Object.keys(analytics.viewsByType).length > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4">Views by Content Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.viewsByType).map(([type, count]) => (
              <div key={type} className="rounded-lg bg-slate-900/50 p-3 text-center border border-white/5">
                <p className="text-sm text-slate-400 capitalize mb-1">{type}</p>
                <p className="text-2xl font-bold text-[#4fb7b3]">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} />
            <h3 className="text-lg font-semibold">Recent Submissions</h3>
          </div>
          <div className="space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-sm text-slate-400">No recent submissions</p>
            ) : (
              recentNotifications.slice(0, 5).map((notif, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 border ${
                    notif.isRead
                      ? 'border-white/10 bg-slate-900/40'
                      : 'border-[#4fb7b3]/30 bg-[#4fb7b3]/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold capitalize">
                        {notif.type === 'pastoral-care' ? 'Pastoral Care' : notif.type}
                      </p>
                      <p className="text-xs text-slate-400">
                        {notif.name || 'Anonymous'}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="inline-block w-2 h-2 rounded-full bg-[#4fb7b3] mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submission Types */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold mb-4">Submissions Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5">
              <span className="text-sm text-slate-300">Prayer Requests</span>
              <span className="text-lg font-bold text-blue-400">
                {analytics?.submissions.prayers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5">
              <span className="text-sm text-slate-300">Pastoral Care</span>
              <span className="text-lg font-bold text-emerald-400">
                {analytics?.submissions.pastoral || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5">
              <span className="text-sm text-slate-300">Connect Signups</span>
              <span className="text-lg font-bold text-purple-400">
                {analytics?.submissions.connects || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-sm font-semibold text-blue-300">
            + Add Sermon
          </button>
          <button className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-sm font-semibold text-emerald-300">
            + Create Event
          </button>
          <button className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors text-sm font-semibold text-purple-300">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
