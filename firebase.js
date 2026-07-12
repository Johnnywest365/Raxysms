// ======================================
// Firebase Configuration - RaxySMS
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAyWUPG0RKi9pWs9xnJyZu2qBi1EfFkQ7w",
    authDomain: "raxysms-b1160.firebaseapp.com",
    projectId: "raxysms-b1160",
    storageBucket: "raxysms-b1160.firebasestorage.app",
    messagingSenderId: "1045520566902",
    appId: "1:1045520566902:web:1fe1e651e9fe99d66ead57"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };
