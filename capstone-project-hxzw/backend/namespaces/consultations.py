#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request

consultations = api.namespace('consultations', description='Authentication Services') 
@consultations.route('/consultations_all',strict_slashes=False)
class consultations(Resource):
    @consultations.response(200, 'Success')
    @consultations.response(400, 'Something Wrong')

    @consultations.doc(description='''
        input: username,password
        output: consultations time related course
    ''')
    def get(self):
       
        q = db.select_all("CONSULTATIONS").execute()
        qq = [format_post_5(row) for row in q] 
        return {
            "consultations":qq
        } 


    @consultations.response(200, 'Success')
    @consultations.response(400, 'Something Wrong')
    @consultations.expect(de_con)
    @consultations.doc(description='''
        input: username,password
        output: consultations time related course
    ''')
    def delete(self):
       t=request.json
       (D)=unpack(t,"Details")
       print(D)

       db.delete("CONSULTATIONS").where(Details=D[0]).execute()



