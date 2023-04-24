import { initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default function Home() {
  const [groups, setGroups] = useState<any>([]);

  async function init() {
    const q = query(collection(db, 'groups'));

    const results = await getDocs(q);
    let groups: any[] = [];
    results.forEach((doc) => {
      groups.push(doc.data());
    });

    setGroups(groups);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {groups.map((group: any, groupIdx: number) => (
        <button><div key={groupIdx}>{group.name}, {group.time}, {group.location}</div> </button>
      ))}
    </div>
  );
}
