import { Button } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { MouseEvent, useState } from 'react';

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

export default function Create() {
  const { user } = useAuth();
  const [name, setName] = useState<string>('');
  const [time, setTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<string>('');

  async function handleCreate(e: MouseEvent) {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        name: name,
        time: time?.toISOString(),
        location: location,
        users: [],
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  return (
    <div>
      <form>
        <Button type='submit' onClick={handleCreate}>
          Create Group
        </Button>
      </form>
    </div>
  );
}
