const flightScheduleApi = (function(){
    'use strict';
    const SERVICE_KEY = "oqWzAGWsxHR/cre4r5C2TJD0qw9ldrsGzxIAnDQRIvb31Gt6m/EDMUhczdZ5gIFINhj/QBbAVRTnFuTnBMOJyw==";

    //운행스케줄 api
    const api = new Object();
    
    async function getAirlineList(){
        let url = 'http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getAirmanList'; /*URL*/
        let queryParams = '?' + encodeURIComponent('serviceKey') + '='+SERVICE_KEY; /*Service Key*/
        queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
        url+=queryParams;
        //TODO#1 항공사 리스트 구하기


        //FIXME#1-1 테스트용 나중에 삭제해주세요
        const result =`[
            {
              "airlineId": "AAR",
              "airlineNm": "아시아나항공"
            },
            {
              "airlineId": "ABL",
              "airlineNm": "에어부산"
            },
            {
              "airlineId": "ASV",
              "airlineNm": "에어서울"
            },
            {
              "airlineId": "ESR",
              "airlineNm": "이스타항공"
            },
            {
              "airlineId": "FGW",
              "airlineNm": "플라이강원"
            },
            {
              "airlineId": "HGG",
              "airlineNm": "하이에어"
            },
            {
              "airlineId": "JJA",
              "airlineNm": "제주항공"
            },
            {
              "airlineId": "JNA",
              "airlineNm": "진에어"
            },
            {
              "airlineId": "KAL",
              "airlineNm": "대한항공"
            },
            {
              "airlineId": "TWB",
              "airlineNm": "티웨이항공"
            }
          ]`;

        return JSON.parse(result);
    }

    api.getAirportList = async function(){
        let url = "http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getArprtList";
        let queryParams = '?' + encodeURIComponent('serviceKey') + '='+SERVICE_KEY; /*Service Key*/
            queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
            url+=queryParams;
            //TODO#2 공항리스트 구하기


        //FIXME#2-1 테스트용 데이터 나중에 삭제해주세요.
        const result = `
        [
            {
              "airportId": "NAARKJB",
              "airportNm": "무안"
            },
            {
              "airportId": "NAARKJJ",
              "airportNm": "광주"
            },
            {
              "airportId": "NAARKJK",
              "airportNm": "군산"
            },
            {
              "airportId": "NAARKJY",
              "airportNm": "여수"
            },
            {
              "airportId": "NAARKNW",
              "airportNm": "원주"
            },
            {
              "airportId": "NAARKNY",
              "airportNm": "양양"
            },
            {
              "airportId": "NAARKPC",
              "airportNm": "제주"
            },
            {
              "airportId": "NAARKPK",
              "airportNm": "김해"
            },
            {
              "airportId": "NAARKPS",
              "airportNm": "사천"
            },
            {
              "airportId": "NAARKPU",
              "airportNm": "울산"
            },
            {
              "airportId": "NAARKSI",
              "airportNm": "인천"
            },
            {
              "airportId": "NAARKSS",
              "airportNm": "김포"
            },
            {
              "airportId": "NAARKTH",
              "airportNm": "포항"
            },
            {
              "airportId": "NAARKTN",
              "airportNm": "대구"
            },
            {
              "airportId": "NAARKTU",
              "airportNm": "청주"
            }
          ]
        `;
        return JSON.parse(result);
    }

    /* 
        * @param {*} depAirportId  출발공항 아이디
        * @param {*} arrAirportId  도착공항 아이디
        * @param {*} depPlandTime  출발시간 : 20230321
        * @param {*} airlineId     항공사 아이디
    */
    //getFlightSchedule("NAARKJJ","NAARKPC","20201202","AAR");
    async function getFlightSchedule(depAirportId,arrAirportId,depPlandTime,airlineId){
        let url = "http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getFlightOpratInfoList";
        let queryParams = "?serviceKey="  + encodeURIComponent(SERVICE_KEY);
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /**/
        queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
        queryParams += '&' + encodeURIComponent('depAirportId') + '=' + encodeURIComponent(depAirportId); /**/
        queryParams += '&' + encodeURIComponent('arrAirportId') + '=' + encodeURIComponent(arrAirportId); /**/
        queryParams += '&' + encodeURIComponent('depPlandTime') + '=' + encodeURIComponent(depPlandTime); /**/
        queryParams += '&' + encodeURIComponent('airlineId') + '=' + encodeURIComponent(airlineId); /**/
        url = url + queryParams;
        console.log(url);

        const response = await fetch(url);
        const json = await response.json();

        //TODO#3 항공운항정보 조회
        //FIXME#3
        const result =`[
            {
              "airlineNm": "아시아나항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221125,
              "depAirportNm": "광주",
              "depPlandTime": 202303221030,
              "economyCharge": 57900,
              "prestigeCharge": 0,
              "vihicleId": "OZ8141"
            },
            {
              "airlineNm": "아시아나항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221620,
              "depAirportNm": "광주",
              "depPlandTime": 202303221525,
              "economyCharge": 57900,
              "prestigeCharge": 0,
              "vihicleId": "OZ8145"
            },
            {
              "airlineNm": "아시아나항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221925,
              "depAirportNm": "광주",
              "depPlandTime": 202303221830,
              "economyCharge": 57900,
              "prestigeCharge": 0,
              "vihicleId": "OZ8149"
            },
            {
              "airlineNm": "제주항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221100,
              "depAirportNm": "광주",
              "depPlandTime": 202303221010,
              "vihicleId": "7C601",
              "economyCharge": "",
              "prestigeCharge": ""
            },
            {
              "airlineNm": "제주항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221910,
              "depAirportNm": "광주",
              "depPlandTime": 202303221820,
              "vihicleId": "7C605",
              "economyCharge": "",
              "prestigeCharge": ""
            },
            {
              "airlineNm": "진에어",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221110,
              "depAirportNm": "광주",
              "depPlandTime": 202303221015,
              "vihicleId": "LJ593",
              "economyCharge": "",
              "prestigeCharge": ""
            },
            {
              "airlineNm": "진에어",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221535,
              "depAirportNm": "광주",
              "depPlandTime": 202303221440,
              "vihicleId": "LJ597",
              "economyCharge": "",
              "prestigeCharge": ""
            },
            {
              "airlineNm": "진에어",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303222005,
              "depAirportNm": "광주",
              "depPlandTime": 202303221910,
              "vihicleId": "LJ595",
              "economyCharge": "",
              "prestigeCharge": ""
            },
            {
              "airlineNm": "대한항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221035,
              "depAirportNm": "광주",
              "depPlandTime": 202303220940,
              "economyCharge": 57900,
              "prestigeCharge": 82900,
              "vihicleId": "KE1603"
            },
            {
              "airlineNm": "대한항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303222045,
              "depAirportNm": "광주",
              "depPlandTime": 202303221950,
              "economyCharge": 57900,
              "prestigeCharge": 82900,
              "vihicleId": "KE1627"
            },
            {
              "airlineNm": "티웨이항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303220920,
              "depAirportNm": "광주",
              "depPlandTime": 202303220825,
              "vihicleId": "TW9901",
              "economyCharge": "",
              "prestigeCharge": ""
            },
            {
              "airlineNm": "티웨이항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221300,
              "depAirportNm": "광주",
              "depPlandTime": 202303221210,
              "vihicleId": "TW903",
              "economyCharge": "",
              "prestigeCharge": ""
            },
            {
              "airlineNm": "티웨이항공",
              "arrAirportNm": "제주",
              "arrPlandTime": 202303221605,
              "depAirportNm": "광주",
              "depPlandTime": 202303221510,
              "vihicleId": "TW9903",
              "economyCharge": "",
              "prestigeCharge": ""
            }
          ]`;
        return JSON.parse(result);
    }

    api.search=async function(depAirportId,arrAirportId,depPlandTime){
        const airlineList = await getAirlineList();

        //조회로직 실행
        depPlandTime = depPlandTime.replaceAll("-","");
        const promiseList = [];

        for (const airline of airlineList) {
            const promise = getFlightSchedule(depAirportId,arrAirportId,depPlandTime,airline.airlineId);
            //TODO#4 항공사별 운항정보를 얻어서 하나의 리스트로 리턴
        }

        return result;
    }

    return api;
})();

