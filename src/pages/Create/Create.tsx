import { Button } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { MouseEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate() as (path: string) => void;
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

  function handleHome() {
    navigate(`/`);
  }

  

  return (
    <div style={{color: '#003262', marginTop: '100px', fontSize: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <text style = {{fontSize: '50px'}}>Create a group!</text>
      <form>
        <label style={{ fontSize: '40px' }}>
          Group Name:         
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}  style={{ fontSize: '40px'}}/>
        </label>
        <br />
        <label style={{ fontSize: '40px' }}>
          Time of flight:
          <input type="datetime-local" value={time?.toISOString()} onChange={(e) => setTime(new Date(e.target.value))} style={{ fontSize: '40px' }} />
        </label>
        <br />
        <label style={{ fontSize: '40px' }}>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ fontSize: '40px'}}/>
        </label>
        <br />
        <br />
        <br />

      
        <Button type='submit' onClick={handleCreate} style={{ fontSize: '40px' }}>
          Create Group
        </Button>

        <Button type='submit' onClick={handleHome} style={{ fontSize: '40px' }}>
          Return Home
        </Button>
      </form>
      {time && (
      <p style={{ fontSize: '20px' }}>
        
        Selected date: {time.toLocaleDateString()} {time.toLocaleTimeString()}
        <br />
        Default: Current Date and Time. Please change the date above to a future date!
        <br />
      </p>
    )}
    </div>
  );
}
