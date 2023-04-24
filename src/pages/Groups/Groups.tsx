import { Box, Button, Grid, Text, VStack } from '@chakra-ui/react';
import useAuth from 'contexts/Auth/useAuth';
import { initializeApp } from 'firebase/app';

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

export default function Groups() {
    //displays all members of a certain group
    return (
        <div>hey</div>
    )
}