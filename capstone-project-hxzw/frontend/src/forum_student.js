
document.body.style.backgroundColor="rgba(237,185,72,0.8)";
user_window.innerText = getCookie("Nickname");

document.getElementById("forum_box").style.height= "2200px";
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
var author_JSON=getCookie("author_JSON");
//////////////////////////// API Finished  /////////////////////////////////////////////////

// this function aimed to create all the posts
function forum_c(guess){
    document.getElementById("all_forum").innerHTML="";
    const path = 'forum/person/all_class';
    const headers={
    'Accept': 'application/json',
    'Content-Type':'application/json',
    'Authorization':'Token '+author_JSON,
    };
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            for (var i=0;i<res["Forum"].length;i++){
                console.log(res["Forum"][i]["CourseCode"]);
                if (res["Forum"][i]["CourseCode"] == guess){
                    new_box(i,res["Forum"][i]);
                }  
            }
    })
}

// this function aimed to change times[2837472849] to times[2019/11/24 19:00]
function timestamp(time){
    //console.log(time)
    var unixTimestamp = new Date(time * 1000);
    var commonTime = unixTimestamp.toLocaleString();
    return commonTime
}

// this function is combined addcomment_2 ==> 
function addcomment(comment){
    document.getElementById("comment_area").style="visibility:visible" ;
    send_message.onclick=addcomment_2(comment);
}
// this function is combined addcomment ==>
// comment information will send to the backend[PosterID,Time,Details,Commenter]
// while the backend updated,web will be refresh
function addcomment_2(comment){
    var xxff=document.getElementById("talkwords_2").value;
    console.log(xxff);
    const path='comment/comment';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'POSt';
    
     const add_comment_detail={
        "Time":Math.round(new Date().getTime()/1000),
        "Post":comment,
        "Details":document.getElementById("talkwords_2").value,
    }
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(add_comment_detail),})
///xxxxxxxxxxxxxxxxx
    document.getElementById("comment_area").style="visibility:hidden" ;
}

// this function aimed to: user can vote posts
// send [userID, PostID] ==> backend
function postvotes(PostID){
    const path = 'forum/PostVotes';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'POSt';
    const post_information = {
        "PostID":PostID
    }
    api.makeAPIRequest(path,{
        method,headers,
        body: JSON.stringify(post_information),})
        .then(function(res){
            console.log(res);
           // window.onload("")
           window.location.replace("forum_student.html");
        })
    }

// large ==> small
function JsonSort(json,key){
    //console.log(json);
    for(var j=1,jl=json.length;j < jl;j++){
        var temp = json[j],
            val  = temp[key],
        i = j-1;
        while(i >=0 && json[i][key]<val){
            json[i+1] = json[i];
            i = i-1;    
        }
        json[i+1] = temp;    
    }
        //console.log(json);
    return json;
}
//small ==> large
function JsonSort_2(json,key){
    //console.log(json);
    for(var j=1,jl=json.length;j < jl;j++){
        var temp = json[j],
            val  = temp[key],
        i = j-1;
        while(i >=0 && json[i][key]>val){
            json[i+1] = json[i];
            i = i-1;    
        }
        json[i+1] = temp;    
    }
        //console.log(json);
    return json;
}

// this function aimed to create one post box per time
// it will created all student's posts
function new_box(id,detail){
     //console.log(detail);
     var small_pic = [
         '1.jpg',
         '2.jpg',
         '3.jpg',
         '4.jpg',
         '5.jpeg',
         '6.jpeg',
         '7.jpg',
         '8.jpg',
         '9.jpeg',
         '10.jpeg',
     ]
     var random = Math.random();
     random = parseInt(10*random);
     var str_1 = `<div id = photo_or_name_${id} class = "photo_or_name"><img src=images/${small_pic[random]} class = "image_class"></img>
     
                        ${detail["Poster_Nickname"]} </div>`; // 头像部分
     
     var str_3 = `<div id = forum_new_box_title_${id} class="forum_new_box_title">${detail["Title"]}</div>` ;//标题
    //console.log(detail["meta"]);
    // console.log(detail["PostDate"]);
     var str_4 = `<div id = forum_new_box_time_${id} class="forum_new_box_time">${timestamp(detail["PostDate"])}</div>`; // detail? why not
     
     var str_5 = `<div id = forum_new_box_describe_${id} class="forum_new_box_describe"> ${detail["Contents"]} </div>`

     var str_6 = `<div id = forum_new_box_tag_${id} class="forum_new_box_tag " onclick="tag_search_2('${detail["tag"]}')">${detail["tag"]} </div>` 
 
     var str_8 = `<div id = forum_comment_${id} class="forum_comment" onclick="comment_appear('${detail["PostID"]}')" >
                    <i class="fas fa-comment-dots"></i>
                    ${detail["NumberOfComments"]}</div>`;   // comment_button
     var str_9 = `<div id = forum_vote_${id} class="forum_comment">
                    <i class="far fa-thumbs-up" onclick ="postvotes('${id}')"></i>
                    ${detail["NumberOfVotes"]}</div>`;          // vote_button
     var str_plus = `<div id = forum_comment_plus_${id} class="forum_comment" onclick = "addcomment('${id}')">  </div>`

    var str_8_0 =`<div class=comment_size id=comment_${detail["PostID"]}></div>`;



     var str_7 = `<div class = forum_cv>${str_plus+str_8+str_9  }</div>`
 
     var str_2 = `<div id = forum_new_box_detail_${id} class="forum_new_box_detail">${str_3+str_4+str_5+str_6+str_7+str_8_0}</div>`// 右半部分
     
     var str_0 = `<div id = new_box_${id} class="new_box_css">${str_1+str_2}</div>`
     document.getElementById("all_forum").innerHTML+=str_0;
 }

