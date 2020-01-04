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

def text_list_to_set(raw,process_f=lambda x:x):
    if raw == None:
        return set()
    return set([process_f(x) for x in raw.split(",") if x != ''])

"""  def text_list_to_set_semicolon(raw,process_f=lambda x:x):
    if raw == None:
        return set()
    return set([process_f(x) for x in raw.split(";") if x != ''])    """

def format_post(forum):
    comments = []
    print(text_list_to_set(forum[8], process_f=lambda x:int(x)))
    for c_id in text_list_to_set(forum[8], process_f=lambda x:int(x)):   # post[8]: comments
        comment = db.select("COMMENTS").where(comment_id=c_id).execute()
        comments.append({
            "comment_id": comment[0],
            "student_id":  comment[1],
            "comment_vote":  list(text_list_to_set(comment[2],process_f=lambda x:x)),
            "comment_vote_bad": list(text_list_to_set(comment[3],process_f=lambda x:x)),
            "comment_time": comment[4],
            "comment": comment[5]
        })

    return {
        "forum_id": forum[0],
        "forum_title": forum[5],
        "forum_body": forum[6],
        "meta":{
            "forum_time": forum[1],
            "forum_vote": list(text_list_to_set(forum[2],process_f=lambda x:x)), # process_f=lambda x:int(x)
            "forum_student_id": forum[3],
            "forum_class": forum[4],
            "forum_tag": forum[7]
        },
        "comments": comments
    }


def authorize(r):
    t = r.headers.get('Authorization',None)
    if not t:
        abort(403,'Unsupplied Authorization Token')
    try:
        t = t.split(" ")[1]
    except:
        abort(403,'Invalid Authorization Token')
    if not db.exists("USERS").where(Token=t):
        abort(403,'Invalid Authorization Token')
    return db.select("USERS").where(Token=t).execute()

def set_to_text_list(l):
    return ",".join([str(x) for x in l])
