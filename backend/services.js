import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

export const addRequest = async (requestData) => {
    return await addDoc(collection(db, "requests"), {
        ...requestData,
        status: "pending",
        createdAt: serverTimestamp()
    });
};

export const listenToRequests = (callback) => {
    return onSnapshot(collection(db, "requests"), (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};