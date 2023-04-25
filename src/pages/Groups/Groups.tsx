import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams , Link, useNavigate} from 'react-router-dom';
import './Groups.css';
import Button from './Content/Button';
import User from './Content/User';
import UserList from './Content/UserList';


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
const db = getFirestore(app);

export default function Groups() {
  const { id } = useParams();
  const [group, setGroup] = useState<any>();
  const navigate = useNavigate() as (path: string) => void;

  useEffect(() => {
    async function init() {
      if (!id) return;
      const groupRef = doc(db, 'groups', id);
      const groupDoc = await getDoc(groupRef);
      const data = groupDoc.data();
      if (!data) throw new Error(`No data returned`);
      data.id = groupDoc.id;
      data.users = data.users.map((userStr: string) => JSON.parse(userStr));
      console.log(data);
      setGroup(data);
    }
    init();
  }, [id]);

  if (!group) return <div>Loading...</div>;

  function handleLogout() {
    navigate(`/login`);
  }

  function handleBack() {
    navigate(`/`);
  }

  console.log(group);
  return (
    <>
    <div id="top">
        <Button handle={handleBack} text="Back"/>
        <Button handle={handleLogout} text="Logout"/>
    </div>
    <div id="bottom">
        <div id="board">
            <div id="description" className="room">
                <div className="airport" >
                    {group.location}
                </div>
            <div className="time" >
                {group.time}
            </div>
            <div className="name" >
                {group.name}
            </div>
            <div className="joined" >
                {group.users.length}/4
            </div>
            </div>
            <UserList users={group.users}/>
        </div>
    </div>
    </>
);
}

//displays all members of a certain group
