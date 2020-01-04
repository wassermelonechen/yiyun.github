document.body.style.backgroundColor="rgba(237,185,72,0.8)";
document.getElementById("user_window").innerText = getCookie("Nickname");
var author_JSON=getCookie("author_JSON");
var Nickname=getCookie("Nickname");
/* responsiveVoice.speak(document.getElementById("upcoming").textContent); */
var chat_time=0;
var lang="normal_case";
var chatbot_reminder=0;
var Words;
var TalkWords;
var xhr;
//document.getElementById(asay).innerText=`Hi ${Nickname}, you can try to <br> 1. Ask me some questions in the input box. <br> 2.Enter professional mode by selecting a course. <br> 3. `;
//////////////////////////// set cookie function //////////////////////
function setCookie(cname,cvalue,exdays){
    console.log("test");
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname){
    console.log("test");
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}
//////////////////////////// set cookie finish //////////////////////  


/////////////////////////////////// Set API //////////////////////////////////////////////
//    Basic Settings (e.g link api)                                                     //
//////////////////////////////////////////////////////////////////////////////////////////
// give api_url link
var API_URL = 'http://localhost:5000'
// getJSON initialization
var getJSON = (path, options) => 
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
var api  = new API();
//////////////////////////// API Finished  /////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////
function InputPress() {
    console.log("test");
    if (event.keyCode == 13) { 
        chatRoom();
        console.log("line-75");
    }	
} 

function chatRoom(){

    console.log("test");
    var str = "";
    if(TalkWords.value == ""){
        return;
    }
    str = ` <div class="btalk"><span> ${TalkWords.value} </span></div>`;  
    
    toChat2();
    console.log("lin-87");
    Words.innerHTML = Words.innerHTML + str;
    //document.getElementById("TalkWords").value="";

}

function toChat2(){
    send_value=lang+TalkWords.value;
    // new WebSocket
    console.log("lin-95");
    var ws = new WebSocket("ws://localhost:4200");

    // send message to the backend
    ws.onopen = function () {
        // use send()data message
        ws.send(send_value);
    };
    // return data
    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        //console.log(received_msg);
        document.getElementById('ttsText').value=`${received_msg}`;
        str = `<div class = "chatbot_logo" id =chatbot_logo>
                <i class="fas fa-robot chatbot_logo_sp2"></i> </div>
                <div class="atalk"><span id=atalk_${chat_time} > ${received_msg} </span>
                <i class="fas fa-volume-up" id=voice_output_menu_${received_msg} onclick="doTTS('atalk_${chat_time}')"></i>
                </div>` ;  
        chat_time+=1;
        
        Words.innerHTML = Words.innerHTML + str;
        TalkWords.value = "";
        Words.scrollTop = Words.scrollHeight;
    };
}

///////////////////////////////// word transfer voice ////////////////////////////
function doTTS(x) {
    
    var ttsDiv = document.getElementById('bdtts_div_id');
    var ttsAudio = document.getElementById('tts_autio_id');
    var ttsText = document.getElementById(x).innerHTML;
    // 文字转语音
    console.log("line-129");
    ttsDiv.removeChild(ttsAudio);
    var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
    var sss = '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=en&ie=UTF-8&per=3&spd=5&text=' + ttsText + '" type="audio/mpeg">';
    var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
    var au2 = '</audio>';
    ttsDiv.innerHTML = au1 + sss + eee + au2;

    ttsAudio = document.getElementById('tts_autio_id');

    ttsAudio.play();
}
///////////////////////////////// word transfer voice  END ////////////////////////////


///////////////////////////////// voice transfer words ////////////////////////////
function speech_voice(){
    console.log("line-146");
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    
    var colors = ['yellow'];
    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;' 
    
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 100;
    
    recognition.start();
    recognition.onresult = function(event) {
        var last = event.results.length - 1;
        var color = event.results[last][0].transcript;
        talkwords.value=color;
        
      }
}

function timestamp(time){
    console.log(time)
    var unixTimestamp = new Date(time * 1000);
    var commonTime = unixTimestamp.toLocaleString()
    return commonTime
}