window.addEventListener("DOMContentLoaded",async function(){
    'use strict'
    
    const departureId = document.getElementById("departureId");
    const arrivalId = document.getElementById("arrivalId");
    
    //비행날짜
    const plandDate = document.getElementById("plandDate");
    //TODO#5 기본 날짜를 오늘로 설정
    plandDate.value = new Date().toISOString().substring(0,10);
    
    //FIXME #6 공항리스트 호출.
    const airportList = [];
    

    console.log(airportList);

    for (const item of airportList) {
    //TODO#7  selectBox (departureId,arrivalId)에 공항리스트 할당

    }

    const validateForm = function(form){
        const departureId = form["departureId"];
        const arrivalId = form["arrivalId"];
        const departureIdValue  = departureId.options[departureId.selectedIndex].value;
        const arrivalIdValue  = arrivalId.options[arrivalId.selectedIndex].value;
        //TODO#8 form validation
        // departureId, arrivalId 선택여부 체크
        // 출발(공항) == 도착(공항) retun false

        return true;
    };

    const findForm = document.getElementById("find-form");
    
    findForm.addEventListener("submit",async function(event){
        event.preventDefault();
        if(validateForm(event.target)==false){
            return;
        }

        //schedule 조회
        try{
            const depPlandTime = document.getElementById("plandDate").value;
            const items = await flightScheduleApi.search(departureId.value,arrivalId.value,depPlandTime);
            searchResult(items);

        }catch(e){
            alert(e);
        }
    });

});

function searchResult(items){

    const scheduleTbl = document.getElementById("schedule-tbl");
    const tbody = scheduleTbl.getElementsByTagName("tbody")[0];

    while(tbody.firstChild){
       //TODO#9tbody에 담겨있는 모든 <tr> 삭제
    }

    for(let i=0; i<items.length; i++){

        const tr = document.createElement("tr");
        //TODO#10 tbdoy에 <tr><td>...</td> ... </tr> 만들어서 넣기
        //숫자 서식 관려해서는 다음을 참고하기
        //https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat 
        //날짜 변환에 대해서는 convertDate(str) 함수를 이용해주세요

        tbody.append(tr);
    }
}

function convertDate(str){
    str = str.toString();
    //202303221125 -> 2023 03 22 11:25
    return str.substring(0,4) 
            + "-" + str.substring(4,6)
            + "-" + str.substring(6,8) 
            + " " + str.substring(8,10) 
            + ":" + str.substring(10,12);
}