// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAtMau1mVeujFR7nJlrjSFXcdVNwT9GKVg",
    authDomain: "liary-30c97.firebaseapp.com",
    databaseURL: "https://liary-30c97.firebaseio.com",
    projectId: "liary-30c97",
    storageBucket: "liary-30c97.appspot.com",
    messagingSenderId: "1005204747821",
    appId: "1:1005204747821:web:4f1d2a2833fbf396316aa4",
    measurementId: "G-9PKBBRDZ38"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// 파이어베이스 인증 사용을 위한 선언
firebase.analytics();
// 데이터 베이스 사용하기 전 선언
var database = firebase.database();