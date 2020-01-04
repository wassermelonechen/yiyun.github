#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request


CommentVotes = api.namespace('CommentVotes', description='Authentication Services') 

@CommentVotes.route('/add',strict_slashes=False)
class CommentVotes(Resource):
    @CommentVotes.response(200, 'Success')
    @CommentVotes.response(400, 'Something Wrong')
    @CommentVotes.expect(auth_details,CommentVotes_detail)
    @CommentVotes.doc(description='''
        input: student-id(auth) + commentID
        output: success
    ''')
    def post(self):
        u = authorize(request) 
        t = request.json
        (Comment,Flag)=unpack(t,'Comment','Flag')
        if not request.json:
            abort(400, 'Malformed request')

        db.insert('COMMENTVOTES').with_values(
            Comment=Comment,
            User=u[0],
            Flag=Flag,
        ).execute()


