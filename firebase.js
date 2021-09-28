import firebase from 'firebase';
import "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyCsD2RHT8hhMwu10ZD_9iv4n1Tgu0j2bIw",
    authDomain: "chess-app-ae7cb.firebaseapp.com",
    projectId: "chess-app-ae7cb",
    storageBucket: "chess-app-ae7cb.appspot.com",
    messagingSenderId: "1034709476825",
    appId: "1:1034709476825:web:44290a744192163d1065c8"
};

const app = !firebase.apps.length 
? firebase.initializeApp(firebaseConfig) 
: firebase.app();

const db = app.firestore();

export { db };