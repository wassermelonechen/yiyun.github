#!/usr/bin/env python3

from app import api,db
from util.globals import *    
from util.models import *     
from flask_restplus import Resource, abort, reqparse, fields
from flask import request

auth = api.namespace('auth', description='Authentication Services') 

@auth.route('/login', strict_slashes=False)
class Login(Resource):
    @auth.response(200, 'Success',token_details)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(403, 'Invalid Username/Password')
    @auth.expect(login_details)
    @auth.doc(description='''
        This is used to authenticate a verified account created through signup.
        Returns a auth token which should be passed in subsequent calls to the api
        to verify the user.
    ''')
    def post(self):            
        if not request.json:
            abort(400,'Malformed Request')
        (un,pd) = unpack(request.json,'ID','Password')
        if not db.exists('USERS').where(ID=un,Password=pd):
            abort(403,'Invalid Username/Password')
        t = gen_token()   

        nickname = db.select('USERS').where(ID=un).execute()[1]
        db_r = db.update('USERS').set(Token=t).where(ID=un)
        db_r.execute()
        return {
            "Token" : t,
            "Nickname" : nickname
        }


@auth.route('/login_tutor', strict_slashes=False)
class Login_tutor(Resource):
    @auth.response(200, 'Success',token_details)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(403, 'Invalid Username/Password')
    @auth.response(408, 'Permission limited' )
    @auth.expect(login_details)
    @auth.doc(description='''
        This is used to authenticate a verified account created through signup.
        Returns a auth token which should be passed in subsequent calls to the api
        to verify the user.
    ''')
    def post(self):            
        if not request.json:
            abort(400,'Malformed Request')
        (un,pd) = unpack(request.json,'ID','Password')

        if not db.exists('USERS').where(ID=un,Password=pd):
            abort(403,'Invalid Username/Password')
        #if not db.exists('COURSEMEMBERS').where(Student=un,Type=1):    #tell me why ???
        #    abort(408, 'Permission limited' )
        if not db.select('COURSEMEMBERS').where(Student =un,Type=1).execute():
            abort(408, 'Permission limited' )
        t = gen_token()  
        nickname = db.select('USERS').where(ID=un).execute()[1]
        db_r = db.update('USERS').set(Token=t).where(ID=un)
        db_r.execute()
        return {
            "Token" : t,
            "Nickname" : nickname
        }

@auth.route('/signup', strict_slashes=False)
class Signup(Resource):
    @auth.response(200, 'Success',token_details)
    @auth.response(400, 'Malformed Request')
    @auth.response(409, 'student_id Taken')
    @auth.expect(signup_details)
    @auth.doc(description='''
        Use this endpoint to create a new account,
        username must be unique and password must be non empty
        After creation api retuns a auth token, same as /login would
    ''')
    def post(self):
        if not request.json:
            abort(400,'Malformed Request')
        (un,ps,nn) = unpack(request.json,'ID','Password','Nickname')
        if ps == '' or un == '' or nn == '':
            abort(400, 'Malformed Request')

        if db.exists('USERS').where(ID=un):
            abort(409, 'Student_id Taken')

        t = gen_token()
        db_r = db.insert('USERS').with_values(
            Token=t,
            ID=un,
            Password=ps,
            Nickname=nn,
        )
        db_r.execute()
        return {
            'Token': t,
            "Nickname" : nn
        }

@auth.route('/signup_tutor', strict_slashes=False)
class Signup_tutor(Resource):
    @auth.response(200, 'Success',token_details)
    @auth.response(400, 'Malformed Request')
    @auth.response(409, 'student_id Taken')
    @auth.expect(signup_details)
    @auth.doc(description='''
        Use this endpoint to create a new account,
        username must be unique and password must be non empty
        After creation api retuns a auth token, same as /login would
    ''')
    def post(self):
        if not request.json:
            abort(400,'Malformed Request')
        (un,ps,nn) = unpack(request.json,'ID','Password','Nickname')
        if ps == '' or un == '' or nn == '':
            abort(400, 'Malformed Request')
        if db.exists('USERS').where(ID=un):
            abort(409, 'Student_id Taken')
        if not db.select('COURSEMEMBERS').where(Student=un,Type=1).execute():
            abort(403,'Permission limited')

        t = gen_token()
        db_r = db.insert('USERS').with_values(
            Token=t,
            ID=un,
            Password=ps,
            Nickname=nn,
        )
        db_r.execute()
        return {
            'Token': t,
            "Nickname" : nn
        }