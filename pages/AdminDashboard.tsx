import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore';

// Imports from services
import {
  getSiteMetadata,
  setSiteMetadata,
  getPrayers,
  deletePrayer,
  getPastoralRequests,
  deletePastoralRequest,
  getLivestream,
  setLivestream,
} from '../services/contentService';

// New component imports
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminDashboardOverview } from '../components/admin/AdminDashboardOverview';
import { CollapsibleFormSection } from '../components/admin/CollapsibleFormSection';
import { ImageUploadField } from '../components/admin/ImageUploadField';
import { QuickEditModal } from '../components/admin/QuickEditModal';
import { ContentTable } from '../components/admin/ContentTable';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';
import { PublishingCalendar } from '../components/admin/PublishingCalendar';

// Hook imports
import { useAdminContent } from '../hooks/useAdminContent';
import { useAdminNotifications } from '../hooks/useAdminNotifications';

import type { SiteMetadata, LivestreamConfig, PrayerRequestRecord, PastoralCareRequestRecord } from '../types';

const DEFAULT_METADATA: SiteMetadata = {
  heroTitle: 'TLOBCC',
  heroSubtitle: 'Loving God. Reaching People. Making Disciples.',
  mission: 'A place where all are welcome to pursue Jesus and community.',
  ctaPrimary: 'Plan a Visit',
  ctaSecondary: 'Join a Life Group',
  marqueeText: 'THE LORD OUR BANNER ● CHRISTIAN CHURCH',
  bannerText: 'Welcome to TLOBCC — Sunday Service starts at 9AM! Join us live now.',
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [adminStatus, setAdminStatus] = useState<string>('Checking admin status...');
  const [status, setStatus] = useState<string>('');
  const [metadata, setMetadata] = useState<SiteMetadata>(DEFAULT_METADATA);
  const [prayers, setPrayers] = useState<PrayerRequestRecord[]>([]);
  const [pastoralRequests, setPastoralRequests] = useState<PastoralCareRequestRecord[]>([]);
  const [livestream, setLivestreaming] = useState<LivestreamConfig>({ status: false, nextService: '' });
  const [prayerRequestCount, setPrayerRequestCount] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Use custom hooks for content management
  const sermons = useAdminContent('sermon');
  const events = useAdminContent('event');
  const ministries = useAdminContent('ministry');
  const pastors = useAdminContent('pastor');
  const testimonials = useAdminContent('testimonial');
  const notifications = useAdminNotifications();

  // Load admin status
  const loadAdminStatus = async () => {
    const user = auth.currentUser;
    if (!user) {
      setAdminStatus('Not signed in.');
      return;
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setAdminStatus(`User document missing at users/${user.uid}`);
        return;
      }
      const data = userDoc.data() as Record<string, unknown>;
      setAdminStatus(`uid=${user.uid.slice(0, 8)}... role=${data.role ?? 'n/a'} isAdmin=${data.isAdmin === true}`);
    } catch (error) {
      setAdminStatus('Could not read users/{uid}: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Initial load
  useEffect(() => {
    const load = async () => {
      await loadAdminStatus();

      try {
        const meta = await getSiteMetadata();
        if (meta) setMetadata(meta);
      } catch {
        setStatus('Failed to load site metadata.');
      }

      try {
        const prayersData = await getPrayers();
        setPrayers(prayersData);
        setPrayerRequestCount(prayersData.length);
      } catch {
        setPrayers([]);
      }

      try {
        const pastoralData = await getPastoralRequests();
        setPastoralRequests(pastoralData);
      } catch {
        setPastoralRequests([]);
      }

      try {
        const livestreamData = await getLivestream();
        if (livestreamData) setLivestreaming(livestreamData);
      } catch {
        // use default
      }
    };

    load();
  }, []);

  const handleRepairAdmin = async () => {
    const user = auth.currentUser;
    if (!user) {
      setStatus('No signed-in user to repair.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        email: user.email,
        isAdmin: true,
        admin: true,
        role: 'admin',
        displayName: user.displayName || null,
        updatedAt: new Date().toISOString(),
      });
      setStatus('Admin flags repaired on user document.');
      await loadAdminStatus();
    } catch (err) {
      setStatus('Failed to repair admin flags: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSaveMetadata = async () => {
    if (!auth.currentUser) {
      setStatus('You must be signed in to save metadata. Please sign in again.');
      return;
    }
    setStatus('Saving site metadata...');
    try {
      await setSiteMetadata(metadata);
      setStatus('Site metadata saved successfully.');
    } catch (err) {
      setStatus(`Failed to save site metadata: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
  };

  const handleSaveLivestream = async () => {
    setStatus('Saving livestream config...');
    try {
      await setLivestream(livestream);
      setStatus('Livestream config saved.');
    } catch (err) {
      setStatus(`Failed to save: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Render tab content handlers...
  const renderOverviewTab = () => (
    <AdminDashboardOverview
      prayerRequestCount={prayerRequestCount}
      unreadNotifications={notifications.unreadCount}
      recentNotifications={notifications.notifications}
    />
  );

  const renderSermonsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            sermons.addNewItem({
              title: 'New Sermon',
              series: 'Series',
              speaker: 'Speaker',
              date: new Date().toISOString().split('T')[0],
              image: '',
              videoId: '',
            });
          }}
          className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          + Add Sermon
        </button>
        <button
          onClick={() => sermons.refresh()}
          className="px-4 py-2 rounded-lg bg-slate-700 text-sm font-semibold hover:bg-slate-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}
      <ContentTable
        items={sermons.items}
        columns={[
          { key: 'title', label: 'Title', width: '30%' },
          { key: 'speaker', label: 'Speaker', width: '20%' },
          { key: 'series', label: 'Series', width: '25%' },
          { key: 'date', label: 'Date', width: '25%' },
        ]}
        onEdit={(item) => {
          setEditingItem(item);
          setEditModalOpen(true);
        }}
        onDelete={(id) => sermons.deleteItem(id)}
        loading={sermons.loading}
      />
      <QuickEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        itemType="sermon"
        onSave={sermons.saveItem}
      />
    </div>
  );

  const renderSiteMetadataTab = () => (
    <div className="space-y-4">
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}

      <CollapsibleFormSection title="Hero Section" defaultOpen>
        <div>
          <label className="text-xs uppercase text-slate-400 font-semibold">Hero Title</label>
          <input
            value={metadata.heroTitle}
            onChange={(e) => setMetadata((prev) => ({ ...prev, heroTitle: e.target.value }))}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slate-400 font-semibold">Hero Subtitle</label>
          <input
            value={metadata.heroSubtitle}
            onChange={(e) => setMetadata((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
          />
        </div>
      </CollapsibleFormSection>

      <CollapsibleFormSection title="Mission & CTA" defaultOpen>
        <div>
          <label className="text-xs uppercase text-slate-400 font-semibold">Mission Statement</label>
          <textarea
            value={metadata.mission}
            onChange={(e) => setMetadata((prev) => ({ ...prev, mission: e.target.value }))}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white h-20"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs uppercase text-slate-400 font-semibold">Primary CTA</label>
            <input
              value={metadata.ctaPrimary}
              onChange={(e) => setMetadata((prev) => ({ ...prev, ctaPrimary: e.target.value }))}
              className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-slate-400 font-semibold">Secondary CTA</label>
            <input
              value={metadata.ctaSecondary}
              onChange={(e) => setMetadata((prev) => ({ ...prev, ctaSecondary: e.target.value }))}
              className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
            />
          </div>
        </div>
      </CollapsibleFormSection>

      <CollapsibleFormSection title="Marquee & Banner" defaultOpen>
        <div>
          <label className="text-xs uppercase text-slate-400 font-semibold">Marquee Text</label>
          <input
            value={metadata.marqueeText}
            onChange={(e) => setMetadata((prev) => ({ ...prev, marqueeText: e.target.value }))}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-slate-400 font-semibold">Banner Text (Navbar)</label>
          <input
            value={metadata.bannerText ?? ''}
            onChange={(e) => setMetadata((prev) => ({ ...prev, bannerText: e.target.value }))}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
          />
        </div>
      </CollapsibleFormSection>

      <button
        onClick={handleSaveMetadata}
        className="w-full px-4 py-2 rounded-lg bg-[#4fb7b3] text-black font-semibold hover:bg-[#4fb7b3]/90 transition-colors"
      >
        Save Site Metadata
      </button>
    </div>
  );

  const renderLivestream = () => (
    <div className="space-y-4">
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}

      <CollapsibleFormSection title="Livestream Status" defaultOpen>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={livestream.status}
            onChange={(e) => setLivestreaming((prev) => ({ ...prev, status: e.target.checked }))}
            className="rounded"
          />
          <span>Live Now</span>
        </label>
      </CollapsibleFormSection>

      <CollapsibleFormSection title="Next Service" defaultOpen>
        <input
          value={livestream.nextService}
          onChange={(e) => setLivestreaming((prev) => ({ ...prev, nextService: e.target.value }))}
          placeholder="e.g. Sunday 9AM"
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
        />
      </CollapsibleFormSection>

      <CollapsibleFormSection title="Stream URL">
        <input
          value={livestream.streamUrl || ''}
          onChange={(e) => setLivestreaming((prev) => ({ ...prev, streamUrl: e.target.value || undefined }))}
          placeholder="YouTube/RTMP URL"
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-sm text-white"
        />
      </CollapsibleFormSection>

      <button
        onClick={handleSaveLivestream}
        className="w-full px-4 py-2 rounded-lg bg-[#4fb7b3] text-black font-semibold hover:bg-[#4fb7b3]/90 transition-colors"
      >
        Save Livestream Config
      </button>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            events.addNewItem({
              title: 'New Event',
              date: new Date().toISOString().split('T')[0],
              time: '09:00',
              location: 'Location',
              description: 'Event description',
              image: '',
              postLink: '',
              registerLink: '',
            });
          }}
          className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          + Add Event
        </button>
        <button
          onClick={() => events.refresh()}
          className="px-4 py-2 rounded-lg bg-slate-700 text-sm font-semibold hover:bg-slate-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}
      <ContentTable
        items={events.items}
        columns={[
          { key: 'title', label: 'Title', width: '30%' },
          { key: 'date', label: 'Date', width: '20%' },
          { key: 'time', label: 'Time', width: '15%' },
          { key: 'location', label: 'Location', width: '35%' },
        ]}
        onEdit={(item) => {
          setEditingItem(item);
          setEditModalOpen(true);
        }}
        onDelete={(id) => events.deleteItem(id)}
        loading={events.loading}
      />
      <QuickEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        itemType="event"
        onSave={events.saveItem}
      />
    </div>
  );

  const renderMinistriesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            ministries.addNewItem({
              name: 'New Ministry',
              category: 'Category',
              day: 'Day',
              image: '',
              description: 'Ministry description',
            });
          }}
          className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          + Add Ministry
        </button>
        <button
          onClick={() => ministries.refresh()}
          className="px-4 py-2 rounded-lg bg-slate-700 text-sm font-semibold hover:bg-slate-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}
      <ContentTable
        items={ministries.items}
        columns={[
          { key: 'name', label: 'Name', width: '30%' },
          { key: 'category', label: 'Category', width: '25%' },
          { key: 'day', label: 'Day', width: '25%' },
          {
            key: 'description',
            label: 'Description',
            width: '20%',
            format: (val) => <span className="truncate">{val}</span>,
          },
        ]}
        onEdit={(item) => {
          setEditingItem(item);
          setEditModalOpen(true);
        }}
        onDelete={(id) => ministries.deleteItem(id)}
        loading={ministries.loading}
      />
      <QuickEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        itemType="ministry"
        onSave={ministries.saveItem}
      />
    </div>
  );

  const renderPastorsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            pastors.addNewItem({
              name: 'Pastor Name',
              role: 'Role',
              image: '',
            });
          }}
          className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          + Add Pastor
        </button>
        <button
          onClick={() => pastors.refresh()}
          className="px-4 py-2 rounded-lg bg-slate-700 text-sm font-semibold hover:bg-slate-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}
      <ContentTable
        items={pastors.items}
        columns={[
          { key: 'name', label: 'Name', width: '40%' },
          { key: 'role', label: 'Role', width: '60%' },
        ]}
        onEdit={(item) => {
          setEditingItem(item);
          setEditModalOpen(true);
        }}
        onDelete={(id) => pastors.deleteItem(id)}
        loading={pastors.loading}
      />
      <QuickEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        itemType="pastor"
        onSave={pastors.saveItem}
      />
    </div>
  );

  const renderTestimonialsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            testimonials.addNewItem({
              quote: 'New testimony quote...',
              author: 'Author Name',
              role: 'Role',
            });
          }}
          className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          + Add Testimonial
        </button>
        <button
          onClick={() => testimonials.refresh()}
          className="px-4 py-2 rounded-lg bg-slate-700 text-sm font-semibold hover:bg-slate-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}
      <ContentTable
        items={testimonials.items}
        columns={[
          {
            key: 'quote',
            label: 'Quote',
            width: '50%',
            format: (val) => <p className="truncate text-slate-300 italic">&quot;{val}&quot;</p>,
          },
          { key: 'author', label: 'Author', width: '25%' },
          { key: 'role', label: 'Role', width: '25%' },
        ]}
        onEdit={(item) => {
          setEditingItem(item);
          setEditModalOpen(true);
        }}
        onDelete={(id) => testimonials.deleteItem(id)}
        loading={testimonials.loading}
      />
      <QuickEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        itemType="testimonial"
        onSave={testimonials.saveItem}
      />
    </div>
  );

  const renderSubmissionsTab = () => (
    <div className="space-y-4">
      {status && <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-sm text-slate-200">{status}</div>}

      {/* Recent Notifications */}
      <CollapsibleFormSection title="Recent Submissions" defaultOpen>
        <div className="space-y-2">
          {notifications.notifications.length === 0 ? (
            <p className="text-sm text-slate-400">No submissions yet</p>
          ) : (
            notifications.notifications.slice(0, 20).map((notif) => (
              <div
                key={notif.id}
                className={`rounded-lg p-3 border ${
                  notif.isRead
                    ? 'border-white/10 bg-slate-900/40'
                    : 'border-[#4fb7b3]/30 bg-[#4fb7b3]/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold capitalize">
                      {notif.type === 'pastoral-care' ? 'Pastoral Care Request' : `${notif.type} Request`}
                    </p>
                    <p className="text-xs text-slate-400">{notif.name || 'Anonymous'}</p>
                    {notif.email && <p className="text-xs text-slate-400">{notif.email}</p>}
                    {notif.request && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{notif.request}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <button
                        onClick={() => notifications.markAsRead(notif.id || '')}
                        className="text-xs px-2 py-1 bg-[#4fb7b3]/20 text-[#4fb7b3] rounded hover:bg-[#4fb7b3]/30 transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => notifications.deleteNotif(notif.id || '')}
                      className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.unreadCount > 0 && (
          <button
            onClick={notifications.markAllRead}
            className="w-full mt-3 px-3 py-2 rounded-lg bg-[#4fb7b3]/20 text-[#4fb7b3] hover:bg-[#4fb7b3]/30 text-sm font-semibold transition-colors"
          >
            Mark All Read
          </button>
        )}
      </CollapsibleFormSection>

      {/* Prayer Requests */}
      {prayers.length > 0 && (
        <CollapsibleFormSection title="Prayer Requests">
          <div className="space-y-2">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="rounded-lg border border-white/10 bg-slate-900/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{prayer.name || 'Anonymous'}</p>
                    {prayer.email && <p className="text-xs text-slate-400">{prayer.email}</p>}
                    <p className="text-sm text-slate-300 mt-1">{prayer.request}</p>
                  </div>
                  <button
                    onClick={() => deletePrayer(prayer.id)}
                    className="flex-shrink-0 text-red-400 hover:text-red-300 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleFormSection>
      )}

      {/* Pastoral Requests */}
      {pastoralRequests.length > 0 && (
        <CollapsibleFormSection title="Pastoral Care Requests">
          <div className="space-y-2">
            {pastoralRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-white/10 bg-slate-900/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{request.name}</p>
                    <p className="text-xs text-slate-400">{request.email}</p>
                    <p className="text-xs text-slate-400 capitalize mt-1">
                      {request.serviceType.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Preference: {request.datePreference} @ {request.timePreference}
                    </p>
                    {request.message && (
                      <p className="text-xs text-slate-300 mt-1">{request.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deletePastoralRequest(request.id)}
                    className="flex-shrink-0 text-red-400 hover:text-red-300 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleFormSection>
      )}
    </div>
  );

  const renderAnalyticsTab = () => <AnalyticsDashboard />;

  const renderCalendarTab = () => <PublishingCalendar />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex gap-6">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={notifications.unreadCount} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-16 md:pt-0">
          {/* Top Bar */}
          <div className="sticky top-0 border-b border-white/10 bg-slate-900/80 backdrop-blur z-30 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">TLOBCC Admin</h1>
              <p className="text-xs text-slate-400 mt-1">{activeTab === 'overview' ? 'Dashboard' : activeTab.replace('-', ' ').toUpperCase()}</p>
            </div>
            <div className="text-xs text-slate-400">
              {adminStatus}
              <button onClick={handleRepairAdmin} className="ml-3 px-2 py-1 bg-slate-700 rounded hover:bg-slate-600 text-xs">
                Repair
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-w-7xl">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'sermons' && renderSermonsTab()}
            {activeTab === 'events' && renderEventsTab()}
            {activeTab === 'ministries' && renderMinistriesTab()}
            {activeTab === 'pastors' && renderPastorsTab()}
            {activeTab === 'testimonials' && renderTestimonialsTab()}
            {activeTab === 'site' && renderSiteMetadataTab()}
            {activeTab === 'livestream' && renderLivestream()}
            {activeTab === 'prayers' && renderSubmissionsTab()}
            {activeTab === 'pastoral-care' && renderSubmissionsTab()}
            {activeTab === 'connects' && renderSubmissionsTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
            {activeTab === 'calendar' && renderCalendarTab()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
