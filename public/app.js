console.log(firebase);
var provider = new firebase.auth.GoogleAuthProvider();
var count = 0; // 파이어베이스 데이터 카운트 수
var usersdata = [];

// 사용자 인증 //

const auth = firebase.auth();
var db = firebase.firestore();

const whenSignedIn = document.getElementById('WhenSignedIn');
const whenSignedOut = document.getElementById('WhenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

signInBtn.onclick = async function() {
    await auth.signInWithPopup(provider);
    location.reload();
}
signOutBtn.onclick = async function() {
    await auth.signOut();
    location.reload();
}

auth.onAuthStateChanged(user => {
    if (user) {
        // 사인 인
        // 파이어베이스 데이터 쓰는 부분
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>안녕하세요 ${user.displayName}님!</h3>`;
        // 파이어베이스 데이터 읽는 부분
        var docRef = db.collection(user.uid);
        console.log(user.uid);

        docRef.where('allDay', '==', true).get().then(function(snapshot) {
            if (snapshot.empty) {
                console.log('No matching documents');
                return;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                usersdata.push(doc.data());
            })
            console.log(usersdata);
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        docRef.where('allDay', '==', false).get().then(function(snapshot) {
            if (snapshot.empty) {
                console.log('No matching documents');
                return;
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                usersdata.push(doc.data());
            })
            console.log(usersdata);
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

    } else {
        // 사인인 안 했을 때
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = "";
    }
});