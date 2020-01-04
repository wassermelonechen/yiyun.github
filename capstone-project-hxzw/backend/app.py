#!/usr/bin/env python3

import os, sys
from flask import Flask
from flask_restplus import Api
from flask_cors import CORS
from util.DB_Interface import DB

app = Flask(__name__)
CORS(app)

api = Api(app)
db = DB()

if 'HOST' in os.environ:
    print()
    print('***')
    print('*** cd to the frontend directory (probably cd ../frontend')
    print('*** then run the frontend server telling it the URL FOR the backend server like this:')
    print('*** python3 frontend_server.py http://{}:{}'.format(os.environ['HOST'], os.environ['PORT']))
    print('***')
    print()
    sys.stdout.flush()