// this function aimed to create one post box per time
// the diff with new_box: it worked for create userself's post
function new_box_2(id,detail){
    //console.log(detail["FORUM"]);
    var small_pic = [
        '5.jpeg',
    ]

    var str_1 = `<div id = photo_or_name_${id} class = "photo_or_name"><img src=images/${small_pic[0]} class = "image_class"></img>
    
                       ${detail["Poster_Nickname"]} </div>`; // 头像部分
    
    var str_3 = `<div id = forum_new_box_title_${id} class="forum_new_box_title">${detail["Title"]}</div>` ;//标题
   //console.log(detail["meta"]);
   // console.log(detail["PostDate"]);
    var str_4 = `<div id = forum_new_box_time_${id} class="forum_new_box_time">${timestamp(detail["PostDate"])}</div>`; // detail? why not
    
    var str_5 = `<div id = forum_new_box_describe_${id} class="forum_new_box_describe"> ${detail["Contents"]} </div>`

    var str_6 = `<div id = forum_new_box_tag_${id} class="forum_new_box_tag ">${detail["tag"]} </div>` 

    var str_8 = `<div id = forum_comment_${id} class="forum_comment" >
                   <i class="fas fa-comment-dots"></i>
                   ${detail["NumberOfComments"]}</div>`;   // comment_button
    var str_9 = `<div id = forum_vote_${id} class="forum_comment">
                   <i class="far fa-thumbs-up" ></i>
                   ${detail["NumberOfVotes"]}</div>`;          // vote_button
    var str_plus = `<div id = forum_comment_plus_${id} class="forum_comment" ></div>`

    var str_delete=`<div id=delete_forum_me class="delete_forum_me" ><i class="fas fa-trash-alt" onclick="delete_forum('${detail["PostID"]}')"></i>  </div>`;
    


    var str_7 = `<div class = forum_cv>${str_plus+str_8+str_9}</div>`

    var str_2 = `<div id = forum_new_box_detail_${id} class="forum_new_box_detail">${str_delete+str_3+str_4+str_5+str_6+str_7}</div>`// 右半部分
    
    var str_0 = `<div id = new_box_${id} class="new_box_css">${str_1+str_2}</div>`
    document.getElementById("all_forum").innerHTML+=str_0;


   for(var j=0;j<detail["Comments"].length;j++){
       if(`${detail["Comments"][j]["Commenter"]}`.length == 0) {
        
       }else{
           console.log(detail["Comments"]);
           console.log(j);   
           var c_0 =`<div class=new_box_css_2 id=comment_box> ${detail["Comments"][j]["Commenter"]}[${timestamp(detail["Comments"][j]["Time"])}]&nbsp;:&nbsp;&nbsp;&nbsp; ${detail["Comments"][j]["Detail"]}\
           &nbsp;&nbsp;&nbsp;<i class="far fa-smile" onclick= "add_comment_vote_2([${detail["Comments"][j]["ID"]},1])"    ></i>&nbsp;&nbsp; ${detail["Comments"][j]["CommentVote_good"]}\
           &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;<i class="far fa-frown" onclick= "add_comment_vote_2([${detail["Comments"][j]["ID"]},0])" ></i>&nbsp;&nbsp;${detail["Comments"][j]["CommentVote_bad"]}
           </div>`
           document.getElementById("all_forum").innerHTML+=c_0;
       }
       }

}

