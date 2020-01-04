import secrets
from app import db
from flask_restplus import Resource, abort, reqparse, fields

def gen_token(): 
    token = secrets.token_hex(32)
    while db.exists("USERS").where(Token=token):
        token = secrets.token_hex(32)
    return token


def unpack(j,*args,**kargs):
    r = [j.get(arg,None) for arg in args]
    if kargs.get("required",True):
        [abort(kargs.get("error",400)) for e in r if e == None]
    return r

def authorize(r):
    t = r.headers.get('Authorization',None)
    if not t:
        abort(403,'Unsupplied Authorization Token')
    try:
        t = t.split(" ")[1]
    except:
        print('11111')
        abort(403,'Invalid Authorization Token')
    #print(db.select_all("USERS").execute())
    #print(t)
    if not db.exists("USERS").where(Token=t):
        print('22222')
        abort(403,'Invalid Authorization Token')
    return db.select("USERS").where(Token=t).execute()

def text_list_to_set(raw,process_f=lambda x:x):
    if raw == None:
        return set()
    return set([process_f(x) for x in raw.split(",") if x != ''])

def set_to_text_list(l):
    return ",".join([str(x) for x in l])



def set_to_text_list_2(l):
    return [str(x[0]) for x in l]




def format_post(post):
    comments = []
    post = set_to_text_list(post)
    
    #print(text_list_to_set(post[0],process_f=lambda x:x))
    for PostID in text_list_to_set(post[2],process_f=lambda x:x):
        comment = db.select("COMMENTS").where(Post=PostID).execute()

        comments.append({
            "Time":comment[1],
            "Commenter":comment[3],
            "Details":comment[4]
        })
    
    return {
        "PostID":post[2],
        "PostDate":post[3],
        "CourseCode":post[4],
        "Poster":post[5],
        "Title":post[6],
        "Contents":post[7],
        "tag":post[8],
        "meta":{
            "NumberOfVotes":post[10],
            "NumberOfComments":post[11],
            "Comments":comments,  
            # "Comment_meta":???
            
        }
    }

def format_post_1(post):
    comments = []
    post = list(i for i in post)
    #print("+++++++++++++++++++"*10)   

    #print(post)
    #print(len(post))
    comment_detail = db.select_all("COMMENTS").where(Post=post[2]).execute()
    if len(comment_detail) > 0:
        for curr in comment_detail:
            curr = list(i for i in curr)
        #print(comment_detail)
            comment_vote_good = db.select_all("COMMENTVOTES").where(Comment=curr[0],Flag=1).execute()
            comment_vote_bad = db.select_all("COMMENTVOTES").where(Comment=curr[0],Flag=0).execute()
            comments.append({
                "ID":curr[0],
                "Time":curr[1],
                "Commenter":curr[3],
                "Detail":curr[4],
                "CommentVote_good":len(comment_vote_good),
                "CommentVote_bad":len(comment_vote_bad),
               
            })

    
    return {
        "PostID":post[2],
        "PostDate":post[3],
        "CourseCode":post[4],
        "Poster":post[5],
        "Poster_Nickname":post[9],
        "Title":post[6],
        "Contents":post[7],
        "tag":post[8],
        "NumberOfVotes":post[10],
        "NumberOfComments":post[11],
        "Comments":comments,
    }



    
def format_post_2(post):
    comments = []
    post = list(i for i in post)
    #print("+++++++++++++++++++"*10)   
    #print(post) 
    print(post[2])
    comment_detail = db.select_all("COMMENTS").where(Post=post[2]).execute()
    if len(comment_detail) != 0:
        comment_detail = list(i for i in comment_detail[0])
        print(comment_detail)
        comments.append({
            "ID":comment_detail[0],
            "Time":comment_detail[1],
            "Commenter":comment_detail[3],
            "Detail":comment_detail[4]
        })
    else:
        comments.append({})

    return {
        "PostID":post[2],
        "PostDate":post[3],
        "CourseCode":post[4],
        "Poster":post[5],
        "Title":post[6],
        "Contents":post[7],
        "tag":post[8],
        "meta":{
            "NumberOfVotes":post[10],
            "NumberOfComments":post[11],
            "Comments":comments,  
            # "Comment_meta":???
            
        }
    }

""" def format_post_9(post){

} """




def format_post_4(post):
    return{
        "ID":post[0],
        "Course":post[1],
        "Title":post[2],
        "Details":post[3],
        "Time":post[4],
    }

def format_post_5(post):
    return{
        "ID":post[0],
        "Course":post[1],
        "Details":post[2],
    }

def format_post_6(post):
    return{
        "ID":post[0],
        "Name":post[1],
        "Gender":post[2],
        "Birthday":post[3],
        "Email":post[4],
    }

def format_post_7(post):
    return{
        "Course":post[0],
        "Type":post[2],
    }

def format_post_8(post):
    return{
        "Time":post[2],
        "Detail":post[3],
    }

