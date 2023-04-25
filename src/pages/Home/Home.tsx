//import { Button } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';
import { initializeApp } from 'firebase/app';
import Button from './Content/Button';
import './Home.css';
import RoomList from './Content/RoomList';
import Room from './Content/Room';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { MouseEvent, useEffect, useState } from 'react';
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

export default function Home() {
  const [groups, setGroups] = useState<any>([]);
  const { user, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate() as (path: string) => void;

  async function init() {
    const q = query(collection(db, 'groups'));

    const results = await getDocs(q);
    let groups: any[] = [];
    results.forEach((doc) => {
      groups.push({ ...doc.data(), id: doc.id });
    });

    setGroups(groups);
  }

  //i dont think this part works, getting index of issue
  async function addUserToGroup(groupID: string) {
    if (!user) throw new Error(`No user`);
    const docRef = doc(db, 'groups', groupID);
    await updateDoc(docRef, {
      users: arrayUnion(
        JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        })
      ),
    });
    navigate(`/groups/${groupID}`);
  }

  function handleJoin(e: MouseEvent, groupId: string) {
    console.log({groupId});
    addUserToGroup(groupId);
  }

  function handleLogout() {
    navigate(`/login`);
  }

  function handleCreateGroup() {
    navigate(`/create`);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
    <div id="top">
        <input id="searchBox" type="text" placeholder="Search flight # | time | group number"></input>
        <Button handle={handleCreateGroup} text="Add"/>
        <Button handle={handleLogout} text="Logout"/>
    </div>
    <div id="bottom">
        <div id="board">
            <div id="description" className="room">
                <div className="airport" >
                    Airport
                </div>
            <div className="time" >
                Time
            </div>
            <div className="name" >
                Group Name
            </div>
            <div className="joined" >
                Joined
            </div>
            </div>
            <RoomList handle={handleJoin} rooms={groups}/>
        </div>
    </div>
    </>
);
}
