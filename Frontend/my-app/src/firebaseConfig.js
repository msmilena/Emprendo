// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7jjO80akH7IScdSg_DECHb4opRQSbHog",
  authDomain: "emprendo-1c101.firebaseapp.com",
  databaseURL: "https://emprendo-1c101-default-rtdb.firebaseio.com",
  projectId: "emprendo-1c101",
  storageBucket: "emprendo-1c101.firebasestorage.app",
  messagingSenderId: "26932749356",
  appId: "1:26932749356:web:58e5e1b09028c1d19add89",
  measurementId: "G-8MC9EXCC1E",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };