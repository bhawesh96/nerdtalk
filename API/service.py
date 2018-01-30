# -*- coding: utf-8 -*-

import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

from postFeed import postFeed
from respond import respond
from getFeed import getFeed
from getToken import getToken


def handler(event, context):
	try:
		cred = credentials.Certificate('./nerdtalk-e3941-firebase-adminsdk-alv5j-b4036dab58.json')
		firebase_admin.initialize_app(cred)
	except:
		firebase_admin.get_app()

	try:
		auth.verify_id_token(event['headers']['Authorization'])
	except Exception as ve:
		return respond(ve, None, 403)

	if event["httpMethod"] == "POST" and event["path"] == "/feed":
		return postFeed(event)

	elif event["httpMethod"] == "GET" and event["path"] == "/feed":
		return getFeed(event)

	elif event["httpMethod"] == "GET" and event["path"] == "/feed/token":
		return getToken(event)
