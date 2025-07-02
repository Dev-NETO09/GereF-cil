import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvRIceWKESCgsK2BQmrM8xp9qt1B1w5Oo",
  authDomain: "despesas-b6930.firebaseapp.com",
  projectId: "despesas-b6930",
  storageBucket: "despesas-b6930.firebasestorage.app",
  messagingSenderId: "1095613281785",
  appId: "1:1095613281785:web:5edf48aeed3fdde55fb928",
  measurementId: "G-S7NDWX6CXJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