//waiting for delete
///////////////////////////////// upcoming event //////////////////////////// 
function upcoming_event(){
    console.log("line-182");
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Token ' + author_JSON 
       };
    const method = 'GET';
    const path = 'personal_info/happy';
    api.makeAPIRequest(path, {
        method, headers,
    }).then(function (res){
       
        for (var i=0;i<res["Students_upcoming"].length;i++){ 
            var message=`${timestamp(res["Students_upcoming"][i]["Time"])} -- ${res["Students_upcoming"][i]["Detail"]}`
            var str=`<div class="upcoming_event_line_css" id = "upcoming_event_line_${i}">`+`${message}`+`</div>`
            upcoming_event_outside.innerHTML+=str;
            console.log("lailalallalalallalal");
        }
    })
}

///////////////////////////////// upcoming event END ////////////////////////////

////////////////////// onclick ////////////////////////////////
asay.onclick=function(){
    console.log("line-207");
    asay.remove();
    str = '<div class="atalk"><span> Please enter your question in the input box below </span></div>' ;  
    Words.innerHTML = str;
    talkwords.innerText="Please enter your question here";
    talkwords.onclick=function(){
        talkwords.innerText="";  
    }
}

// 
function upcoming_try(){
    console.log("line-219");
    if(document.getElementById("asay_upcomming")){
        document.getElementById("asay_upcomming").remove();
    }
    var str='<div class="atalk"><span id="asay_upcomming">Please keep an eye on what will happen next.</div>'
    Words.innerHTML+=str;

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Token ' + author_JSON 
        };
        const method = 'GET';
        const path = 'personal_info/happy';
        api.makeAPIRequest(path, {
            method, headers,
        }).then(function (res){
            console.log(res);
            for(var i=0;i<res["Students_upcoming"].length;i++){
                var message=`${timestamp(res["Students_upcoming"][i]["Time"])} -- ${res["Students_upcoming"][i]["Detail"]}`
                var str = `<div class="button  flex-center atalk_special" id = "upcoming_event_line_${i}">${message}</div>`
                asay_upcomming.innerHTML+=str;
            }
            Words.scrollTop = Words.scrollHeight;
        })
}

function upcoming_1_try(){
    console.log("line-247");
    if (document.getElementById("asay_upcomming")){
        document.getElementById("asay_upcomming").remove();
    }

    var str='<i class="fas fa-robot chatbot_logo_sp2"></i> </div><div class="atalk"><span id="asay_upcomming">I can add anything in your upcoming</p> \
                <input class= reminder_input id = input_reminder> </input> \
                <i class="far fa-plus-square" id = reminder_ad onclick=add_upcoming()></i>  </div>'
    Words.innerHTML+=str;
    Words.scrollTop = Words.scrollHeight;
}

//
function add_upcoming(){
    console.log("line-261");
    Words.scrollTop = Words.scrollHeight;
    console.log(input_reminder.value);
    if (input_reminder.value==""){
        alert("You cannot add empty upcoming");
    }else{

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':'Token '+author_JSON,
       };
    const method = 'POST';
    const path = 'upcoming/upcoming'; 
    const upcoming_detail ={
        "Time":Math.round(new Date().getTime()/1000),
        "Details":input_reminder.value,
    }      
    api.makeAPIRequest(path,{
        method,headers,
        body: JSON.stringify(upcoming_detail)
    }).then(function(){
        asay_upcomming.remove();
        var str='<div class="atalk"><span><i class="fas fa-thumbs-up"></i> &nbsp;Sucess</div>'
        Words.innerHTML+=str;
        Words.scrollTop = Words.scrollHeight;
    })
    }

}

// if you click ' Course website' ==> linked to course information web
function Booking_consultation_1_try(){
    console.log("test");
    window.location.href = "https://www.handbook.unsw.edu.au/";
}

