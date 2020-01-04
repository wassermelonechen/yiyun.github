#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request


comment = api.namespace('comment', description='Authentication Services') 

@comment.route('/comment',strict_slashes=False)
class comment(Resource):
    @comment.response(200, 'Success')
    @comment.response(400, 'Something Wrong')
    @comment.expect(auth_details,add_comment_detail)
    @comment.doc(description='''
        input: student-id(auth) + comment info
        output: success
    ''')
    def post(self):
        u = authorize(request) 
        t = request.json
        (Time,Post,Details)=unpack(t,'Time','Post','Details')
        if not request.json:
            abort(400, 'Malformed request')
        print("**********"*10)

        db.insert('COMMENTS').with_values(
            Time=Time,
            Post=Post,
            Commenter=u[0],
            Details=Details,
        ).execute()


