forum_related_course();
// this function is to create forums for student interface
// send auth to backend ==> return posts information
function forum_related_course(){
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
                new_box(i,res["Forum"][i]);
            }
            
    })
}