#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request

announcements = api.namespace('announcements', description='Authentication Services') 
@announcements.route('/announcements_all',strict_slashes=False)
class announcements(Resource):
    @announcements.response(200, 'Success')
    @announcements.response(400, 'Something Wrong')

    @announcements.doc(description='''
        input: username,password
        output: Announcements related this course
    ''')
    def get(self):
        
        q = db.select_all("ANNOUNCEMENTS").execute()
        #print(q)
        qq = [format_post_4(row) for row in q] 
        return {
            "announcements":qq
        }

    @announcements.response(200, 'Success')
    @announcements.response(400, 'Something Wrong')
    @announcements.expect(ann_de)
    @announcements.doc(description='''
        input: username,password
        output: Announcements related this course
    ''')
    def delete(self):
        t = request.json
        ff="please go to the webset to check the details"
        (a,)=unpack(t,'Title')
        print(a)

       
        db.delete("ANNOUNCEMENTS").where(Title=a).execute()

    @announcements.response(200, 'Success')
    @announcements.response(400, 'Something Wrong')
    @announcements.expect(ann_ad)
    @announcements.doc(description='''
        input: username,password
        output: Announcements related this course
    ''')
    def post(self):
        ux=request.json
        (Course,Details,Time,Title)=unpack(ux,'Course', 'Details','Time', 'Title' )
        print([Course,Details,Time,Title])
       
        db.insert("ANNOUNCEMENTS").with_values(Course=Course,Title=Title,Details=Details,Time=Time).execute()
