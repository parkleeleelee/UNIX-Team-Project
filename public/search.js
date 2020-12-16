var database = firebase.firestore();
var licensesRef = database.collection("Name");

function searchHandler(e) {
    if (e.keyCode == 13) {
        var findText = e.target.value;
        var resultText = [];
        var query = licensesRef.get().then(snapshot => {
            snapshot.forEach(doc => {
                if (doc.data().liname.indexOf(findText) != -1) {
                    resultText.push(doc.data().liname);
                }
            });

            var op = new Option();
            console.log(resultText)
            var select = document.getElementById('box');
            select.options.length = 0;
            op.text = "자격증 선택";
            op.value = "자격증 선택";
            select.add(op);

            for (i = 0; i < resultText.length; i++) {
                op = new Option();
                op.text = resultText[i];
                op.value = resultText[i];
                select.add(op);
            }
        }).catch(err => {
            document.getElementById('result').value = "Something wrong.." + err;
        });
    }
}