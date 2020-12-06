/* 종목 코드에 해당하는 필기, 실기 시험 일자를 가져와 형식에 맞게 변환하는 코드 */
// URL 요청을 위한 모듈
var firebase = require("firebase");

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

const request = require('request');

// 최종적으로 저장할 변수
var licenseDate = {
    "필기시험": "",
    "필기결과": "",
    "실기시험": "",
    "실기결과": ""
};

// 요청을 보낼 URL 제작
var tmpUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList?serviceKey=ldY0vGslgEruKo%2FDYPpevsI8akCSFXkXlIRlGWyasEPBxKmb%2BijZu%2BPnB%2BnQGbNb4uymFpExVcf%2BP8zYb90LlQ%3D%3D&_type=json';
var url = '';
// 종목 코드

var tmp = {};
var licenseList = [];
var lnum = [];
var lname = [];

var dateArray = [];
// 검색을 위한 변수
var searchResult = [];
var findStr = "정보처리";

// 서비스키 포함된 요청 URL
const listUrl = 'http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList?serviceKey=ldY0vGslgEruKo%2FDYPpevsI8akCSFXkXlIRlGWyasEPBxKmb%2BijZu%2BPnB%2BnQGbNb4uymFpExVcf%2BP8zYb90LlQ%3D%3D&_type=json';

// 지정한 LIST URL 로 데이터 요청
request({
    url: listUrl,
    method: 'GET'

    // 요청을 통해 정보를 가져옴
}, function(error, response, body) {
    if (error) { // 응답에 에러가 포함시 에러 출력
        console.log("ERROR : " + error);
    } else { // 에러가 없고 응답코드가 200(정상)일 경우 실행
        if (response.statusCode == 200) {
            // 응답받은 데이터를 result 변수에 저장
            var listResult = JSON.parse(body);

            // 데이터를 번호 : 이름 형태의 객체로 배열에 저장
            for (var i = 0; i < listResult.response.body.items.item.length; i++) {
                if (listResult.response.body.items.item[i].jmfldnm.indexOf('/') != -1) {
                    lname.push(listResult.response.body.items.item[i].jmfldnm.replace('/', ''))
                } else {
                    lname.push(listResult.response.body.items.item[i].jmfldnm);
                }
                lnum.push(listResult.response.body.items.item[i].jmcd);
                tmp = new Object();
                tmp.linum = String(lnum[i]);
                tmp.liname = lname[i];
                licenseList.push(tmp);
            }

            databaseurl(licenseList);
        } else { // 에러가 없지만 응답 코드가 200이 아닐 경우 (정상적인 응답이 안될경우)
            console.log('STATUS CODE : ' + response.statusCode);
        }
    }
});

// listAPI에서 라이센스 이름과 번호를 받아와 번호로 라이센스 일자를 찾고 데이터베이스에 넣는 함수
async function databaseurl(licenseList) {
    // 파이어베이스 파이어스토어를 db에 호출
    var db = firebase.firestore();

    // 파이어베이스스토어에 존재하는 Licenses콜렉션의 라이센스이름의 문서를 불러와 docRef에 저장
    var name = await databasename(licenseList[6])
    var docRef = db.collection("Licenses").doc(name.liname);
    console.log(name.liname);
    // 파이어스토어에 존재하는 값들을 불러오는 작업
    docRef.get().then(async function(doc) {
        // 만약 라이센스 이름과 같은 문서가 존재하면
        if (doc.exists) {
            // 해당 라이센스 이름의 linum을 불러옴 그리고 licenseCode에 저장
            var licenseCode = doc.data().linum;
            console.log("Document data:", doc.data().linum);
            url = tmpUrl + '&jmCd=' + licenseCode;

            // url에 licenseCode를 추가시켜줌
            console.log(name);
            await databasesave(name, db, url);

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

// 데이터베이스에 이름을 차례대로 불러오기위한 함수
function databasename(licenseList) {
    return new Promise(function(resolve, reject) {
        resolve(licenseList);
    })
}

// 데이터베이스에 저장하는 함수
function databasesave(licenseList, db, url) {
    return new Promise(function(resolve, reject) {
        request({
            url: url,
            method: 'GET'
        }, function(error, response, body) { // 요청을 통해 받은 데이터를 통해 함수 실행
            console.log(url);
            if (error) { // 에러 데이터가 있으면 에러 출력
                console.log('ERROR CODE : ' + error);
            } else { // 에러 데이터 없이 응답코드가 정상이면 출력
                if (response.statusCode == 200) {
                    // 요청한 데이터를 저장
                    var result = JSON.parse(body);

                    // tmp 변수를 통해 날짜 형식을 0000-00-00 으로 변환
                    var tmp = String(result.response.body.items.item[0].docexamstartdt);
                    licenseDate.필기시험 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);
                    tmp = String(result.response.body.items.item[0].docpassdt);
                    licenseDate.필기결과 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);
                    tmp = String(result.response.body.items.item[0].pracexamstartdt);
                    licenseDate.실기시험 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);
                    tmp = String(result.response.body.items.item[0].pracpassstartdt);
                    licenseDate.실기결과 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);

                    // 실행할 코드 여기 !
                    console.log(licenseDate);
                    // 파이어베이스스토어에 LicenseDate컬렌션안의 라이센스 이름으로된 문서가 만들어지고
                    // 그 문서안에 속성들을 생성해줌

                    db.collection("LicensesDate").doc(licenseList.liname).set({
                            prstart: licenseDate.필기시험,
                            prend: licenseDate.필기결과,
                            wrstart: licenseDate.실기시험,
                            wrend: licenseDate.실기결과
                        })
                        .catch(function(error) {
                            console.error("Error adding document: ", error);
                        });

                    console.log("완료");
                } else { // 에러 데이터 없으나 응답코드가 비정상
                    console.log('STATUS ERROR : ' + response.statusCode);
                }
            }
        });
        resolve();
        reject("error");
    });
}