// if you click '+consultation' ==> all consultation information will be created
function Booking_consultation_try(){
    console.log("test");
    if (document.getElementById("asay_consultation")){
        document.getElementById("asay_consultation").remove();
    }

    var str='<div class="atalk"><span id="asay_consultation">Which time do you want to booking?</div>'
    Words.innerHTML+=str;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
       };
       const method = 'GET';
       const path = 'consultations/consultations_all';
       api.makeAPIRequest(path, {
        method, headers,
        }).then(function (res){
            //console.log(res["consultations"]);
            const total_message=[];
            for(var i=0;i<res["consultations"].length;i++){
                var message=`${res["consultations"][i]["Course"]} -- ${res["consultations"][i]["Details"]}`;
                total_message.push(message);
                var str = `<div class="button  flex-center atalk_special" id = "consultation_line_${i}" > ${message}</div>  `
                document.getElementById("asay_consultation").innerHTML+=str;
            }
            console.log(res["consultations"].length);
            for(var j=0;j<res["consultations"].length;j++){
                let xxx=total_message[j];
                document.getElementById(`consultation_line_${j}`).onclick=function(){
                    var a=confirm("Do you want to booking?");
                    if (a==true){
                        const headers = {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization':'Token '+author_JSON,
                        };
                        const method = 'POST';
                        const path = 'upcoming/upcoming';
                        const add_consultation_time ={
                            "Time":Math.round(new Date().getTime()/1000),
                            "Details":`${xxx}`,
                        }
                        api.makeAPIRequest(path,{
                            method,headers,
                            body: JSON.stringify(add_consultation_time)
                        })
                        var str_1='<div class="atalk"><span><i class="fas fa-thumbs-up"></i> &nbsp;Sucess</div>'
                        Words.innerHTML+=str_1;
                        Words.scrollTop = Words.scrollHeight;
                    }
                }
            }

            Words.scrollTop = Words.scrollHeight;
        })
}

// recall voice transmission
voice_text.onclick = function() {   
    console.log("line-357");   
    speech_voice();
    console.log('Ready to receive the sentence.');
}

// when you click ask menu => help line will created again
ask_menu.onclick=function(){
    console.log("test");
    console.log("line-364");
    var str = `<div class=ask_out_side id='ask_out_side'>  <div class= 'atalk ask_sp'><span_blue id='asay' > <i class='far fa-bell reminders_logo '></i>  <div class='reminders_intro'> Reminders </div>  <div class = 'button  flex-center atalk_special' id='upcoming_1' onclick="upcoming_1_try()"> <i class='fas fa-bell'></i>  &nbsp; Add Reminder </div>   <div class = 'button  flex-center atalk_special' id='upcoming' onclick="upcoming_try()" > <i class='fas fa-list-alt'></i>   &nbsp; Check Upcoming</div>  </div>  <div class=' atalk ask_sp'><span_2 id='asay' >  <i class='fas fa-graduation-cap reminders_logo'></i>  <div class='reminders_intro'> Class</div>  <div class = 'button  flex-center atalk_special' id='Booking_consultation_1' onclick="Booking_consultation_1_try()"> <i class='fas fa-university'></i>   &nbsp;&nbsp; Course website &nbsp; </div>  <div class = 'button  flex-center atalk_special' id='Booking_consultation' onclick="Booking_consultation_try()"><i class='fas fa-hourglass-half'></i>   &nbsp; &nbsp;+ Consultation &nbsp;</div>   </div>  <div class=' atalk ask_sp'><span id='asay' >  <i class='fas fa-comment-dots reminders_logo'></i>  <div class='reminders_intro'> Chat Now</div>  <div class = 'button  flex-center atalk_special' id='course_related_9900' onclick="course_9900()" >&nbsp;&nbsp;<i class='fas fa-headset'></i>  &nbsp; &nbsp; Comp9900 &nbsp;&nbsp;&nbsp;</div> <div class = 'button  flex-center atalk_special' id='course_related_9444' onclick="course_9444()">&nbsp;&nbsp;<i class='fas fa-headset'></i> &nbsp; &nbsp; COMP9444 &nbsp;&nbsp;&nbsp;</div></div>   </div>`
     Words.innerHTML+=str;
     Words.scrollTop = Words.scrollHeight;

}