// this function aimed to create one post box per time
// the diff with new_box: it worked for create the posts which answered by the user
function new_box_3(id,detail){
    //console.log(detail["FORUM"]);
    var small_pic = [
        '1.jpg',
    ]
    var str_1 = `<div id = photo_or_name_${id} class = "photo_or_name"><img src=images/${small_pic[0]} class = "image_class"></img>
    
                       ${detail["Poster_Nickname"]} </div>`; // 头像部分
    
    var str_3 = `<div id = forum_new_box_title_${id} class="forum_new_box_title">${detail["Title"]}</div>` ;//标题
   //console.log(detail["meta"]);
   // console.log(detail["PostDate"]);
    var str_4 = `<div id = forum_new_box_time_${id} class="forum_new_box_time">${timestamp(detail["PostDate"])}</div>`; // detail? why not
    
    var str_5 = `<div id = forum_new_box_describe_${id} class="forum_new_box_describe"> ${detail["Contents"]} </div>`

    var str_6 = `<div id = forum_new_box_tag_${id} class="forum_new_box_tag ">${detail["tag"]} </div>` 

    var str_8 = `<div id = forum_comment_${id} class="forum_comment" >
                   <i class="fas fa-comment-dots"></i>
                   ${detail["NumberOfComments"]}</div>`;   // comment_button
    var str_9 = `<div id = forum_vote_${id} class="forum_comment">
                   <i class="far fa-thumbs-up" ></i>
                   ${detail["NumberOfVotes"]}</div>`;          // vote_button
    var str_plus = `<div id = forum_comment_plus_${id} class="forum_comment" ></div>`

    
    var str_7 = `<div class = forum_cv>${str_plus+str_8+str_9}</div>`

    var str_2 = `<div id = forum_new_box_detail_${id} class="forum_new_box_detail">${str_3+str_4+str_5+str_6+str_7}</div>`// 右半部分
    
    var str_0 = `<div id = new_box_${id} class="new_box_css">${str_1+str_2}</div>`
    document.getElementById("all_forum").innerHTML+=str_0;


   for(var j=0;j<detail["Comments"].length;j++){
       if(`${detail["Comments"][j]["Commenter"]}`.length == 0) {
        
       }else{
           console.log(detail["Comments"]);
           console.log(j);   
           var c_0 =`<div class=new_box_css_2 id=comment_box> ${detail["Comments"][j]["Commenter"]}[${timestamp(detail["Comments"][j]["Time"])}]&nbsp;:&nbsp;&nbsp;&nbsp; ${detail["Comments"][j]["Detail"]}\
           &nbsp;&nbsp;&nbsp;<i class="far fa-smile" onclick= "add_comment_vote_2([${detail["Comments"][j]["ID"]},1])"    ></i>&nbsp;&nbsp; ${detail["Comments"][j]["CommentVote_good"]}\
           &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;<i class="far fa-frown" onclick= "add_comment_vote_2([${detail["Comments"][j]["ID"]},0])" ></i>&nbsp;&nbsp;${detail["Comments"][j]["CommentVote_bad"]}
           </div>`
           document.getElementById("all_forum").innerHTML+=c_0;
       }
       }

}

// this function is to create forums for student interface
// similar function [forum_related_course,forum_newest,forum_MostVote,forum_MoreAnswers,forum_LessAnswers]
// diff: sortBy: time 
function forum_newest(){
    document.getElementById("all_forum").innerHTML="";
    const path = 'forum/person/all_class/time';
    const headers={
    'Accept': 'application/json',
    'Content-Type':'application/json',
    'Authorization':'Token '+author_JSON,
    };
    //console.log(headers);
    //console.log("line-67")
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            var res_course=JsonSort(res["Forum"],'PostDate');
              for (var i=0;i<res["Forum"].length;i++){
              new_box(i,res["Forum"][i]);
            }
        
    })
}

// this function is to create forums for student interface
// similar function [forum_related_course,forum_newest,forum_MostVote,forum_MoreAnswers,forum_LessAnswers]
// diff: sortBy: VoteNumber 
function forum_MostVote(){
    document.getElementById("all_forum").innerHTML="";
    const path = 'forum/person/all_class/time';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    //console.log(headers);
    //console.log("line-67")
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            var res_course=JsonSort(res["Forum"],'NumberOfVotes');

            for (var i=0;i<res["Forum"].length;i++){
                new_box(i,res["Forum"][i]);
            }
            
    })
}

// this function is to create forums for student interface
// similar function [forum_related_course,forum_newest,forum_MostVote,forum_MoreAnswers,forum_LessAnswers]
// diff: sortBy: AnswerNumber [more => less]
function forum_MoreAnswers(){
    document.getElementById("all_forum").innerHTML="";
    const path = 'forum/person/all_class/time';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    //console.log(headers);
    //console.log("line-67")
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            //console.log(res);
          //  console.log(res_course)
            var res_course=JsonSort(res["Forum"],'NumberOfComments');
          //  console.log(res_course)
            //var i=res_course.length-1;i>0;i--

         /*    <a href="student_information.html">profile</a> */
         //console.log(res["Forum"][0]["Poster_Nickname"])
            for (var i=0;i<res["Forum"].length;i++){
                new_box(i,res["Forum"][i]);
            }
            
    })
}

