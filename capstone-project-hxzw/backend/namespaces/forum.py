#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request
from itertools import chain



forum = api.namespace('forum', description='Authentication Services') 

@forum.route('/person/all_class', strict_slashes=False)
class Forum_person(Resource):
    @forum.response(200, 'Success',post_details)
    @forum.response(400, 'Missing Username/Password')
    @forum.response(403, 'Invalid Username/Password')
    @forum.expect(auth_details)
    @forum.doc(description='''
        input: username,password
        output: all forums related to this student
    ''')
    def get(self):            
        u = authorize(request)

        q = db.select_all("POSTS").where(Student = u[0]).execute()
        classes = db.select_all("COURSEMEMBERS_COURSE").where(Student=u[0]).execute()
        qq = [format_post_1(row) for row in q] 
        
        return {
            "Forum":qq,
            "Course":list(chain(*classes)),
            "ID":u[0],
        }


    @forum.response(200, 'Success')
    @forum.response(400, 'Missing Something')
    @forum.expect(forum_id)
    @forum.doc(description='''
        input: username,password
        output: all forums related to this student
    ''')
    def delete(self):
        j=request.json
        (ID,)=unpack(j,"ID")
        db.delete("POSTS").where(ID=ID).execute()
        return("xixi")


    @forum.response(200, 'Success')
    @forum.response(400, 'Missing Username/Password')
    @forum.response(403, 'Invalid Username/Password')
    @forum.expect(auth_details,post_info_2)
    @forum.doc(description='''
        input: username,password
        output: all forums related to this student
    ''')
    def post(self):            
        u = authorize(request)

        j = request.json
        #print(j)
        (Time,Course,Title,Details,tag) = unpack(j,'Time','Course','Title','Details','tag')

        #print([Time,Course,Title,Details,tag,u[0]])
        db.insert("POSTS").with_values(Time=Time,Course=Course,Poster=u[0],Title=Title,Details=Details,tag=tag).execute()






@forum.route('/me', strict_slashes=False)
class Forum_person_me(Resource):
    @forum.response(200, 'Success')
    @forum.response(400, 'Missing Username/Password')
    @forum.response(403, 'Invalid Username/Password')
    @forum.expect(auth_details)
    @forum.doc(description='''
        input: username,password
        output: all forums related to this student
    ''')
    def get(self):            
        u = authorize(request)

        q = db.select_all("POSTS").where(Student = u[0],Poster=u[0]).execute()
        #q=db.select_all("POSTS_ME").where(Poster=u[0]).execute()
        
        qq = [format_post_1(row) for row in q] 
        return {
            "Forum":qq,
        }



@forum.route('/tag', strict_slashes=False)
class Forum_person_tag(Resource):
    @forum.response(200, 'Success')
    @forum.response(400, 'Missing Username/Password')
    @forum.response(403, 'Invalid Username/Password')
    @forum.expect(auth_details,tag_1)
    @forum.doc(description='''
        input: username,password
        output: all forums related to this student
    ''')
    def post(self):            
        u = authorize(request)
     
        if not request.json:
            abort(400, 'Malformed request')

        j = request.json
        (word_1,) = unpack(j,'word_1')
        print(word_1)
        print(type(word_1))
        #word = 'some'
        word_1 = '%'+word_1+'%'

        print(word_1)
        q = db.select_all("POSTS_2").where_2(Student=u[0],Title=word_1).execute()
        #q=db.select_all("POSTS_ME").where(Poster=u[0]).execute()
        
        qq = [format_post_1(row) for row in q] 
        return {
            "Forum":qq,
        }

@forum.route('/tag_2', strict_slashes=False)
class Forum_person_tag(Resource):
    @forum.response(200, 'Success')
    @forum.response(400, 'Missing Username/Password')
    @forum.response(403, 'Invalid Username/Password')
    @forum.expect(auth_details,tag_1)
    @forum.doc(description='''
        input: username,password
        output: all forums related to this student
    ''')
    def post(self):            
        u = authorize(request)
     
        if not request.json:
            abort(400, 'Malformed request')

        j = request.json
        (word_1,) = unpack(j,'word_1')
        word_1 = '%'+word_1+'%'

        q = db.select_all("POSTS_2").where_2(Student=u[0],Tag=word_1).execute()
        #q=db.select_all("POSTS_ME").where(Poster=u[0]).execute()
        
        qq = [format_post_1(row) for row in q] 
        return {
            "Forum":qq,
        }
        
@forum.route('/person/all_class/time', strict_slashes=False)
class Forum_person_time(Resource):
    @forum.response(200, 'Success',post_details)
    @forum.response(400, 'Missing Username/Password')
    @forum.response(403, 'Invalid Username/Password')
    @forum.expect(auth_details)
    @forum.doc(description='''
        input: username,password
        output: all forums related to this student
    ''')
    def get(self):            
        u = authorize(request)


        q = db.select_all("POSTS_TIME").where(Student = u[0]).execute()
        classes = db.select_all("COURSEMEMBERS_COURSE").where(Student=u[0]).execute()
        qq = [format_post_1(row) for row in q] 
        
        return {
            "Forum":qq,
            "Course":list(chain(*classes)),
        }


@forum.route('/PostVotes', strict_slashes=False)
class Forum_vote(Resource):
    @forum.response(200, 'Success')
    @forum.response(400, 'Something Wrong')
    @forum.expect(auth_details,post_info)

    @forum.doc(description='''
        input: Token + PostID
        return:sucess
    ''')
    def post(self):
        u = authorize(request)    
        if not request.json:
            abort(400, 'Malformed request')
        j = request.json
        (PostID,) = unpack(j,'PostID')
        print(PostID)
        print(u[0])
        print("**********"*10)

        db.insert('POSTVOTES').with_values(
            Post=PostID,
            User=u[0]
        ).execute()

        return {
            "Post" : PostID,
            "User":u[0]
        }


@forum.route('/Tags', strict_slashes=False)
class Forum_tags(Resource):
    @forum.response(200, 'Success')
    @forum.response(400, 'Something Wrong')
    @forum.expect(auth_details)

    @forum.doc(description='''
        input: Token + PostID
        return:sucess
    ''')
    def get(self):
        u = authorize(request)   



        all_info=db.select_all("POSTS_TIME").where(Student = u[0]).execute()
        print([item[8] for item in all_info])
        all_info=list(set([item[8] for item in all_info]))
     
        return {
            "Tag":all_info
        }



@forum.route('/Tags_s', strict_slashes=False)
class Forum_tags_s(Resource):
    @forum.response(200, 'Success')
    @forum.response(400, 'Something Wrong')
    @forum.expect(auth_details,Tag_s)

    @forum.doc(description='''
        input: Token + PostID
        return:sucess
    ''')
    def get(self):
        u = authorize(request)   
        print("************"*20)
        
        (Tag_id,)=unpack(Tage_s,'Tag_id')
        print(Tage_id)
        print("************"*20)
        
        tag_this=db.select_all("POSTS_TIME").where(Student = u[0],Tag=Tag_id).execute()
        print(tag_this)
        return({
            "Tag":tag_this,
        })

