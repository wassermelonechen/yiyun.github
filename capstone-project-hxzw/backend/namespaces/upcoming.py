#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request


upcoming = api.namespace('upcoming', description='Authentication Services') 

@upcoming.route('/upcoming',strict_slashes=False)
class Upcoming(Resource):
    @upcoming.response(200, 'Success')
    @upcoming.response(400, 'Something Wrong')
    @upcoming.expect(auth_details,add_consultation_time)
    @upcoming.doc(description='''
        input: student-id(auth)
        output: success
    ''')
    def post(self):
        u = authorize(request) 
        t = request.json
        (tt,dt)=unpack(t,'Time','Details')
        if not request.json:
            abort(400, 'Malformed request')
        print("**********"*10)
        db.insert('UPCOMING').with_values(
            Student=u[0],
            Time=tt,
            Details=dt,
        ).execute()

    @upcoming.response(200, 'Success')
    @upcoming.response(400, 'Something Wrong')
    @upcoming.expect(auth_details,delete_up)
    @upcoming.doc(description='''
        input: student-id(auth)
        output: success
    ''')
    def delete(self):
        u = authorize(request) 
        t = request.json
        (event,)=unpack(t,'event')
        if not request.json:
            abort(400, 'Malformed request')

        db.delete('UPCOMING').where(Details=event,Student=u[0]).execute()