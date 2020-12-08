console.log(firebase);
var provider = new firebase.auth.GoogleAuthProvider();

// 사용자 인증 //

const auth = firebase.auth();
var db = firebase.firestore();

const whenSignedIn = document.getElementById('WhenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // 사인 인
        // 파이어베이스 데이터 쓰는 부분
        userDetails.innerHTML = `<h3>안녕하세요 ${user.displayName}님!</h3> <p>사용자 아이디 : ${user.uid}</p>`;
        db.collection("users").doc(user.uid).set({
                first: "Ada",
                last: "Lovelace",
                born: "1815"
            })
            .then(function() {
                console.log("어 써졌어");
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        // 파이어베이스 데이터 읽는 부분
        var docRef = db.collection("users").doc(user.uid);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data().first);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    } else {
        // 사인인 안 했을 때
        alert("로그아웃");
        userDetails.innerHTML = "";
    }
});