// this function is to create forums for student interface
// similar function [forum_related_course,forum_newest,forum_MostVote,forum_MoreAnswers,forum_LessAnswers]
// diff: sortBy: AnserNumber  [less => more]
function forum_LessAnswers(){
    document.getElementById("all_forum").innerHTML="";
    const path = 'forum/person/all_class/time';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    //console.log(headers);
    //console.log("line-67")
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            //console.log(res);
           // console.log(res_course)
            var res_course=JsonSort_2(res["Forum"],'NumberOfComments');
           // console.log(res_course)
            //var i=res_course.length-1;i>0;i--

         /*    <a href="student_information.html">profile</a> */
         //console.log(res["Forum"][0]["Poster_Nickname"])
            for (var i=0;i<res["Forum"].length;i++){
                new_box(i,res["Forum"][i]);
            }
            
    })
}

// this function aimed to create tag page
// title -- search bar -- tag area [all tags will show here]
function forum_tag(){
    var str='<div class="forum_top" id = forum_top>Tags</div>'
    document.getElementById("container").innerHTML=str;
    //document.getElementById("container").style="background-color:pink";
    var str='<div class="forum_top_2" id = forum_top_2>Using the right tags makes it easier for others to find and answer your question.</div>'
    document.getElementById("container").innerHTML+=str;
    //<input id = search_in class = search_in placeholder="Filter by tag name ></input>
    var str='<div class = forum_search_outside id = forum_search_outside> <input id = search_in class = search_in placeholder="Filter by forum title" ><i class="fas fa-search icon_search" onclick=tag_search(search_in.value)></i></input> </div>';
    document.getElementById("container").innerHTML+=str;

    /////////////////////////////////////////////////////
    const path = 'forum/Tags';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            //console.log(res);
            for(var i=0;i<res["Tag"].length;i++){
                const ff=`${res["Tag"][i]}`;
                //console.log(ff);
                var str=`<div class = forum_tag_box id=forum_tag_box_${i} onclick="tag_search_2('${ff}')"> ${res["Tag"][i]} </div>`;
                console.log(`forum_tag_box_${i}`);
                document.getElementById("container").innerHTML+=str;
            }
        })
}

// if the tag been selected, all posts related this tag will appear
function tag_search(someword){
    if (document.getElementById("search_in").value!="" ){
        var str='<div class="forum_top" id = forum_top>Tags</div>'
        document.getElementById("container").innerHTML=str;
        //document.getElementById("container").style="background-color:pink";
        var str='<div class="forum_top_2" id = forum_top_2>Using the right tags makes it easier for others to find and answer your question.</div>'
        document.getElementById("container").innerHTML+=str;
        //<input id = search_in class = search_in placeholder="Filter by tag name ></input>
        var str='<div class = forum_search_outside id = forum_search_outside> <input id = search_in class = search_in placeholder="Filter by tag name" ><i class="fas fa-search icon_search" onclick=tag_search(search_in.value)></i></input> </div>';
        document.getElementById("container").innerHTML+=str;

        document.getElementById("container").innerHTML+='<div class="all_forum" id = all_forum>';

        const path = 'forum/tag';
        const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
        };
        const sometg={
            "word_1":someword,
        }
        const method = 'POST';
        api.makeAPIRequest(path,{
            method,headers,
            body:JSON.stringify(sometg), })
            .then(function(res){
                for (var i=0;i<res["Forum"].length;i++){
                new_box(i,res["Forum"][i]);
                }
        })
    }

}  

// aim：If the user enters the content they want to query, 
// the content will send to backend ==> all title related to this content will be return to the fronted
function tag_search_2(someword){
    console.log(someword);
    var str='<div class="forum_top" id = forum_top>Tags</div>'
    document.getElementById("container").innerHTML=str;
    //document.getElementById("container").style="background-color:pink";
    var str='<div class="forum_top_2" id = forum_top_2>Using the right tags makes it easier for others to find and answer your question.</div>'
    document.getElementById("container").innerHTML+=str;
    //<input id = search_in class = search_in placeholder="Filter by tag name ></input>
    var str='<div class = forum_search_outside id = forum_search_outside> <input id = search_in class = search_in placeholder="Filter by tag name" ><i class="fas fa-search icon_search" onclick=tag_search(search_in.value)></i></input> </div>';
    document.getElementById("container").innerHTML+=str;

    document.getElementById("container").innerHTML+='<div class="all_forum" id = all_forum>';

    const path = 'forum/tag_2';
    const headers={
    'Accept': 'application/json',
    'Content-Type':'application/json',
    'Authorization':'Token '+author_JSON,
    };
    const sometg={
        "word_1":someword,
    }
    const method = 'POST';
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(sometg), })
        .then(function(res){
            for (var i=0;i<res["Forum"].length;i++){
              new_box(i,res["Forum"][i]);
            }
    })
}  

