#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request


CourseMembers = api.namespace('CourseMembers', description='Authentication Services') 

@CourseMembers.route('/student',strict_slashes=False)
class CourseMembers(Resource):
    @CourseMembers.response(200, 'Success')
    @CourseMembers.response(400, 'Something Wrong')
    @CourseMembers.expect(auth_details,CourseID)
    @CourseMembers.doc(description='''
        input: student-id(auth)
        output: success
    ''')
    def delete(self):
        
        u = authorize(request)
        #print(u)
        t = request.json
        (CourseID,)=unpack(t,'Course')
        #print(CourseID)
        if not request.json:
            abort(400, 'Malformed request')
        
        db.delete('COURSEMEMBERS').where(Course=CourseID,Student=u[0]).execute()


    @CourseMembers.response(200, 'Success')
    @CourseMembers.response(400, 'Something Wrong')
    @CourseMembers.expect(auth_details,CourseID)
    @CourseMembers.doc(description='''
        input: student-id(auth)
        output: success
    ''')
    def post(self):
        u = authorize(request)

        t = request.json
        (CourseID,)=unpack(t,'Course')

        print([CourseID,u[0],0])
        if not request.json:
            abort(400, 'Malformed request')
        db.insert('COURSEMEMBERS').with_values(Course=CourseID,Student=u[0],Type=0).execute()

    @CourseMembers.response(200, 'Success')
    @CourseMembers.response(400, 'Something Wrong')
    @CourseMembers.doc(description='''
        input: student-id(auth)
        output: success
    ''')
    def get(self):
        s=db.select_all("COURSEMEMBERS").where(Type=0).execute()
        s=list(set([i[0] for i in s ]))
        return s