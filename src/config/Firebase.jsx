import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD5SZTVoRPJVuaDS6YkJDyH-Sz-avrF_30",
  authDomain: "aplikasi-penjualan-bisareact.firebaseapp.com",
  projectId: "aplikasi-penjualan-bisareact",
  storageBucket: "aplikasi-penjualan-bisareact.appspot.com",
  messagingSenderId: "810063292036",
  appId: "1:810063292036:web:7152b2617bc31ba263c4d1",
  measurementId: "G-Y3F146ER46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