// this function will create announce page, 
// [auth detail] ==> backend ==>[participant course] ==> [related announcement]
function forum_announcement(){
    document.getElementById("container").classList="container_2";
    var str='<div class="forum_top" id = forum_top>Announcements</div>'
    document.getElementById("container").innerHTML=str;

    var str='<div class="forum_top_2" id = forum_top_2>~~~ Something will happen ~~~</div>'
    document.getElementById("container").innerHTML+=str;
    const path = 'announcements/announcements_all';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
    };
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
    .then(function(res){
        console.log(res);
        course_person = getCookie("CourseCode").split(",");
        for(var i=0;i<course_person.length;i++){
            var str=`<div class=forum_tag_box_2 id=forum_tag_box_2_${i}><div class=course_ann_title id = course_ann_title_${i}>${course_person[i]}</div> </div>`
            document.getElementById("container").innerHTML+=str; 
        };
        for (var j=0;j<res["announcements"].length;j++){
            for (var ii=0;ii<course_person.length;ii++){
                if (res["announcements"][j]["Course"] == course_person[ii]){
                    var str=`<div class=forum_ann_box id = class=forum_ann_box_${i}_${j}>\ 
                        <div> \
                        <div class =forum_ann_box_title> ${res["announcements"][j]["Title"]}</div>\
                        <div class =forum_ann_box_time> ${timestamp(res["announcements"][j]["Time"])}</div>\
                        <div class =forum_ann_box_body>${res["announcements"][j]["Details"]}</div> </div>`
                    document.getElementById(`forum_tag_box_2_${ii}`).innerHTML+=str;
                }
            }
        }
    })
}

// this function will create consultation page, 
// [auth detail] ==> backend ==>[participant course] ==> [related consultation information]
function forum_consultation(){
    document.getElementById("container").classList="container_2";
    var str='<div class="forum_top" id = forum_top>Consultations</div>'
    document.getElementById("container").innerHTML=str;

    var str='<div class="forum_top_2" id = forum_top_2>~~~ Welcome to booking consultation time ~~~</div>'
    document.getElementById("container").innerHTML+=str;
    const path = 'consultations/consultations_all';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
    };
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
    .then(function(res){
        //console.log(res);
        course_person = getCookie("CourseCode").split(",");
        for(var i=0;i<course_person.length;i++){
           // xxxx = `forum_tag_box_2_${i}`;
           // curr_course = course_person[i];
           // console.log(xxxx);
            var str=`<div class=forum_tag_box_2 id=forum_tag_box_2_${i}><div class=course_ann_title_2   id = course_ann_title_${i}>${course_person[i]}</div> </div>`
            document.getElementById("container").innerHTML+=str; 
        };
        for (var j=0;j<res["consultations"].length;j++){
            for (var ii=0;ii<course_person.length;ii++){
                if (res["consultations"][j]["Course"] == course_person[ii]){
                    var str=`<div class=forum_ann_box id = class=forum_ann_box_${i}_${j}>\ 
                        <div class =forum_ann_box_title> ${res["consultations"][j]["Details"]}</div>`
                    document.getElementById(`forum_tag_box_2_${ii}`).innerHTML+=str;
                }
            }
        }
    })
}

// this function will create profile page
// [personal information] + [course information] + [upcoming information]
function forum_profile(){
    document.getElementById("container").innerHTML="";
    document.getElementById("container").classList="container_2";
    var str='<div class="forum_top" id = forum_top>Profile & Upcoming</div>'
    document.getElementById("container").innerHTML=str;

    var str='<div class="forum_top_2" id = forum_top_2 >~~~ This is your detailed information ~~~</div>'
    document.getElementById("container").innerHTML+=str;

    var str='<div class="forum_per" id = forum_per> </div>'
    document.getElementById("container").innerHTML+=str;

    const path = 'personal_info/happy';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
    .then(function(res){
        //console.log(res);
        
        var str_00=`<div class="personal_info_0" id=personal_info_0> </div>`;
        document.getElementById("forum_per").innerHTML+=str_00;

        var str=`<div class="forum_per_line" id = forum_per_zid>&nbsp;&nbsp;&nbsp;&nbsp;<i class="far fa-id-card"></i> Z-ID:  ${res["Students"][0]["ID"]}  </div>`;
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Name>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-file-signature"></i> Name:   ${res["Students"][0]["Name"]}   </div>`
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Gender>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-venus"></i> Gender:    ${res["Students"][0]["Gender"]}  </div>`
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Birthday>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-birthday-cake"></i> Birthday:    ${res["Students"][0]["Birthday"]}  </div>`
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Email> &nbsp;&nbsp;&nbsp;&nbsp;<i class="far fa-envelope-open"></i>Email:     ${res["Students"][0]["Email"]} </div>`
        document.getElementById("personal_info_0").innerHTML+=str;
        
        var str_01=`<div class="personal_info_1" id=personal_info_1> </div>`;
        document.getElementById("forum_per").innerHTML+=str_01;
        

        var str=`<div class="forum_per_line" id = forum_per_Course> &nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-graduation-cap"></i>Courses: </div>`
        document.getElementById("personal_info_1").innerHTML+=str;


        for(var i=0; i<res["Students_type"].length;i++){
            if (`${res["Students_type"][i]["Type"]}`==1){
                var str=`<div class="forum_per_line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${res["Students_type"][i]["Course"]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Tutor]</div>  `
            }else{
                var str=`<div class="forum_per_line" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${res["Students_type"][i]["Course"]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Student]</div>  `
            }
            document.getElementById("personal_info_1").innerHTML+=str;
        }
        
        var str_02=`<div class="personal_info_1" id=personal_info_2> </div>`;
        document.getElementById("forum_per").innerHTML+=str_02;

        var str=`<div class="forum_per_line" id = forum_per_Course> &nbsp;&nbsp;&nbsp;&nbsp;<i class="far fa-bell"></i>Upcoming: </div>`
        document.getElementById("personal_info_2").innerHTML+=str;


        for(var i=0;i<res["Students_upcoming"].length;i++){
            var str_time=`${timestamp(res["Students_upcoming"][i]["Time"])}`;
            var str_body = `${res["Students_upcoming"][i]["Detail"]}`
            var str=`<div class=forum_per_line id=forum_upcoming_box>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${str_time}&nbsp;&nbsp;&nbsp;------&nbsp;&nbsp;&nbsp;${str_body} </div>`;
            document.getElementById("personal_info_2").innerHTML+=str;
        } 
 
    })
}

