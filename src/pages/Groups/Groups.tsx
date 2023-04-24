import { Box, Button, Grid, Text, VStack } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';
import { initializeApp } from 'firebase/app';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    collection,
    getDoc,
    getFirestore,
    query,
    where,
  } from 'firebase/firestore';

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



export default function Groups() {
    const app = initializeApp(firebaseConfig);

    const db = getFirestore(app);

    const [users, setUsers] = useState([]);
    async function init() {
      const groupDocRef = doc(db, 'groups', 'MLTBZUDGdew7PAj6PfYN');
      const groupDoc = await getDoc(groupDocRef);
      const groupData = groupDoc.data();
      if (!groupData) {
        return [];
      }
      const users: { name: string, email: string }[] = groupData?.users || [];
      return users;
    }

    //how do i get the groupid, filter to that group, and then display all the users in that group
    //how do i switch pages
    
    /*
    const people = await init();
    people.forEach(user => {
        console.log(user.name);
    });
    */




      return (
        <div> hey</div>
      );  
}

    //displays all members of a certain group