// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCN02YrRSSfRuhq24uOW04yYFSS3FpgHBo",
    authDomain: "creditsmart-a4bcd.firebaseapp.com",
    projectId: "creditsmart-a4bcd",
    storageBucket: "creditsmart-a4bcd.firebasestorage.app",
    messagingSenderId: "629815889736",
    appId: "1:629815889736:web:cd0713d458db79d7f22d7d",
    measurementId: "G-BQ3BX6CEJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);