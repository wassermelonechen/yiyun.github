forum_related_course_1();

//forum_announcement_1: this function aimed to create tutor forum interface
// How: connect to api=> get the database => use innerHTML to create UI.
function forum_manager_tutor(){
    
    document.getElementById("container").innerHTML="";
    document.getElementById("container").classList="container_2";
    var str='<div class="forum_top" id = forum_top>Profile & Upcoming</div>'
    document.getElementById("container").innerHTML=str;

    var str='<div class="forum_top_2" id = forum_top_2 >~~~ This is your detailed information ~~~</div>'
    document.getElementById("container").innerHTML+=str;

    str = '<div class="tutor_management_2" id="tutor_management_id" > \
            <div class="file_upload_css" id="file_upload">\
            <div class="management_small_title">File Upload </div>\
            <form> <div>  <label for="file" >Choose files to upload </label> \
                            <input type="file" id="file" name="file" class="xixixi"  multiple> </div> \
                    <div class="preview"> <p>No files currently selected for upload</p> </div>\
                    <div> <button>Submit</button> </div>\
            </form>\
            </div>\
            <div class="annouce_css" id="annouce_tutor">\
            <div class="management_small_title">Announce </div>\
            </div>\
            </div> '
    x=document.getElementById("file");
    console.log(`x`);
    document.getElementById("container").innerHTML+=str;

    str_1 = '  <input class=input_course id=input_course placeholder = Course Code> </input>\
            <input class=input_course id=input_title placeholder = Title> </input>\
            <input class=input_course id=input_Detail placeholder = Detail> </input> <button class=input_course_2 id=input_updat onclick=upload_xx()>Publish </button>\  '
            
    document.getElementById("annouce_tutor").innerHTML+=str_1;
}

// upload_x: this function will supply for tutor to post consultations
// get value from ==> <consultation detail> ==>  send to backend
function upload_x(){
    
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
}

// upload_xx: this function will supply for tutor to post announcements
// fisrt: < Token, Announce detail> ==> backend
// second: backend updated & reload this page ==> make diff
function upload_xx(){
    const path='announcements/announcements_all';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization':'Token '+author_JSON,
    };
    const method = 'POST';
    const add_ann={
        "Course":document.getElementById("input_course").value,
        "Time":Math.round(new Date().getTime()/1000),
        "Title":document.getElementById("input_title").value,
        "Details":document.getElementById("input_Detail").value,
    }
    api.makeAPIRequest(path,{
        method,headers,
        body:JSON.stringify(add_ann),})
        .then(function(){
            alert("Success!");
            forum_manager_tutor();
        })
}

// function forum_announcement_1: aim to create ann for tutor vision
// the diff with student vision is "delete" function
function forum_announcement_1(){
    document.getElementById("container").classList="container_2";
    var str='<div class="forum_top" id = forum_top>Announcement</div>'
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
                        <div id=delete_ann class="delete_forum_me" ><i class="fas fa-trash-alt" onclick="delete_ann('${res["announcements"][j]["Title"]}')" ></i>  </div>\
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

 // function delete_ann is aimed to delete announce [tutor]
 // send info to backend
function delete_ann(Details){
    var ss=confirm("Do you want to remove this announcement ?");
    if (ss=true){
        const path='announcements/announcements_all';
        const headers={
            'Accept': 'application/json',
            'Content-Type':'application/json',
        };
        const method = 'DELETE';
        const Ann={
            "Title":Details,
        }
        api.makeAPIRequest(path,{
            method,headers,
            body:JSON.stringify(Ann),})
            .then(function(){
                console.log("Announcements has been updated");
                forum_announcement_1();
            })
    }
}

// function forum_consultation_1: aim to create consultation for tutor vision
// the diff with student vision is "delete" function
function forum_consultation_1(){
    document.getElementById("container").classList="container_2";
    var str='<div class="forum_top" id = forum_top>Consultation time</div>'
    document.getElementById("container").innerHTML=str;

    var str='<div class="forum_top_2" id = forum_top_2>~~~ You can update consultation time here ~~~</div>'
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
                    <div id=delete_con class="delete_forum_me" ><i class="fas fa-trash-alt" onclick="delete_con('${res["consultations"][j]["Details"]}')" ></i>  </div>\
                        <div class =forum_ann_box_title> ${res["consultations"][j]["Details"]}</div>`
                    document.getElementById(`forum_tag_box_2_${ii}`).innerHTML+=str;
                }
            }
        }
    })
}

// function delete_con aim to delete consultation
// this function is recalled by forum_consultation_1
 function delete_con(Details){
    const path='consultations/consultations_all';
    const headers={
        'Accept': 'application/json',
        'Content-Type':'application/json',
    };
    const x={
        "Details":Details,
    }
    console.log(typeof(Details));
    console.log(Details)
    const method = 'DELETE';
    api.makeAPIRequest(path,{
        method,headers,
    body:JSON.stringify(x),}).then(function(){
        alert("Success!");
        forum_consultation_1();
    })
}

// function new_box_4: create all posts in the tutor forum vision 
// for each post, it will have many parts. such as title,detail,time and so on.
// the diff with new_box[student vision] is "delete" function
function new_box_4(id,detail){
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
   var str_delete=`<div id=delete_forum_me class="delete_forum_me" ><i class="fas fa-trash-alt" onclick="delete_forum_2('${detail["PostID"]}')"></i>  </div>`;



    var str_7 = `<div class = forum_cv>${str_plus+str_8+str_9  }</div>`

    var str_2 = `<div id = forum_new_box_detail_${id} class="forum_new_box_detail">${str_delete+str_3+str_4+str_5+str_6+str_7+str_8_0}</div>`// 右半部分
    
    var str_0 = `<div id = new_box_${id} class="new_box_css">${str_1+str_2}</div>`
    document.getElementById("all_forum").innerHTML+=str_0;
}

// delete_forum_2 : send forum_id to backend ==> backend changed ==> refresh the page
function delete_forum_2(id){
    var r=confirm("Do you want to delete thiis post?");//window.confirm("Press a button");
    if (r==true)
    {
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
            location.reload();
        })
    }
}

// forum_related_course_1: tutor can get course information they choosed
function forum_related_course_1(){
    console.log("xixi");
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
            setCookie("CourseCode",res["Course"],30);
            for (var i=0;i<res["Course"].length;i++){
                str = `<a id = "class_${res["Course"][i]}" onclick ="forum_c('${res["Course"][i]}')">${res["Course"][i]}</a>`;
                document.getElementById("xixixi").innerHTML+=str;
            }
            for (var i=0;i<res["Forum"].length;i++){
                new_box_4(i,res["Forum"][i]);
            }
    })
}
