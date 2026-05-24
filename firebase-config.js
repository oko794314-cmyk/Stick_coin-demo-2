// Firebase Configuration for bb-coin-aae0a
const firebaseConfig = {
    apiKey: "AIzaSyD_REPLACE_WITH_YOUR_API_KEY",
    authDomain: "bb-coin-aae0a.firebaseapp.com",
    databaseURL: "https://bb-coin-aae0a-default-rtdb.firebaseio.com",
    projectId: "bb-coin-aae0a",
    storageBucket: "bb-coin-aae0a.appspot.com",
    messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
    appId: "REPLACE_WITH_YOUR_APP_ID"
};

if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized for bb-coin-aae0a');
}