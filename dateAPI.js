/* 종목 코드에 해당하는 필기, 실기 시험 일자를 가져와 형식에 맞게 변환하는 코드 */
// URL 요청을 위한 모듈
const request = require('request');

// 최종적으로 저장할 변수
var licenseDate = {
    "필기시험": "",
    "필기결과": "",
    "실기시험": "",
    "실기결과": ""
};

// 요청을 보낼 URL 제작
var url = 'http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList';
url += '?serviceKey=ldY0vGslgEruKo%2FDYPpevsI8akCSFXkXlIRlGWyasEPBxKmb%2BijZu%2BPnB%2BnQGbNb4uymFpExVcf%2BP8zYb90LlQ%3D%3D&_type=json';
// 종목 코드
var licenseCode = '0752';
url += '&jmCd=' + licenseCode;

// 요청을 통해 응답을 받는 과정
request({
    url: url,
    method: 'GET'
}, function (error, response, body) {   // 요청을 통해 받은 데이터를 통해 함수 실행
    if (error){ // 에러 데이터가 있으면 에러 출력
        console.log('ERROR CODE : ' + error);
    } else {    // 에러 데이터 없이 응답코드가 정상이면 출력
        if (response.statusCode == 200){
            // 요청한 데이터를 저장
            var result = JSON.parse(body);

            // tmp 변수를 통해 날짜 형식을 0000-00-00 으로 변환
            var tmp = String(result.response.body.items.item.docexamstartdt);
            licenseDate.필기시험 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);
            tmp = String(result.response.body.items.item.docpassdt);
            licenseDate.필기결과 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);
            tmp = String(result.response.body.items.item.pracexamstartdt);
            licenseDate.실기시험 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);
            tmp = String(result.response.body.items.item.pracpassstartdt);
            licenseDate.실기결과 = tmp.slice(0, 4) + '-' + tmp.slice(4, 6) + '-' + tmp.slice(tmp.length - 2);
            
            // 실행할 코드 여기 !
            console.log(licenseDate);

        } else {    // 에러 데이터 없으나 응답코드가 비정상
            console.log('STATUS ERROR : ' + response.statusCode);
        }
    }
});