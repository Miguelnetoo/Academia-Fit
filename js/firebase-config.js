import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAUZH2eyUtrf3DAudkWalh1JPBTp9qPNfo",
    authDomain: "academiafit-154f2.firebaseapp.com",
    projectId: "academiafit-154f2",
    storageBucket: "academiafit-154f2.firebasestorage.app",
    messagingSenderId: "92411434006",
    appId: "1:92411434006:web:3dbbee09ec7631c6375137"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(app);