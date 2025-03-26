//TODO#1 - DomContentLoaded 모든 HTML 문서가 로드된 상태 - 그래야 DOM element에 접근할 수 있음
const SERVER_URL="http://220.67.216.11:8000";
window.addEventListener("DOMContentLoaded",function(){
    //TODO#2 - strict 모드 설정
    'use strict';

    const loginForm = document.getElementById("login-form");
    //#TODO#5 login form validation 
    // 아이디 비밀번호 공백체크 및 focus 처리
    
    const validateForm=function(form){
        if(form['userId'].value.trim() == '' ){
            alert("userId empty!");
            form['userId'].focus();
            return false;
        }
        if(form['userPassword'].value.trim() == '' ){
            alert("userPassword empty!");
            form['userPassword'].focus();
            return false;
        }
    }

    //TODO#3 loginForm submit(전송) 이벤트 등록 submit 이벤트는 로그인 button을 클릭했을때 발생됨 
    // 단 로그인 버튼의 button type = 'submit'이어야 함, type='button'동작 안 함
    loginForm.addEventListener("submit",function(event){
        event.preventDefault();
        //TODO#4 loginForm validation 실행 
        //event.target = form 자체를 의미함.
        if( validateForm(event.target)==false ){
            return ;
        }

        const userId = event.target['userId'].value;
        const userPassword = event.target['userPassword'].value;

        //TODO#6 로그인 api 호출 
        // 로그인이 성공하면 동작할 function(user){...} 함수를 parameter로 전달
        
        doLogin(userId, userPassword, function(user){
            //TODO#9 로그인 성공시 loginSuccess 함수 로직
            //success ui 디자인
            const loginWrapper = document.getElementById("login-wrapper");
            loginWrapper.setAttribute("style","display:none;");
            const loginSuccess = document.getElementById("login-success");
            loginSuccess.setAttribute("style","display:block");
            
            const loginUserId = document.getElementById("login-userId");
            const loginUserName = document.getElementById("login-userName");
            const loginCartId = document.getElementById("login-cartId");

            loginUserId.innerText=user.userId;
            loginUserName.innerText=user.userName;
            loginCartId.innerText=user.cartId;

            //TODO#10 카트 api 호출
            //cart api 호출이 성공하면 실행할 function(items){} 함수를 parameter로 전달 
            getCartItems(user.userId, user.cartId, function(items){
                //TODO#13 displayCartItems 실행
                const cartTable = document.getElementById("cart-table");
                const body = cartTable.getElementsByTagName("tbody")[0];
                const intl = new Intl.NumberFormat();

                for (const item of items) {
                    const tr = document.createElement("tr");
                    const td1 = document.createElement("td");
                    const td2 = document.createElement("td");
                    const td3 = document.createElement("td");
                    const td4 = document.createElement("td");
                    const td5 = document.createElement("td");
                    td1.innerText=item.productId;
                    td2.innerText=item.name;
                    td3.innerText=intl.format(item.price);
                    td4.innerText=intl.format(item.amount);
                    td5.innerText= intl.format(item.totalPrice);
                    tr.append(td1,td2,td3,td4,td5);
                    body.append(tr);
                }
            });

        });

    });
});

//TODO#7 로그인 처리
function doLogin(userId, userPassword, loginSuccess){

    const xhr = new XMLHttpRequest();
    const url = SERVER_URL+"/api/users/login";

    const data = {
        userId : userId,
        userPassword :userPassword
    }
    
    xhr.addEventListener("load",function(){
        if(this.status==200){
            const user = this.response;
            //TODO#8 로그인 성공시 loginSuccess 함수호출
            loginSuccess(user);
        }else{
            alert(`id, password 를 확인해주세요! : ${this.status} :  ${this.response.message}` );
            console.log(response);
            throw new Error(this.response);
        }
    });

    xhr.addEventListener("error",function(e){
        alert('network error');
    });

    xhr.open("POST",url);
    xhr.setRequestHeader("content-type","application/json");
    xhr.responseType="json";
    xhr.send(JSON.stringify(data));
}

//TODO#11 cart-api 호출
function getCartItems(userId, cartId, displayCartItems){
    const xhr = new XMLHttpRequest();
    const url =SERVER_URL + "/api/nhnmart/shopping-cart/" + cartId;

    xhr.addEventListener("load", function(){
        if(this.status==200){
            console.log(this.response);
            const items = this.response;
            //TODO#12 cart-api가 정상적으로 호출되면
            //parameter로 전달받은 displayCartIitems() 함수 호출
            displayCartItems(items);
        }else{
            console.log(this.response);
            alert("cart-api error");
            throw new Error(this.response);
        }
    });

    xhr.addEventListener("error",function(){
        alert('network error');
    })

    xhr.open("GET",url);
    xhr.setRequestHeader("content-type","application/json");
    xhr.setRequestHeader("X-USER-ID", userId);
    xhr.responseType="json";
    xhr.send('');
    
}