<<<<<<< HEAD
< script src = "https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js" > < /script>

<!-- TODO: Add SDKs for Firebase products that you want to use
https: //firebase.google.com/docs/web/setup#available-libraries -->
    <
    script src = "https://www.gstatic.com/firebasejs/8.0.1/firebase-analytics.js" > < /script>
console.log(firebase)
var provider = new firebase.auth.GoogleAuthProvider();

=======
console.log(firebase)
var provider = new firebase.auth.GoogleAuthProvider();

>>>>>>> d86f1b262e94b62de5913c58d118586f58b0975d
login.onclick = () => auth.signInWithPopup(provider);