import { initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
  const { user, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  async function init() {
    const q = query(collection(db, 'groups'));

    const results = await getDocs(q);
    let groups: any[] = [];
    results.forEach((doc) => {
      groups.push(doc.data());
    });

    setGroups(groups);
  }

  function addUserToGroup(groupID: string, user: any) {
    const docRef = doc(db, 'groups', groupID);
    updateDoc(docRef, {
      users: arrayUnion(user),
    });
    //switch windows
  }

  useEffect(() => {
    init();
  }, []);

  return ( 
  <div>
    {groups.map((group: any, groupIdx: number) => (
    <div key={groupIdx} style={{ display: "block" }}>
      <div>{group.name}, {group.time}, {group.location} 
      <form>
        <Button type='submit' onClick={() => addUserToGroup(group.id, { name: user?.displayName})}>
          Join {group.name}
        </Button>
      </form>
      </div>
    </div>
  ))}
</div>
  );
}
