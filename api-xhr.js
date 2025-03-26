const flightScheduleApi = (function(){
    'use strict';
    const SERVICE_KEY = "QjQXFpLSIGMaYqAlfZCWQz1b1Sjb7NxPXaTsrwkmNrWvzgPODXRt3meSNvIdFqQP5ujLfaqtp9Sx1nDnvnFyeQ==";

    //운행스케줄 api
    const api = new Object();
    
    async function getAirlineList(){
        let url = 'http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getAirmanList'; /*URL*/
        let queryParams = '?' + encodeURIComponent('serviceKey') + '='+SERVICE_KEY; /*Service Key*/
        queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
        url+=queryParams;
        //TODO#1 항공사 리스트 구하기

        const response = await fetch(url);
        const json = await response.json();

        const items = json.response.body.items.item;
        console.log(items)
        return !items ? [] : items;

        
    }

    api.getAirportList = async function(){
        let url = "http://apis.data.go.kr/1613000/DmstcFlightNvgInfoService/getArprtList";
        let queryParams = '?' + encodeURIComponent('serviceKey') + '='+SERVICE_KEY; /*Service Key*/
            queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json'); /**/
            url+=queryParams;
            //TODO#2 공항리스트 구하기

        const response = await fetch(url);
        const json = await response.json();

        const items = json.response ? json.response.body.items.item : json.body.items.item;

        return !items ? [] : items;
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

        //TODO#3 항공운항정보 조회

        const response = await fetch(url);
        const json = await response.json();

        let items = json.response ? json.response.body.items.item : json.body.items.item;

        if(!items) {
            return [];
        }

        if(!Array.isArray(items)){
            items = [items];
        }
        
        return items;
    }

    api.search=async function(depAirportId,arrAirportId,depPlandTime){
        const airlineList = await getAirlineList();

        //조회로직 실행
        depPlandTime = depPlandTime.replaceAll("-","");
        const promiseList = [];

        for (const airline of airlineList) {
            const promise = getFlightSchedule(depAirportId,arrAirportId,depPlandTime,airline.airlineId);
            //TODO#4 항공사별 운항정보를 얻어서 하나의 리스트로 리턴
            promiseList.push(promise);
        }

        // 모든 promise를 처리하고, fulfilled된 결과의 value들을 합침
        const items = await Promise.allSettled(promiseList).then((arr)=>{
            const result = [];
            for(let i = 0; i<arr.length; i++){
                result.push(...arr[i].value);
            }        
            return result;    
        });

        return items;
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
    const airportList = await flightScheduleApi.getAirportList();
    

    console.log(airportList);

        // 공항 리스트를 selectBox에 할당 
    airportList.forEach(item => {
        const option = document.createElement("option");
        option.value = item.airportId;
        option.text = item.airportNm;
        // 예를 들어, 기본 선택 조건을 넣을 수 있음
        departureId.appendChild(option.cloneNode(true));
        arrivalId.appendChild(option);
    });

    const validateForm = function(form){
        const departureId = form["departureId"];
        const arrivalId = form["arrivalId"];
        const departureIdValue  = departureId.options[departureId.selectedIndex].value;
        const arrivalIdValue  = arrivalId.options[arrivalId.selectedIndex].value;

        if(!departureIdValue || !arrivalIdValue){
            alert("공항을 선택하세요.");
            return false;
        }
        if(departureIdValue === arrivalIdValue){
            alert("출발 공항과 도착 공항은 다르게 선택해야 합니다.");
            return false;
        }
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

    // schedule-tbl 아이디를 가진 테이블 요소를 docu음ment 에서 찾음
    const scheduleTbl = document.getElementById("schedule-tbl");
    // 해당 테이블의 첫 번째 <tbody> 요소를 선택
    const tbody = scheduleTbl.getElementsByTagName("tbody")[0];

    // 기존 tbody에 존재하는 모든 <tr> 요소를 삭제
    while(tbody.firstChild){
       tbody.firstChild.remove();
    }

    // items 배열의 각 항목에 대해 새로운 테이블 행(<tr>)을 만듦
    for(let i=0; i<items.length; i++){
        // 새로운 <tr> 요소 생성
        const tr = document.createElement("tr");

        // 항공편명
        const tdFlight = document.createElement("td");
        tdFlight.innerText = items[i].vihicleId || "";

        // 항공사명
        const tdAirline = document.createElement("td");
        tdAirline.innerText = items[i].airlineNm || "";

        // 출발시간 - convertDate 함수 사용으로 사용자가 보기 좋은 형식으로 변환
        const tdDepTime = document.createElement("td");
        tdDepTime.innerText = items[i].depPlandTime ? convertDate(items[i].depPlandTime) : "";

        // 도착시간 - convertDate 함수 사용으로 사용자가 보기 좋은 형식으로 변환
        const tdArrTime = document.createElement("td");
        tdArrTime.innerText = items[i].arrPlandTime ? convertDate(items[i].arrPlandTime) : "";

        // 일반석운임 - Intl.NumberFormat 을 사용해 57900을 "57,900"과 같이 쉼표가 들어간 숫자로 변환
        const tdEconomy = document.createElement("td");
        tdEconomy.innerText = (items[i].economyCharge !== "" && items[i].economyCharge != null)
            ? new Intl.NumberFormat().format(items[i].economyCharge)
            : "";

        // 비즈니스석운임 - Intl.NumberFormat 을 사용해 57900을 "57,900"과 같이 쉼표가 들어간 숫자로 변환
        const tdPrestige = document.createElement("td");
        tdPrestige.innerText = (items[i].prestigeCharge !== "" && items[i].prestigeCharge != null)
            ? new Intl.NumberFormat().format(items[i].prestigeCharge)
            : "";

        // 출발공항
        const tdDepAirport = document.createElement("td");
        tdDepAirport.innerText = items[i].depAirportNm || "";

        // 도착공항
        const tdArrAirport = document.createElement("td");
        tdArrAirport.innerText = items[i].arrAirportNm || "";

        // 각 <td>를 생성한 <tr> 에 추가함
        tr.append(tdFlight, tdAirline, tdDepTime, tdArrTime, tdEconomy, tdPrestige, tdDepAirport, tdArrAirport);

        // 완성된 행 <tr> 을 tbody 에 추가하여 화면에 표시
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