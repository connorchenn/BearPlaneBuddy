import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  getAuth,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAp1ZJXQmr1RQnEE-aJisME3CsiffyaZX0',
  authDomain: 'bearplanebuddy.firebaseapp.com',
  projectId: 'bearplanebuddy',
  storageBucket: 'bearplanebuddy.appspot.com',
  messagingSenderId: '1095288640396',
  appId: '1:1095288640396:web:46fb14569653264d4a7ca9',
  measurementId: 'G-T0DVLEC2P3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

interface ThemeContext_Props {
  user: User | undefined;
  logout: () => void;
  loginWithGoogle: () => void;
}

interface ThemeProvider_Props {
  children: ReactNode;
}

export const AuthContext = createContext<ThemeContext_Props | null>(null);

export default function AuthProvider({ children }: ThemeProvider_Props) {
  const [user, setUser] = useState<ThemeContext_Props['user'] | undefined>();

  async function loginWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) throw new Error(`No auth credential`);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  function logout() {
    signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
