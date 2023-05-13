import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { app } from './firebase';

export const FirebaseAuth = getAuth(app);

export const Authentication = () => {
  return FirebaseAuth;
};

export const SignIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(FirebaseAuth, email, password)
};

export const SignOut = async () => {
  await signOut(FirebaseAuth);
};
