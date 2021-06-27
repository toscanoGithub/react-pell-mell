import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBibTuQHpt4Ih_vJPCEYG8ipq72GkLuKnc",
  authDomain: "pell-mell.firebaseapp.com",
  projectId: "pell-mell",
  storageBucket: "pell-mell.appspot.com",
  messagingSenderId: "927887726538",
  appId: "1:927887726538:web:06a0b31df34b0f930ba133",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
