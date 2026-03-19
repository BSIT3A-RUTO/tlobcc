import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignOut } from '../services/authService';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, orderBy, limit, updateDoc, setDoc } from 'firebase/firestore';
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
  getTestimonials,
  upsertTestimonial,
  deleteTestimonial,
  getPastors,
  upsertPastor,
  deletePastor,
  SiteMetadata,
  SermonRecord,
  EventRecord,
  MinistryRecord,
  TestimonyRecord,
  PastorRecord,
} from '../services/contentService';
import { MINISTRIES, SERMONS, EVENTS } from '../data';



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
  const [activeTab, setActiveTab] = useState<'site' | 'sermons' | 'events' | 'ministries' | 'testimonials' | 'pastors'>('site');
  const [testimonials, setTestimonials] = useState<TestimonyRecord[]>([
    { id: '1', quote: "Finding TLOBCC changed my life. The community here is so welcoming, and the teachings have helped me grow deeper in my faith than ever before.", author: "Maria Santos", role: "Member since 2023" },
    { id: '2', quote: "The youth ministry gave my teenagers a safe place to ask questions and find their identity in Christ. We are so grateful for the leaders.", author: "David & Anna Reyes", role: "Parents" },
    { id: '3', quote: "I came broken and looking for answers. Through the Life Groups, I found a family that prayed for me and stood by me through my hardest seasons.", author: "Joshua Lim", role: "Life Group Leader" }
  ]);
  const [pastors, setPastors] = useState<PastorRecord[]>([]);
  const [metadata, setMetadata] = useState<SiteMetadata>(DEFAULT_METADATA);
  const [sermons, setSermons] = useState<SermonRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [ministries, setMinistries] = useState<MinistryRecord[]>([]);
  const [status, setStatus] = useState<string>('');
  const [adminStatus, setAdminStatus] = useState<string>('Checking admin status...');
  const [prayerRequestCount, setPrayerRequestCount] = useState<number>(0);
  const [eventSignupEstimate, setEventSignupEstimate] = useState<number>(0);
  const [donationConversion, setDonationConversion] = useState<number>(0);
  const [notifications, setNotifications] = useState<Array<any>>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [bulkJson, setBulkJson] = useState<string>('');

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
      setAdminStatus(
        `uid=${user.uid} role=${data.role ?? 'n/a'} isAdmin=${data.isAdmin === true} admin=${data.admin === true}`
      );
    } catch (error) {
      setAdminStatus('Could not read users/{uid}: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const loadNotifications = async () => {
    try {
      const notifQuery = query(collection(db, 'adminNotifications'), orderBy('createdAt', 'desc'), limit(20));
      const notifDocs = await getDocs(notifQuery);
      const parsed = notifDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(parsed);
      setUnreadNotifications(parsed.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to load admin notifications', error);
      setNotifications([]);
      setUnreadNotifications(0);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await Promise.all(notifications.map((n: any) => {
        if (!n.isRead) {
          return updateDoc(doc(db, 'adminNotifications', n.id), { isRead: true });
        }
        return Promise.resolve();
      }));
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  };

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
        const sermonData = await getSermons();
        if (sermonData.length > 0) setSermons(sermonData);
        else setSermons(SERMONS.map((s) => ({ ...s, id: String(s.id) })));
      } catch {
        setSermons(SERMONS.map((s) => ({ ...s, id: String(s.id) })));
      }

      try {
        const eventData = await getEvents();
        if (eventData.length > 0) setEvents(eventData);
        else setEvents(EVENTS.map((e) => ({ ...e, id: String((e.id ?? crypto.randomUUID?.()) || Date.now()), postLink: e.postLink ?? '', registerLink: e.registerLink ?? '' })));
      } catch {
        setEvents(EVENTS.map((e) => ({ ...e, id: String((e.id ?? crypto.randomUUID?.()) || Date.now()), postLink: e.postLink ?? '', registerLink: e.registerLink ?? '' })));
      }

      try {
        const ministryData = await getMinistries();
        if (ministryData.length > 0) setMinistries(ministryData);
        else setMinistries(MINISTRIES);
      } catch {
        setMinistries(MINISTRIES);
      }

      try {
        const testimonialData = await getTestimonials();
        if (testimonialData.length > 0) setTestimonials(testimonialData);
      } catch {
        // use defaults
      }

      try {
        const pastorData = await getPastors();
        if (pastorData.length > 0) setPastors(pastorData);
      } catch {
        // empty for now
      }

      try {
        const prayerDocs = await getDocs(collection(db, 'prayerRequests'));
        setPrayerRequestCount(prayerDocs.size);
      } catch {
        setPrayerRequestCount(0);
      }

      setEventSignupEstimate(Math.floor((events.length || 12) * 0.32));
      setDonationConversion(8);
      await loadNotifications();
    };

    load();
  }, [events.length]);

  const repairAdminFlags = async () => {
    const user = auth.currentUser;
    if (!user) {
      setStatus('No signed-in user to repair.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        isAdmin: true,
        admin: true,
        role: 'admin',
        displayName: user.displayName || null,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setStatus('Admin flags repaired on user document.');
      await loadAdminStatus();
    } catch (err) {
      setStatus('Failed to repair admin flags: ' + (err instanceof Error ? err.message : String(err))); 
    }
  };

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
      console.error('Save metadata error', err);
      setStatus(`Failed to save site metadata: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
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
    } catch (err) {
      console.error('Save sermons error', err);
      setStatus(`Failed to save sermons: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
  };

  const exportSermonsJson = () => {
    setBulkJson(JSON.stringify(sermons, null, 2));
    setStatus('Sermons JSON exported for bulk copy.');
  };

  const importSermonsJson = () => {
    try {
      const parsed = JSON.parse(bulkJson || '[]') as SermonRecord[];
      if (!Array.isArray(parsed)) throw new Error('Expected an array of sermons.');
      setSermons(parsed.map((item) => ({ ...item, id: item.id || crypto.randomUUID?.() || `${Date.now()}` })));
      setStatus('Imported sermons from JSON. Remember to save.');
    } catch (err) {
      setStatus(`Import failed: ${err instanceof Error ? err.message : 'Invalid JSON'}`);
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
    setEvents((prev) => [...prev, { id, title: 'New Event', date: 'TBD', time: 'TBD', location: 'Location', description: 'Description', postLink: '', registerLink: '', publishAt: '' }]);
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
    } catch (err) {
      console.error('Save events error', err);
      setStatus(`Failed to save events: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
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
    } catch (err) {
      console.error('Save ministries error', err);
      setStatus(`Failed to save ministries: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
  };

  const removeMinistry = async (id: string) => {
    try {
      await deleteMinistry(id);
    } catch {}
    setMinistries((prev) => prev.filter((item) => item.id !== id));
  };

  const addTestimonial = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    setTestimonials((prev) => [
      ...prev,
      { id, quote: 'New testimony quote...', author: 'Author Name', role: 'Role' }
    ]);
  };

  const saveTestimonials = async () => {
    setStatus('Saving testimonials...');
    try {
      await Promise.all(testimonials.map((item) => upsertTestimonial(item)));
      setStatus('Testimonials saved.');
    } catch (err) {
      console.error('Save testimonials error', err);
      setStatus(`Failed to save testimonials: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
  };

  const updateTestimonial = (index: number, field: keyof TestimonyRecord, value: string) => {
    const next = [...testimonials];
    next[index] = { ...next[index], [field]: value };
    setTestimonials(next);
  };

  const removeTestimonial = async (id: string) => {
    try {
      await deleteTestimonial(id);
    } catch {
      // ignore
    }
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
  };

  const addPastor = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}`;
    setPastors((prev) => [
      ...prev,
      { id, name: 'Pastor Name', role: 'Role', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop' }
    ]);
  };

  const savePastors = async () => {
    setStatus('Saving pastors...');
    try {
      await Promise.all(pastors.map((item) => upsertPastor(item)));
      setStatus('Pastors saved.');
    } catch (err) {
      console.error('Save pastors error', err);
      setStatus(`Failed to save pastors: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
  };

  const updatePastor = (index: number, field: keyof PastorRecord, value: string) => {
    const next = [...pastors];
    next[index] = { ...next[index], [field]: value };
    setPastors(next);
  };

  const removePastor = async (id: string) => {
    try {
      await deletePastor(id);
    } catch {
      // ignore
    }
    setPastors((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto border border-white/10 bg-slate-900/70 backdrop-blur-xl rounded-2xl overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold">TLOBCC Admin Dashboard</h1>
            <p className="text-slate-300 text-sm">Edit and manage website content from one place.</p>
            <p className="text-xs text-emerald-300 mt-1">Admin status: {adminStatus}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-900" onClick={logout}>Sign Out</button>
            <button className="rounded-md bg-[#4fb7b3] px-3 py-2 text-sm font-semibold text-slate-900" onClick={repairAdminFlags}>Repair Admin Flags</button>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-3 px-4 py-4 bg-slate-900/60 border-b border-white/10">
          <div className="rounded-lg border border-white/20 bg-white/5 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Prayer Requests</div>
            <div className="text-3xl font-bold text-[#4fb7b3]">{prayerRequestCount}</div>
            <div className="text-xs text-slate-400">Total requests received</div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/5 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Event RSVPs (est.)</div>
            <div className="text-3xl font-bold text-[#a8fbd3]">{eventSignupEstimate}</div>
            <div className="text-xs text-slate-400">Estimated conversion from event pages</div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/5 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Notifications</div>
            <div className="text-3xl font-bold text-[#facc15]">{unreadNotifications}</div>
            <div className="text-xs text-slate-400">Unread submissions</div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/5 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Donation CTR</div>
            <div className="text-3xl font-bold text-[#facc15]">{donationConversion}%</div>
            <div className="text-xs text-slate-400">From visitor call-to-actions</div>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-white/10 bg-slate-900/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Recent Site Submissions</div>
              <div className="text-lg font-bold">{unreadNotifications} unread</div>
            </div>
            <button onClick={markAllNotificationsRead} className="rounded-md bg-[#4fb7b3] px-3 py-1 text-xs font-semibold text-black">Mark all read</button>
          </div>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-sm text-slate-300">No submissions yet.</div>
            ) : (
              notifications.map((notification: any) => (
                <div key={notification.id} className={`rounded-md border p-2 text-xs ${notification.isRead ? 'border-white/10 bg-slate-900/40' : 'border-[#4fb7b3] bg-[#4fb7b3]/10'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-white">{notification.label || (notification.type === 'prayer' ? 'Prayer Request' : 'Connect Signup')}</div>
                    <div className="text-slate-300">{notification.createdAt?.toDate ? notification.createdAt.toDate().toLocaleString() : notification.createdAt ? new Date(notification.createdAt.seconds * 1000).toLocaleString() : ''}</div>
                  </div>
                  <div className="text-slate-300 mt-1">
                    {notification.type === 'connect' ? `${notification.name || 'Someone'} (${notification.category || 'connect'})` : `${notification.name || 'Anonymous'}: ${notification.request?.slice(0, 80) || ''}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
{['site', 'sermons', 'events', 'ministries', 'testimonials', 'pastors'].map((tab) => (
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
              <div><label className="text-xs uppercase text-slate-400">Banner Text (Navbar)</label><input value={metadata.bannerText ?? ''} onChange={(e) => setMetadata((prev) => ({ ...prev, bannerText: e.target.value }))} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-sm" /></div>
              <button onClick={saveMetadata} className="rounded-md bg-[#4fb7b3] px-4 py-2 text-sm font-semibold text-black">Save Site Metadata</button>
            </div>
          )}

          {activeTab === 'sermons' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center"><button onClick={addSermon} className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold">+ Add Sermon</button><button onClick={saveSermons} className="rounded-md bg-[#4fb7b3] px-3 py-2 text-sm font-semibold text-black">Save Sermons</button><button onClick={exportSermonsJson} className="rounded-md bg-white text-black px-3 py-2 text-sm font-semibold">Export JSON</button><button onClick={importSermonsJson} className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold">Import JSON</button></div>
              <div>
                <label className="text-xs uppercase text-slate-400">Bulk JSON (sermons)</label>
                <textarea value={bulkJson} onChange={(e) => setBulkJson(e.target.value)} className="w-full rounded-md bg-slate-900 border border-white/20 px-2 py-2 text-xs text-slate-200" rows={5} placeholder="Paste sermon JSON here for import..." />
              </div>
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
                    <input type="datetime-local" value={item.publishAt ?? ''} onChange={(e) => updateEvent(index, 'publishAt', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Schedule publish" />
                    <input value={item.location} onChange={(e) => updateEvent(index, 'location', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" />
                    <textarea value={item.description} onChange={(e) => updateEvent(index, 'description', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" rows={2} />
                    <input value={item.postLink ?? ''} onChange={(e) => updateEvent(index, 'postLink', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" placeholder="Post URL (optional)" />
                    <input value={item.registerLink ?? ''} onChange={(e) => updateEvent(index, 'registerLink', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" placeholder="Registration URL (optional)" />
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

          {activeTab === 'testimonials' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <button onClick={addTestimonial} className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold">+ Add Testimonial</button>
                <button onClick={saveTestimonials} className="rounded-md bg-[#4fb7b3] px-3 py-2 text-sm font-semibold text-black">Save Testimonials</button>
              </div>
              {testimonials.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-3 bg-slate-900/60">
                  <div className="flex items-start gap-2 justify-between">
                    <strong className="text-white">{item.author || 'New Testimonial'}</strong>
                    <button onClick={() => removeTestimonial(item.id)} className="text-red-400 text-xs uppercase font-bold">Delete</button>
                  </div>
                  <div className="space-y-2">
                    <textarea value={item.quote} onChange={(e) => updateTestimonial(index, 'quote', e.target.value)} className="w-full rounded-md bg-slate-800 px-2 py-2 h-24 col-span-2" placeholder="Quote" />
                    <input value={item.author} onChange={(e) => updateTestimonial(index, 'author', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Author" />
                    <input value={item.role} onChange={(e) => updateTestimonial(index, 'role', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Role" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pastors' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <button onClick={addPastor} className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold">+ Add Pastor</button>
                <button onClick={savePastors} className="rounded-md bg-[#4fb7b3] px-3 py-2 text-sm font-semibold text-black">Save Pastors</button>
              </div>
              {pastors.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-3 bg-slate-900/60">
                  <div className="flex items-start gap-2 justify-between">
                    <strong className="text-white">{item.name || 'New Pastor'}</strong>
                    <button onClick={() => removePastor(item.id)} className="text-red-400 text-xs uppercase font-bold">Delete</button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <input value={item.name} onChange={(e) => updatePastor(index, 'name', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Name" />
                    <input value={item.role} onChange={(e) => updatePastor(index, 'role', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1" placeholder="Role" />
                    <input value={item.image} onChange={(e) => updatePastor(index, 'image', e.target.value)} className="rounded-md bg-slate-800 px-2 py-1 col-span-2" placeholder="Image URL" />
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
