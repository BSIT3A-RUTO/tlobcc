import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  FirestoreDataConverter,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

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
  const snapshot = await getDocs(query(sermonsCollection));
  return snapshot.docs.map((docSnap) => mapDoc<SermonRecord>(docSnap));
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
  const snapshot = await getDocs(query(eventsCollection));
  return snapshot.docs.map((docSnap) => mapDoc<EventRecord>(docSnap));
}

export async function upsertEvent(item: EventRecord): Promise<void> {
  await setDoc(doc(eventsCollection, item.id), { ...item, updatedAt: serverTimestamp() });
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(eventsCollection, id));
}

export async function getMinistries(): Promise<MinistryRecord[]> {
  const snapshot = await getDocs(query(ministriesCollection));
  return snapshot.docs.map((docSnap) => mapDoc<MinistryRecord>(docSnap));
}

export async function upsertMinistry(item: MinistryRecord): Promise<void> {
  await setDoc(doc(ministriesCollection, item.id), { ...item, updatedAt: serverTimestamp() });
}

export async function deleteMinistry(id: string): Promise<void> {
  await deleteDoc(doc(ministriesCollection, id));
}
