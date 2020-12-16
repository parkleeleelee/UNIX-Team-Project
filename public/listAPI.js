/* 자격증 목록을 불러와서 번호 : 이름 형태의 객체로 배열에 저장하는 코드 */
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

// URL 요청을 위한 모듈
const request = require('request');

// 정보를 저장할 변수들 선언
var tmp = {};
var licenseList = [];
var lnum = [];
var lname = [];

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

            databaseonlyname(licenseList)

        } else { // 에러가 없지만 응답 코드가 200이 아닐 경우 (정상적인 응답이 안될경우)
            console.log('STATUS CODE : ' + response.statusCode);
        }
    }
});



// firestore에 자격증 저장
function databaselname(licenseList) {
    var db = firebase.firestore();
    for (var i = 0; i < licenseList.length; i++) {
        db.collection("Licenses").doc(licenseList[i].liname).set({
                linum: licenseList[i].linum
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    }
    console.log("완료");
}

function databaseonlyname(licenseList) {
    var db = firebase.firestore();
    for (var i = 0; i < licenseList.length; i++) {
        db.collection("Name").doc(`name${i}`).set({
                liname: licenseList[i].liname
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    }
    console.log("완료");
}

// 검색 알고리즘
function searchName(licenseList, findStr) {
    // 자격증 목록 크기만큼 반복하면서 찾는 문자열이 포함된 객체의 인덱스 값 저장
    for (var i = 0; i < licenseList.length; i++) {
        if (licenseList[i].liname.indexOf(findStr) != -1) {
            searchResult.push(i);
        }
    }
    // 찾은 인덱스 수 만큼 반복하면서 자격증 목록을 통해 출력
    searchResult.forEach(function(i) {
        console.log(licenseList[i].liname);
        console.log(licenseList[i].linum);
    });
}