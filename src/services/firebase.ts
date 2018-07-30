import * as Firebase from 'firebase';
import '@firebase/firestore';
import firebaseConfig from '@/config';

export const firebase = Firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
