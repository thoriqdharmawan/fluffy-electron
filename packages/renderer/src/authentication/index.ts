import {
  getAuth,
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  // UserCredential,
} from 'firebase/auth';

import { app } from './firebase';
// import { ADD_USERS } from './users.mutation';

// import client from '/@/apollo-client';

export const FirebaseAuth = getAuth(app);

export const Authentication = () => {
  return FirebaseAuth;
};

// export const SignUp = async (email: string, password: string) => {
//   await createUserWithEmailAndPassword(FirebaseAuth, email, password).then(
//     async (credentials: UserCredential) => {
//       await client.mutate({
//         mutation: ADD_USERS,
//         variables: {
//           userId: credentials.user.uid,
//           userEmail: credentials.user.email,
//         },
//       });
//     }
//   );
// };

export const SignIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(FirebaseAuth, email, password)
};

export const SignOut = async () => {
  await signOut(FirebaseAuth);
};
