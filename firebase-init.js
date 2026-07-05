import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAbbSKOYd9s8kcFrOVEzgRYCANwwv6oYh8",
  authDomain: "element-explorer-75909.firebaseapp.com",
  projectId: "element-explorer-75909",
  storageBucket: "element-explorer-75909.firebasestorage.app",
  messagingSenderId: "873802490297",
  appId: "1:873802490297:web:52a05b6eec4d415c6bd668",
  measurementId: "G-DLB5L92EY5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
