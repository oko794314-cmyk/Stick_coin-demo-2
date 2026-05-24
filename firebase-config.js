// Firebase Configuration for bb-coin-aae0a
const firebaseConfig = {
    apiKey: "AIzaSyDbfjwmvuGyUOuxNWFQuFsX6ly51fJPbbw",
    authDomain: "bb-coin-aae0a.firebaseapp.com",
    databaseURL: "https://bb-coin-aae0a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bb-coin-aae0a",
    storageBucket: "bb-coin-aae0a.firebasestorage.app",
    messagingSenderId: "1070135810161",
    appId: "1:1070135810161:web:66fb2be43c949d267123d0",
    measurementId: "G-DDJTNT4HJY"
};

if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized for bb-coin-aae0a');
}