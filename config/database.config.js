const { initializeApp } = require('@firebase/app');
const { getFirestore } = require('@firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "jb-premium.firebaseapp.com",
    projectId: "jb-premium",
    storageBucket: "jb-premium.appspot.com",
    messagingSenderId: "643042258540",
    appId: "1:643042258540:web:d3be02655ff52cb2fab249",
    measurementId: "G-S599SSNMQ4"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

module.exports = db