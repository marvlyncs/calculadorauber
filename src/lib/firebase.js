// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtpw2T8-Jdg3YrRSmsmIl7jXlbWT9b11g",
  authDomain: "calculadora-uber-1.firebaseapp.com",
  databaseURL: "https://calculadora-uber-1-default-rtdb.firebaseio.com",
  projectId: "calculadora-uber-1",
  storageBucket: "calculadora-uber-1.firebasestorage.app",
  messagingSenderId: "1023524256161",
  appId: "1:1023524256161:web:360a5ecc7ed1d865aef3e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;

