/* import API_URL from "./backend_url"; */

  /////////////////////////////////// Set API //////////////////////////////////////////////
  //    Basic Settings (e.g link api)                                                     //
  //////////////////////////////////////////////////////////////////////////////////////////
  // give api_url link
  const API_URL = 'http://localhost:5000'
  // getJSON initialization
  console.log('API')
  const getJSON = (path, options) => 
      fetch(path, options).then(res => res.json())
                          .catch(err => console.warn(`API_ERROR: ${err.message}`));
  class API {
      /**
       * Defaults to teh API URL
       * @param {string} url 
       */
      constructor(url = API_URL) {
          this.url = url;
      } 
      makeAPIRequest(path, options) {
          return getJSON(`${this.url}/${path}`, options);
      }
      /**
       * @returns feed array in json format
       */
      getFeed() {
          return this.makeAPIRequest('feed.json');
      }
      /**
       * @returns auth'd user in json format
       */
      getMe() {
          return this.makeAPIRequest('me.json');
      }
  
  }
  const api  = new API();
//////////////////////////// API Finished  /////////////////////////////////////////////////
  
//////////////////////////// set cookie function //////////////////////
function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}
function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}
//////////////////////////// set cookie finish //////////////////////  

// while we click sign up button, login window will be hidden, sign up window will be visible
function signup_menu(){
    inner_box.style.visibility="hidden";
    inner_box_2.style.visibility = "visible";
}

// while we click login button, login window will be visible, sign up window will be hidden
function login_menu(){
    inner_box.style.visibility="visible";
    inner_box_2.style.visibility = "hidden";
}

////////////////////////////// check_login function ///////////////////////////////////////////////
// check_login function [Student]                                                                         //
// this function aimed to Verify user information：                                           //
//                correct => get permission                                                   //
//                incorrect => alert                                                          //
// this function will be called if the user choose login button on login window               //
////////////////////////////////////////////////////////////////////////////////////////////////
function check_login(){
    const username_ckeck = document.getElementById("user_name_input").value;
    const password_check = document.getElementById("user_password_input").value;
    console.log("login.js--line81");
    if (!username_ckeck){
        window.alert('Please input your username!');
        return false;
      }else if (!password_check){
        window.alert('Please input your password!')
      }else{
        console.log("login-line88")
        const user_check = {
            "ID" : username_ckeck,
            "Password" : password_check
          }
        const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        };
        const method = 'POST'; 
        const path = 'auth/login';
        api.makeAPIRequest(path,{
            method,headers,
            body: JSON.stringify(user_check)})
            .then(function(res){
                console.log(res);
                if (res["Token"]){
                    Nickname = res["Nickname"];
                    setCookie("Nickname",Nickname,30);
                    const author_JSON = String(res["Token"]); 
                    //console.log(author_JSON);
                    setCookie("author_JSON",author_JSON,30);
                    window.location.href = "student_choice.html";
                }else{
                    window.alert("Invalied Username/Password");
                }
            
            })
      }
}

//similar as student check login
//diff: when connect api, the path is diff
function check_login_tutor(){
    const username_ckeck = document.getElementById("user_name_input").value;
    const password_check = document.getElementById("user_password_input").value;
    console.log("login.js--line120");
    if (!username_ckeck){
        window.alert('Please empty your username!');
        return false;
      }else if (!password_check){
        window.alert('Please empty your password!')
      }else{
        console.log("login-line127")
        const user_check = {
            "ID" : username_ckeck,
            "Password" : password_check
          }
        const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        };
        const method = 'POST'; 
        const path = 'auth/login_tutor';
        api.makeAPIRequest(path,{
            method,headers,
            body: JSON.stringify(user_check)})
            .then(function(res){
                if (res["Token"]){
                   
                    const author_JSON = String(res["Token"]); 
                    setCookie("author_JSON",author_JSON,30);
                    
                    Nickname = res["Nickname"];
                    setCookie("Nickname",Nickname,30);
                    window.location.href = "tutor.html";
                }else{
                    alert("Permission limited");
                }
            })
      }
}

// when student choose sign up, user information will send to the backend,
// if the user info has been accept, user will be login auto
function sign_up(){
    const username_ckeck = document.getElementById("user_name_input").value;
    const password_check = document.getElementById("user_password_input").value;
    const Nickname_check = document.getElementById("user_nickname_input").value;
    if (!username_ckeck){
        window.alert('Please input your username!');
        return false;
      }else if (!password_check){
        window.alert('Please input your password!')
      }else{
        console.log("login-line163")
        const user_check = {
            "ID" : username_ckeck,
            "Password" : password_check,
            "Nickname" : Nickname_check,
          }
        const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        };
        const method = 'POST'; 
        const path = 'auth/signup';
        api.makeAPIRequest(path,{
            method,headers,
            body: JSON.stringify(user_check)})
            .then(function(res){
                if (res["Token"]){
                    Nickname = res["Nickname"];
                    setCookie("Nickname",Nickname,30);
                    const author_JSON = String(res["Token"]); 
                    setCookie("author_JSON",author_JSON,30);
                    window.location.href = "student_choice.html";
                }else{
                    window.alert("Invalied Username/Password");
                }
            })
      }

}

// similar as student check login in 
// diff: check did this tutor in our tutor list
function sign_up_tutor(){
    const username_ckeck = document.getElementById("user_name_input_1").value;
    const password_check = document.getElementById("user_password_input_1").value;
    const Nickname_check = document.getElementById("user_nickname_input_1").value;
    if (!username_ckeck){
        window.alert('Please input your username!');
        return false;
      }else if (!password_check){
        window.alert('Please input your password!')
      }else{
        console.log("login-line163")
        const user_check = {
            "ID" : username_ckeck,
            "Password" : password_check,
            "Nickname" : Nickname_check,
          }
        const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        };
        const method = 'POST'; 
        const path = 'auth/signup_tutor';
        api.makeAPIRequest(path,{
            method,headers,
            body: JSON.stringify(user_check)})
            .then(function(res){
                if (res["Token"]){
                    console.log("")
                    Nickname = res["Nickname"];
                    const author_JSON = String(res["Token"]); 
                    setCookie("Nickname",Nickname,30);
                    setCookie("author_JSON",author_JSON,30);
                    
                    
                    window.location.href = "tutor.html";
                }else{
                    window.alert("Invalied Username/Password");
                }
            })
      }

}