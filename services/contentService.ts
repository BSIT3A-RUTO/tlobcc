import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  FirestoreDataConverter,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  PrayerRequestRecord,
  ConnectRequestRecord,
  PastoralCareRequestRecord,
  LivestreamConfig,
  SermonRecord as SermonRecordType,
  EventRecord as EventRecordType,
  MinistryRecord as MinistryRecordType,
  PastorRecord as PastorRecordType,
  TestimonyRecord as TestimonyRecordType,
} from '../types';


export interface SiteMetadata {
  heroTitle: string;
  heroSubtitle: string;
  mission: string;
  ctaPrimary: string;
  ctaSecondary: string;
  marqueeText: string;
  bannerText?: string;
}

// Re-export types for convenience
export type SermonRecord = SermonRecordType;
export type EventRecord = EventRecordType;
export type MinistryRecord = MinistryRecordType;
export type PastorRecord = PastorRecordType;
export type TestimonyRecord = TestimonyRecordType;

const siteMetadataRef = doc(db, 'siteMetadata', 'main');

export async function getSiteMetadata(): Promise<SiteMetadata | null> {
  const metadataDoc = await getDoc(siteMetadataRef);
  if (!metadataDoc.exists()) return null;
  return metadataDoc.data() as SiteMetadata;
}

