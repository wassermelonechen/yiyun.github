#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request


personal_info = api.namespace('personal_info', description='Authentication Services') 

@personal_info.route('/happy', strict_slashes=False)
class Personal(Resource):
    @personal_info.response(200, 'Success')
    @personal_info.response(400, 'Missing Username/Password')
    @personal_info.response(403, 'Invalid Username/Password')
    @personal_info.expect(auth_details)
    @personal_info.doc(description='''
        input: z-id
        output: detail
    ''')
    def get(self):            
        u = authorize(request);

        q = db.select_all("STUDENTS").where(Id=u[0]).execute()
        qq_students = [format_post_6(row) for row in q] 

        q_students_type=db.select_all("COURSEMEMBERS").where(Student=u[0]).execute()
        qq_students_type = [format_post_7(row) for row in q_students_type]
        
        q_students_upcoming = db.select_all("UPCOMING").where(Student=u[0]).execute()
        qq_students_upcoming =  [format_post_8(row) for row in q_students_upcoming]

        return {
            "Students":qq_students,
            "Students_type":qq_students_type,
            "Students_upcoming":qq_students_upcoming,
        }

    @personal_info.response(200, 'Success')
    @personal_info.response(400, 'Missing Username/Password')
    @personal_info.response(403, 'Invalid Username/Password')
    @personal_info.expect(person)
    @personal_info.doc(description='''
        input: z-id
        output: detail
    ''')
    def put(self):
        j=request.json
        (ID,Name,Gender,Birthday,Email,)=unpack(j,"ID","Name","Gender","Birthday","Email")

        updated = {}
        updated['Name']=Name
        updated['Gender']=Gender
        updated['Birthday']=Birthday
        updated['Email']=Email

   
        db.update('STUDENTS').set(**updated).where(ID=ID).execute()
        return {
            'message': 'success'
        }