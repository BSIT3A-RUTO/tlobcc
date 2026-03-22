import { auth, db } from '../firebase';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AdminUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

export async function createAdminUser(email: string, password: string, displayName?: string): Promise<AdminUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    isAdmin: true,
    role: 'admin',
    admin: true,
    displayName: user.displayName || null,
    createdAt: new Date().toISOString(),
  });

  return {
    uid: user.uid,
    email: user.email,
    isAdmin: true,
  };
}

export async function signInAdmin(email: string, password: string): Promise<AdminUser> {
  if (!email || !password) {
    throw new Error('Please enter both email and password.');
  }

  let credential;
  try {
    credential = await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/user-not-found') {
        throw new Error('No account found for this email. Please check your email.');
      }
      if (err.code === 'auth/wrong-password') {
        throw new Error('Wrong password. Please try again.');
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error('Please use a valid email address.');
      }
      if (err.code === 'auth/invalid-credential') {
        throw new Error('Invalid authentication credentials. Confirm your Firebase API key and user login details.');
      }
    }
    throw err;
  }

  const user = credential.user;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.exists() ? userDoc.data() : null;
  const isAdmin = Boolean(userData?.isAdmin === true || userData?.role === 'admin' || userData?.admin === true);

  if (!isAdmin) {
    await signOut(auth);
    throw new Error('Unauthorized: admin access required. Please set users/{uid}.isAdmin=true or role="admin" in Firestore.');
  }

  return {
    uid: user.uid,
    email: user.email,
    isAdmin: true,
  };
}

export async function adminSignOut() {
  await signOut(auth);
}

export function onAdminAuthStateChanged(callback: (user: AdminUser | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists() && userDoc.data()?.isAdmin) {
      callback({
        uid: user.uid,
        email: user.email,
        isAdmin: true,
      });
    } else {
      callback(null);
    }
  });
}

export async function ensureCurrentUserIsAdmin(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  return userDoc.exists() && Boolean(userDoc.data()?.isAdmin);
}