export async function setSiteMetadata(data: SiteMetadata): Promise<void> {
  await setDoc(siteMetadataRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

const sermonsCollection = collection(db, 'sermons');
const eventsCollection = collection(db, 'events');
const ministriesCollection = collection(db, 'ministries');

function mapDoc<T>(docSnap: any): T {
  return { id: docSnap.id, ...docSnap.data() } as T;
}

export async function getSermons(): Promise<SermonRecord[]> {
  const snapshot = await getDocs(sermonsCollection);
  return snapshot.docs
    .map((docSnap) => mapDoc<SermonRecord>(docSnap))
    .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
}

export async function upsertSermon(item: SermonRecord): Promise<void> {
  const ref = doc(sermonsCollection, item.id);
  await setDoc(ref, { ...item, updatedAt: serverTimestamp() });
}

export async function addSermon(item: Omit<SermonRecord, 'id'>): Promise<string> {
  const docRef = await addDoc(sermonsCollection, { ...item, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function deleteSermon(id: string): Promise<void> {
  await deleteDoc(doc(sermonsCollection, id));
}

export async function getEvents(): Promise<EventRecord[]> {
  const snapshot = await getDocs(eventsCollection);
  return snapshot.docs
    .map((docSnap) => mapDoc<EventRecord>(docSnap))
    .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
}

export async function upsertEvent(item: EventRecord): Promise<void> {
  await setDoc(doc(eventsCollection, item.id), { ...item, updatedAt: serverTimestamp() });
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(eventsCollection, id));
}

export async function getMinistries(): Promise<MinistryRecord[]> {
  const snapshot = await getDocs(ministriesCollection);
  return snapshot.docs
    .map((docSnap) => mapDoc<MinistryRecord>(docSnap))
    .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
}

export async function upsertMinistry(item: MinistryRecord): Promise<void> {
  await setDoc(doc(ministriesCollection, item.id), { ...item, updatedAt: serverTimestamp() });
}

export async function deleteMinistry(id: string): Promise<void> {
  await deleteDoc(doc(ministriesCollection, id));
}

const testimonialsCollection = collection(db, 'testimonials');
const pastorsCollection = collection(db, 'pastors');

export async function getTestimonials(): Promise<TestimonyRecord[]> {
  const snapshot = await getDocs(testimonialsCollection);
  return snapshot.docs
    .map((docSnap) => mapDoc<TestimonyRecord>(docSnap))
    .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
}

export async function upsertTestimonial(item: TestimonyRecord): Promise<void> {
  const ref = doc(testimonialsCollection, item.id);
  await setDoc(ref, { ...item, updatedAt: serverTimestamp() });
}

export async function addTestimonial(item: Omit<TestimonyRecord, 'id'>): Promise<string> {
  const docRef = await addDoc(testimonialsCollection, { ...item, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(testimonialsCollection, id));
}

export async function getPastors(): Promise<PastorRecord[]> {
  const snapshot = await getDocs(pastorsCollection);
  return snapshot.docs
    .map((docSnap) => mapDoc<PastorRecord>(docSnap))
    .sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
}

export async function upsertPastor(item: PastorRecord): Promise<void> {
  const ref = doc(pastorsCollection, item.id);
  await setDoc(ref, { ...item, updatedAt: serverTimestamp() });
}

export async function addPastor(item: Omit<PastorRecord, 'id'>): Promise<string> {
  const docRef = await addDoc(pastorsCollection, { ...item, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function deletePastor(id: string): Promise<void> {
  await deleteDoc(doc(pastorsCollection, id));
}

const prayerRequestsCollection = collection(db, 'prayerRequests');
const connectRequestsCollection = collection(db, 'connectRequests');
const pastoralRequestsCollection = collection(db, 'pastoralRequests');

export async function getPastoralRequests(): Promise<PastoralCareRequestRecord[]> {
  const snapshot = await getDocs(query(pastoralRequestsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((docSnap) => mapDoc<PastoralCareRequestRecord>(docSnap));
}

export async function deletePastoralRequest(id: string): Promise<void> {
  await deleteDoc(doc(pastoralRequestsCollection, id));
}

const livestreamRef = doc(db, 'config', 'livestream');

export async function getPrayers(): Promise<PrayerRequestRecord[]> {
  const snapshot = await getDocs(query(prayerRequestsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((docSnap) => mapDoc<PrayerRequestRecord>(docSnap));
}

export async function getConnects(): Promise<ConnectRequestRecord[]> {
  const snapshot = await getDocs(query(connectRequestsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((docSnap) => mapDoc<ConnectRequestRecord>(docSnap));
}

export async function deletePrayer(id: string): Promise<void> {
  await deleteDoc(doc(prayerRequestsCollection, id));
}

export async function deleteConnect(id: string): Promise<void> {
  await deleteDoc(doc(connectRequestsCollection, id));
}

export async function getLivestream(): Promise<LivestreamConfig | null> {
  const docSnap = await getDoc(livestreamRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as LivestreamConfig;
}

export async function setLivestream(data: LivestreamConfig): Promise<void> {
  await setDoc(livestreamRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Publishing & Draft Functionality

type ContentType = 'sermon' | 'event' | 'ministry' | 'pastor' | 'testimonial';

function getCollectionForType(type: ContentType) {
  const collections: Record<ContentType, any> = {
    sermon: collection(db, 'sermons'),
    event: collection(db, 'events'),
    ministry: collection(db, 'ministries'),
    pastor: collection(db, 'pastors'),
    testimonial: collection(db, 'testimonials'),
  };
  return collections[type];
}

export async function getPublishedContent<T>(type: ContentType): Promise<T[]> {
  const col = getCollectionForType(type);
  const snapshot = await getDocs(col);
  return snapshot.docs
    .map((docSnap) => mapDoc<T>(docSnap))
    .filter((item: any) => {
      const published = item.published !== false;
      const publishedAt = item.publishedAt ? new Date(item.publishedAt) <= new Date() : true;
      return published && publishedAt;
    })
    .sort((a: any, b: any) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
}

export async function publishNow(type: ContentType, itemId: string): Promise<void> {
  const col = getCollectionForType(type);
  const ref = doc(col, itemId);
  await setDoc(ref, {
    published: true,
    publishedAt: serverTimestamp(),
    scheduledPublishAt: null,
  }, { merge: true });
}

export async function saveDraft(type: ContentType, itemId: string): Promise<void> {
  const col = getCollectionForType(type);
  const ref = doc(col, itemId);
  await setDoc(ref, {
    published: false,
  }, { merge: true });
}

export async function schedulePublish(type: ContentType, itemId: string, publishAt: string): Promise<void> {
  const col = getCollectionForType(type);
  const ref = doc(col, itemId);
  await setDoc(ref, {
    published: false,
    scheduledPublishAt: publishAt,
  }, { merge: true });
}
