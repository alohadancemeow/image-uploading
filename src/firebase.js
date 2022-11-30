// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnUfMrO4SEfcSKgjN3vyDT0yxmRaIPpZQ",
    authDomain: "image-uploading-551ff.firebaseapp.com",
    projectId: "image-uploading-551ff",
    storageBucket: "image-uploading-551ff.appspot.com",
    messagingSenderId: "707049067873",
    appId: "1:707049067873:web:3703a5c992bc7688f96120"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)