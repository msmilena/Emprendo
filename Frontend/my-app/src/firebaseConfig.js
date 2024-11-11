// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig.json"; // Importa el archivo JSON

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };