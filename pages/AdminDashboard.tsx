import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignOut } from '../services/authService';
import {
  getSiteMetadata,
  setSiteMetadata,
  getSermons,
  upsertSermon,
  deleteSermon,
  getEvents,
  upsertEvent,
  deleteEvent,
  getMinistries,
  upsertMinistry,
  deleteMinistry,
  SiteMetadata,
  SermonRecord,
  EventRecord,
  MinistryRecord,
} from '../services/contentService';
import { MINISTRIES, SERMONS, EVENTS } from '../data';

const DEFAULT_METADATA: SiteMetadata = {
  heroTitle: 'TLOBCC',
  heroSubtitle: 'Loving God. Reaching People. Making Disciples.',
  mission: 'A place where all are welcome to pursue Jesus and community.',
  ctaPrimary: 'Plan a Visit',
  ctaSecondary: 'Join a Life Group',
  marqueeText: 'THE LORD OUR BANNER ● CHRISTIAN CHURCH',
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'site' | 'sermons' | 'events' | 'ministries'>('site');
  const [metadata, setMetadata] = useState<SiteMetadata>(DEFAULT_METADATA);
  const [sermons, setSermons] = useState<SermonRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [ministries, setMinistries] = useState<MinistryRecord[]>([]);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const meta = await getSiteMetadata();
        if (meta) setMetadata(meta);
      } catch {
        setStatus('Failed to load site metadata.');
      }

      try {
        const sermonData = await getSermons();
        if (sermonData.length > 0) setSermons(sermonData);
        else setSermons(SERMONS.map((s) => ({ ...s, id: String(s.id) })));
      } catch {
        setSermons(SERMONS.map((s) => ({ ...s, id: String(s.id) })));
      }

      try {
        const eventData = await getEvents();
        if (eventData.length > 0) setEvents(eventData);
        else setEvents(EVENTS);
      } catch {
        setEvents(EVENTS);
      }

      try {
        const ministryData = await getMinistries();
        if (ministryData.length > 0) setMinistries(ministryData);
        else setMinistries(MINISTRIES);
      } catch {
        setMinistries(MINISTRIES);
      }
    };

    load();
  }, []);

  const logout = async () => {
    await adminSignOut();
    navigate('/admin/login');
  };

  const saveMetadata = async () => {
    setStatus('Saving site metadata...');
    try {
      await setSiteMetadata(metadata);
      setStatus('Site metadata saved successfully.');
    } catch (err) {
      console.error(err);
      setStatus('Failed to save site metadata.');
    }
  };

  const updateSermon = async (index: number, field: keyof SermonRecord, value: string) => {
    const next = [...sermons];
    next[index] = { ...next[index], [field]: value };
    setSermons(next);
  };

  const saveSermons = async () => {
    setStatus('Saving sermons...');
    try {
      await Promise.all(sermons.map((item) => upsertSermon(item)));
      setStatus('Sermons saved.');
    } catch {
      setStatus('Failed to save sermons.');
    }
  };

  const removeSermon = async (id: string) => {
    try {
      await deleteSermon(id);
    } catch {
      // ignore
    }
    setSermons((prev) => prev.filter((item) => item.id !== id));
  };

  const addSermon = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    setSermons((prev) => [
      ...prev,
      { id, title: 'New Message', series: 'Series', speaker: 'Speaker', date: 'TBD', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800', videoId: '' },
    ]);
  };

  const addEvent = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    setEvents((prev) => [...prev, { id, title: 'New Event', date: 'TBD', time: 'TBD', location: 'Location', description: 'Description' }]);
  };

  const updateEvent = (index: number, field: keyof EventRecord, value: string) => {
    const next = [...events];
    next[index] = { ...next[index], [field]: value };
    setEvents(next);
  };

  const saveEvents = async () => {
    setStatus('Saving events...');
    try {
      await Promise.all(events.map((item) => upsertEvent(item)));
      setStatus('Events saved.');
    } catch {
      setStatus('Failed to save events.');
    }
  };

  const removeEvent = async (id: string) => {
    try {
      await deleteEvent(id);
    } catch {
      // Continue.
    }
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  const addMinistry = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    setMinistries((prev) => [...prev, { id, name: 'New Ministry', category: 'Category', day: 'Day', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800', description: 'Description' }]);
  };

  const updateMinistry = (index: number, field: keyof MinistryRecord, value: string) => {
    const next = [...ministries];
    next[index] = { ...next[index], [field]: value };
    setMinistries(next);
  };

  const saveMinistries = async () => {
    setStatus('Saving ministries...');
    try {
      await Promise.all(ministries.map((item) => upsertMinistry(item)));
      setStatus('Ministries saved.');
    } catch {
      setStatus('Failed to save ministries.');
    }
  };

  const removeMinistry = async (id: string) => {
    try {
      await deleteMinistry(id);
    } catch {}
    setMinistries((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto border border-white/10 bg-slate-900/70 backdrop-blur-xl rounded-2xl overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold">TLOBCC Admin Dashboard</h1>
            <p className="text-slate-300 text-sm">Edit and manage website content from one place.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900" onClick={logout}>Sign Out</button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
          {['site', 'sermons', 'events', 'ministries'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === tab ? 'bg-[#4fb7b3] text-black' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {tab === 'site' ? 'Site Metadata' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-4">
          {status && <div className="mb-3 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-slate-200">{status}</div>}

          {activeTab === 'site' && (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div><label className="text-xs uppercase text-slate-400">Hero Title</label><input value={metadata.heroTitle} onChange={(e) => setMetadata((prev) => ({ ...prev, heroTitle: e.target.value }))} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-sm" /></div>
                <div><label className="text-xs uppercase text-slate-400">Hero Subtitle</label><input value={metadata.heroSubtitle} onChange={(e) => setMetadata((prev) => ({ ...prev, heroSubtitle: e.target.value }))} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-sm" /></div>
              </div>
              <div><label className="text-xs uppercase text-slate-400">Mission</label><textarea value={metadata.mission} onChange={(e) => setMetadata((prev) => ({ ...prev, mission: e.target.value }))} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-sm" rows={3} /></div>
              <div className="grid gap-3 md:grid-cols-2">
                <div><label className="text-xs uppercase text-slate-400">Primary CTA</label><input value={metadata.ctaPrimary} onChange={(e) => setMetadata((prev) => ({ ...prev, ctaPrimary: e.target.value }))} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-sm" /></div>
                <div><label className="text-xs uppercase text-slate-400">Secondary CTA</label><input value={metadata.ctaSecondary} onChange={(e) => setMetadata((prev) => ({ ...prev, ctaSecondary: e.target.value }))} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-sm" /></div>
              </div>
              <div><label className="text-xs uppercase text-slate-400">Marquee Text</label><input value={metadata.marqueeText} onChange={(e) => setMetadata((prev) => ({ ...prev, marqueeText: e.target.value }))} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-sm" /></div>
              <button onClick={saveMetadata} className="rounded-md bg-[#4fb7b3] px-4 py-2 text-sm font-semibold text-black">Save Site Metadata</button>
            </div>
          )}

          {activeTab === 'sermons' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center"><button onClick={addSermon} className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold">+ Add Sermon</button><button onClick={saveSermons} className="rounded-md bg-[#4fb7b3] px-3 py-2 text-sm font-semibold text-black">Save Sermons</button></div>
              {sermons.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-3 bg-slate-900/60">
                  <div className="flex items-start gap-2 justify-between">
                    <strong className="text-white">{item.title || 'New Sermon'}</strong>
                    <button onClick={() => removeSermon(item.id)} className="text-red-400 text-xs uppercase font-bold">Delete</button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 mt-2">
                    <input value={item.title} onChange={(e) => updateSermon(index, 'title', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Title" />
                    <input value={item.series} onChange={(e) => updateSermon(index, 'series', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Series" />
                    <input value={item.speaker} onChange={(e) => updateSermon(index, 'speaker', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Speaker" />
                    <input value={item.date} onChange={(e) => updateSermon(index, 'date', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Date" />
                    <input value={item.image} onChange={(e) => updateSermon(index, 'image', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" placeholder="Image URL" />
                    <input value={item.videoId} onChange={(e) => updateSermon(index, 'videoId', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" placeholder="YouTube Video ID" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center"><button onClick={addEvent} className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold">+ Add Event</button><button onClick={saveEvents} className="rounded-md bg-[#4fb7b3] px-3 py-2 text-sm font-semibold text-black">Save Events</button></div>
              {events.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-3 bg-slate-900/60">
                  <div className="flex items-start gap-2 justify-between"><strong>{item.title}</strong><button onClick={() => removeEvent(item.id)} className="text-red-400 text-xs uppercase font-bold">Delete</button></div>
                  <div className="grid gap-2 md:grid-cols-2 mt-2">
                    <input value={item.title} onChange={(e) => updateEvent(index, 'title', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <input value={item.date} onChange={(e) => updateEvent(index, 'date', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <input value={item.time} onChange={(e) => updateEvent(index, 'time', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <input value={item.location} onChange={(e) => updateEvent(index, 'location', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <textarea value={item.description} onChange={(e) => updateEvent(index, 'description', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" rows={2} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ministries' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center"><button onClick={addMinistry} className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold">+ Add Ministry</button><button onClick={saveMinistries} className="rounded-md bg-[#4fb7b3] px-3 py-2 text-sm font-semibold text-black">Save Ministries</button></div>
              {ministries.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-3 bg-slate-900/60">
                  <div className="flex items-start gap-2 justify-between"><strong>{item.name}</strong><button onClick={() => removeMinistry(item.id)} className="text-red-400 text-xs uppercase font-bold">Delete</button></div>
                  <div className="grid gap-2 md:grid-cols-2 mt-2">
                    <input value={item.name} onChange={(e) => updateMinistry(index, 'name', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <input value={item.category} onChange={(e) => updateMinistry(index, 'category', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <input value={item.day} onChange={(e) => updateMinistry(index, 'day', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <input value={item.image} onChange={(e) => updateMinistry(index, 'image', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" />
                    <textarea value={item.description} onChange={(e) => updateMinistry(index, 'description', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" rows={2} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
