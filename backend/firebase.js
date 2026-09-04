import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAw3g74qKeJTDts4dqhxXuc5reRjrlADQs",
    authDomain: "resq-mesh-2026.firebaseapp.com",
    projectId: "resq-mesh-2026",
    storageBucket: "resq-mesh-2026.firebasestorage.app",
    messagingSenderId: "79952073506",
    appId: "1:79952073506:web:1a4eb3572224d40bfdcb7b",
    measurementId: "G-P1GWKX7R9R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);