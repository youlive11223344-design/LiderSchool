import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhl2MnIWKq5FUgvEiMg05fcW3RSVUMvRY",
  authDomain: "liderschool-d9dde.firebaseapp.com",
  projectId: "liderschool-d9dde",
  storageBucket: "liderschool-d9dde.firebasestorage.app",
  messagingSenderId: "154597151661",
  appId: "1:154597151661:web:cfe619a316529d75050724",
  measurementId: "G-02SZRC4258"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);