// all question you asked will be sended from the backend
function your_question(){
    var str='<div class="forum_top">Your question</div>';
    document.getElementById("container").innerHTML=str;
    document.getElementById("container").classList="container";
    var str='<div class="forum_top_2" >Your can delete your forum here</div>';
    document.getElementById("container").innerHTML+=str;
    //<input id = search_in class = search_in placeholder="Filter by tag name ></input>
    var str='<div class="forum_top_2" ></div>';
    document.getElementById("container").innerHTML+=str;

    str = '<div class = forum_filter id = forum_filter>\
            <div class="dropdown-content_2" id = xixixi>\
            </div></div>\
            <div class="all_forum" id = all_forum></div>'

    document.getElementById("container").innerHTML+=str;

    const path = 'forum/me';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            //console.log(res);
            for (var i=0;i<res["Forum"].length;i++){
                new_box_2(i,res["Forum"][i]);
            }      
    })
}

// all question you answered will be sended from the backend
function your_answer(){

    var str='<div class="forum_top">Your answered question</div>';
    document.getElementById("container").innerHTML=str;
    document.getElementById("container").classList="container";
    var str='<div class="forum_top_2" > You can track the questions you have answered</div>';
    document.getElementById("container").innerHTML+=str;
    //<input id = search_in class = search_in placeholder="Filter by tag name ></input>
    var str='<div class="forum_top_2" ></div>';
    document.getElementById("container").innerHTML+=str;

    str = '<div class = forum_filter id = forum_filter>\
            <div class="dropdown-content_2" id = xixixi>\
            </div></div>\
            <div class="all_forum" id = all_forum></div>'

    document.getElementById("container").innerHTML+=str;

    const path = 'forum/person/all_class';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };

    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            console.log(res);
            check_comment=0;
            for (var i=0;i<res["Forum"].length;i++){
                for(var j=0;j<res["Forum"][i]["Comments"].length;j++){
                    console.log(res["Forum"][i]["Comments"][j]["Commenter"]);
                    if (res["Forum"][i]["Comments"][j]["Commenter"]==res["ID"]){
                        check_comment=1;
                    }
                }
                if(check_comment==1){
                    new_box_3(i,res["Forum"][i]);
                }
                check_comment=0;
            }
            
    })


}