// onclick function start line=====>
// send 9900 to the backend
function course_9900(){
    console.log("test");
    lang="";
    send_value="COMP9900";
    var ws = new WebSocket("ws://localhost:4200");
    ws.onopen = function () {
        ws.send(send_value);
    };
    alert("You have successfully entered the professional version <COMP9900>");
    talkwords.innerText="Please enter your question here";
    talkwords.onclick=function(){
        talkwords.innerText="";  
    }
}

// send 9444 to the backend
function course_9444(){
    console.log("test");
    lang="";
    send_value="COMP9444";
    var ws = new WebSocket("ws://localhost:4200");

    ws.onopen = function () {
        ws.send(send_value);
    };
    alert("You have successfully entered the professional version <COMP9444>");
    talkwords.innerText="Please enter your question here";
    talkwords.onclick=function(){
        talkwords.innerText="";  
    }
}


function upcoming_chatbot(ID){
    console.log("test");
    var str=`<div class="atalk"><span id="asay_upcomming_${ID}">Please keep an eye on what will happen next.</div>`;
    Words.innerHTML+=str;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Token ' + author_JSON 
        };
        const method = 'GET';
        const path = 'personal_info/happy';
        api.makeAPIRequest(path, {
            method, headers,
        }).then(function (res){
            for(var i=0;i<res["Students_upcoming"].length;i++){
                var message=`${timestamp(res["Students_upcoming"][i]["Time"])} -- ${res["Students_upcoming"][i]["Detail"]}`
                var str = `<div class="button  flex-center atalk_special" id = "upcoming_event_line_${i}">${message}</div>`
                document.getElementById(`asay_upcomming_${ID}`).innerHTML+=str;
            }
            Words.scrollTop = Words.scrollHeight;
        })
}
// onclick function finish line=====>


////////////////////// onclick END ////////////////////////////

function ask2forum(){
    console.log("line-431");
    var str='<i class="fas fa-robot chatbot_logo_sp2"></i> </div><div class="atalk"><span id="asay_upcomming">I will help you post your question on forum</p> \
            <input class= reminder_input_2 id = input_forum_course placeholder = "Course"> </input> \
            <input class= reminder_input_2 id = input_forum_title placeholder = "Title"> </input> \
            <input class= reminder_input_2 id = input_forum_body placeholder = "Detail"> </input> \
            <input class= reminder_input_2 id = input_forum_tag placeholder = "Tag"> </input> \
            <i class="far fa-plus-square" id = reminder_ad_2 onclick=add_forum()></i>  </div>'
        Words.innerHTML+=str;
        Words.scrollTop = Words.scrollHeight;
}

function add_forum(){
    console.log("test");
    var forum_title=document.getElementById("input_forum_title").value;
    var forum_body=document.getElementById("input_forum_body").value;
    var forum_tag=document.getElementById("input_forum_tag").value;
    var course=document.getElementById("input_forum_course").value;

    if (forum_title=="" || forum_body=="" || forum_tag=="" || course=="" ){
        alert("Please don't miss any input");
    }else{

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : 'Token ' + author_JSON 
           };
        const method = 'POST';
        const path = 'forum/person/all_class';
        
        
        const post_info_2={
            'Time':Math.round(new Date().getTime()/1000),
            'Course': course,
            'Title':forum_title,
            'Details':forum_body,
            'tag':forum_tag,
        }
        api.makeAPIRequest(path,{
            method,headers,
            body: JSON.stringify(post_info_2)
        })
        var str_1='<div class="atalk"><span><i class="fas fa-thumbs-up"></i> &nbsp;Sucess</div>'
        Words.innerHTML+=str_1;
        Words.scrollTop = Words.scrollHeight;
    }


}

window.onload = function(){  
    Words = document.getElementById("words"); 
    TalkWords = document.getElementById("talkwords"); 
    InputPress();
    document.getElementById('talk_con_id').className = 'talk_con';
    document.getElementById('words').className = 'talk_show';	
    document.getElementById('talk_input_id').className = 'talk_input';	
    document.getElementById('talkwords').className = 'talk_word';	

}



