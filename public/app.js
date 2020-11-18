console.log(firebase)
var provider = new firebase.auth.GoogleAuthProvider();

// 사용자 인증 //

const auth = firebase.auth();

const whenSignedIn = document.getElementById('WhenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

auth.onAuthStateChanged(user => {
    if (user) {
        // 사인 인
        userDetails.innerHTML = '<h3>안녕하세요 ${user.displayName}!</h3> <p>사용자 아이디 : ${user.uid}</p>';
    } else {
        // 사인인 안 했을 때
        userDetails.innerHTML = '';
    }
});

function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}