// interface similar like profile page, but you can change all information in this part
function setting_info(){
    document.getElementById("container").innerHTML="";
    document.getElementById("container").classList="container_2";
    var str='<div class="forum_top" id = forum_top>Personal information</div>'
    document.getElementById("container").innerHTML=str;

    var str='<div class="forum_top_2" id = forum_top_2 >~~~ You can change your information here ~~~</div>'
    document.getElementById("container").innerHTML+=str;

    var str='<div class="forum_per" id = forum_per> </div>'
    document.getElementById("container").innerHTML+=str;

    const path = 'personal_info/happy';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
    .then(function(res){
        //console.log(res);
        
        var str_00=`<div class="personal_info_0" id=personal_info_0> </div>`;
        document.getElementById("forum_per").innerHTML+=str_00;



        var str=`<div class="forum_per_line" id = forum_per_zid>&nbsp;&nbsp;&nbsp;&nbsp;<i class="far fa-id-card"></i> Z-ID: <input class=input_per value=${res["Students"][0]["ID"]} id=update_001></input>  </div>`;
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Name>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-file-signature"></i> Name: <input class=input_per value= ${res["Students"][0]["Name"]}  id=update_002></input>  </div>`
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Gender>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-venus"></i> Gender:  <input class=input_per value= ${res["Students"][0]["Gender"]}  id=update_003 ></input></div>`
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Birthday>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-birthday-cake"></i> Birthday:  <input class=input_per value=${res["Students"][0]["Birthday"]}  id=update_004></input> </div>`
        document.getElementById("personal_info_0").innerHTML+=str;
    
        var str=`<div class="forum_per_line" id = forum_per_Email> &nbsp;&nbsp;&nbsp;&nbsp;<i class="far fa-envelope-open"></i>Email: <input class=input_per value=${res["Students"][0]["Email"]}  id=update_005></input> </div>`
        document.getElementById("personal_info_0").innerHTML+=str;

        var str=`<div class=per_update id=per_update onclick="update_01()">Update</div>`;
        document.getElementById("personal_info_0").innerHTML+=str;

        
        var str_01=`<div class="personal_info_1" id=personal_info_1> </div>`;
        document.getElementById("forum_per").innerHTML+=str_01;
        

        var str=`<div class="forum_per_line" id = forum_per_Course> &nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-graduation-cap"></i>Courses: </div>`
        document.getElementById("personal_info_1").innerHTML+=str;


        for(var i=0; i<res["Students_type"].length;i++){
            if (`${res["Students_type"][i]["Type"]}`==1){
                var str=`<div class="forum_per_line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${res["Students_type"][i]["Course"]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Tutor] &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-trash-alt" onclick= "delete_course('${res["Students_type"][i]["Course"]}')"></i></div>  `
            }else{
                var str=`<div class="forum_per_line" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${res["Students_type"][i]["Course"]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Student]&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-trash-alt" onclick= "delete_course('${res["Students_type"][i]["Course"]}')"></i></div>  `
            }
            document.getElementById("personal_info_1").innerHTML+=str;
        }


        var str=`<div class=per_update id=per_update_2 onclick="add_class_xixi()" >&nbsp;&nbsp;&nbsp;Add</div>`;
        document.getElementById("personal_info_1").innerHTML+=str;
        
        var str_02=`<div class="personal_info_1" id=personal_info_2> </div>`;
        document.getElementById("forum_per").innerHTML+=str_02;

        var str=`<div class="forum_per_line" id = forum_per_Course> &nbsp;&nbsp;&nbsp;&nbsp;<i class="far fa-bell"></i>Upcoming: </div>`
        document.getElementById("personal_info_2").innerHTML+=str;


        for(var i=0;i<res["Students_upcoming"].length;i++){
            var str_time=`${timestamp(res["Students_upcoming"][i]["Time"])}`;
            var str_body = `${res["Students_upcoming"][i]["Detail"]}`
            var str=`<div class=forum_per_line id=forum_upcoming_box>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${str_time}&nbsp;&nbsp;&nbsp;------&nbsp;&nbsp;&nbsp;${str_body}&nbsp;&nbsp;<i class="fas fa-trash-alt" onclick="delete_up('${str_body}')" ></i> </div>`;
            document.getElementById("personal_info_2").innerHTML+=str;
        } 

        var str=`<div class=per_update id=per_update_3 onclick="add_upcoming()">&nbsp;&nbsp;&nbsp;Add</div>`;
        document.getElementById("personal_info_2").innerHTML+=str;
 
    })
}

// you can delete the forum you choosed
// student: themselives forum
// tutor: all forum
function delete_forum(id){


    var r=confirm("Do you want to delete your post?");//window.confirm("Press a button");
    if (r==true)
    {
    console.log(id);
    const path = 'forum/person/all_class';
    const headers={
    'Accept': 'application/json',
    'Content-Type':'application/json',
    };
    const forum_id={
        "ID":id,
    }
    const method = 'DELETE';
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(forum_id),
    }).then(function(){
        your_question();
    })
    }
}

// recalled by setting_info function 
// aim : update personal information
function update_01(){
    //console.log("xixi");
    const path='personal_info/happy';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
    };
    const forum_id={
        "ID":update_001.value,
        "Name":update_002.value,
        "Gender":update_003.value,
        "Birthday":update_004.value,
        "Email":update_005.value,
    }
    const method = 'PUT';
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(forum_id),
    })
    alert("Your information have been updated 😄")
}

// when user click comment button, this function recalled, comment area will appear
function comment_appear(PostID){

    //console.log(PostID);
    if (document.getElementById(`comment_${PostID}`).innerHTML !=''){
        document.getElementById(`comment_${PostID}`).innerHTML ='';
    }else{
    str=`<div class="comment_size_1"> <textarea class=comment_size_0 id=comment_0_${PostID} placeholder="You can comment here"></textarea><i class="fas fa-pencil-alt comment_sp" onclick="add_comment('${PostID}')"></i></div>`;
    document.getElementById(`comment_${PostID}`).innerHTML=str;

    const path = 'forum/person/all_class';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };

    const method = 'GET';
    api.makeAPIRequest(path,{
        method,headers,})
        .then(function(res){
            //console.log(res);
            aa=res["Forum"][PostID]["Comments"];
            for(var j=0;j<aa.length;j++){
                //console.log(aa);
                if (aa[j]["Commenter"].length !=0){
                    var c_0= `<div class=new_box_css_2 id=comment_box > ${aa[j]["Commenter"]} [${timestamp(aa[j]["Time"])}] &nbsp;:&nbsp;&nbsp;&nbsp;${aa[j]["Detail"]}\
                                &nbsp;&nbsp;&nbsp;<i class="far fa-smile" onclick="add_comment_vote([${aa[j]["ID"]},1])"></i>&nbsp;&nbsp; ${aa[j]["CommentVote_good"]}\
                                &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;<i class="far fa-frown" onclick="add_comment_vote([${aa[j]["ID"]},0])"></i>&nbsp;&nbsp;${aa[j]["CommentVote_bad"]}\
                                 </div> `
                    document.getElementById(`comment_${PostID}`).innerHTML+=c_0;
                }
            }
        })
    }
}

// aime: comment detail will be updated
function add_comment(PostID){
    //console.log(PostID);
    //console.log(document.getElementById(`comment_0_${PostID}`).value);

    const path='comment/comment';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'POST';
    
     const add_comment_detail={
        "Time":Math.round(new Date().getTime()/1000),
        "Post":PostID,
        "Details":document.getElementById(`comment_0_${PostID}`).value,
    }
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(add_comment_detail),})
    //window.location.reload();
    comment_appear(`${PostID}`);
    comment_appear(`${PostID}`);

    
}

// user can vote like on the comment they liked
function add_comment_vote(ok){
    console.log(ok);
    a=ok[0];
    b=ok[1];
    const path='CommentVotes/add';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'POST';
    const CommentVotes_detail={
        "Comment":a,
        "Flag":b,
    }
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(CommentVotes_detail),})
    //alert("Sucess");
    comment_appear(`${PostID}`);
    comment_appear(`${PostID}`);
}

// user can vote dislike on the comment they disliked
function add_comment_vote_2(ok){
    console.log(ok);
    a=ok[0];
    b=ok[1];
    const path='CommentVotes/add';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'POST';
    const CommentVotes_detail={
        "Comment":a,
        "Flag":b,
    }
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(CommentVotes_detail),})
    //alert("Sucess");
    your_question();

}

//aim: at seeting part, you can add course
function add_class_xixi(){
  var class_name=prompt("Which course do you want to add?    [Example : COMP9900] ","COMP9900");
  if (class_name!=null && class_name!="")
    {
        const path='CourseMembers/student';
        const headers={
            'Accept': 'application/json',
            'Content-Type':'application/json',
        };
        const method = 'GET';
        api.makeAPIRequest(path,{
            method,headers,
        }).then(function(res){
            if(res.indexOf(class_name)>-1){
                console.log("have");
                const path='CourseMembers/student';
                const headers={
                    'Accept': 'application/json',
                    'Content-Type':'application/json',
                    'Authorization':'Token '+author_JSON,
                };
                const C={
                    "Course":class_name,
                }
                const method = 'POST';
                api.makeAPIRequest(path,{
                    method,headers,
                    body:JSON.stringify(C),
                }).then(function(res){
                    alert("Your course information have been updated");
                    setting_info();
                })
            }else{
                alert("Please provide a valid course number");
            }
        })

    }
}

// aim: user can add upcoming information
function add_upcoming(){
    var up=prompt("What do you want me to remind you? ",'Ass1 has been released');
    if (up != null && up !=""){
        const path='upcoming/upcoming';
        const headers={
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization':'Token '+author_JSON,
        };
        const add_consultation_time={
            "Time":Math.round(new Date().getTime()/1000),
            "Details":up,
        };
        const method = 'POST';
        api.makeAPIRequest(path,{
            method,headers,
            body:JSON.stringify(add_consultation_time),
        }).then(function(){
            alert("This event has been added into your upcoming!");
            setting_info();
        })
    }
}

// aim: at seeting part, you can delete course
function delete_course(CourseID){
    var de=confirm(`Do you want to remove ${CourseID}?`);
    if (de==true){
        console.log(CourseID);
        const path='CourseMembers/student';
        const headers={
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization':'Token '+author_JSON,
        };
        const delete_course_now={
            "Course":CourseID,
        }
        const method = 'DELETE';
        api.makeAPIRequest(path,{
            method,headers,
            body:JSON.stringify(delete_course_now),
        }).then(function(){
            alert(`${CourseID} has been removed now!`);
            setting_info();
        })
    }
}

// aim: user can remove upcoming information
function delete_up(event){
    console.log(event);
    var de=confirm('Do you want to delete this event?');
    if (de==true){
        const path='upcoming/upcoming';
        const headers={
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization':'Token '+author_JSON,
        };
        const delete_upcoming_now={
            "event":event,
        }
        const method = 'DELETE';
        api.makeAPIRequest(path,{
            method,headers,
            body:JSON.stringify(delete_upcoming_now),
        }).then(function(){
            setting_info();
        })

    }
}

