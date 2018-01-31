# -*- coding: utf-8 -*-

import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

from postFeed import post_feed
from respond import respond
from getFeed import get_feed
from getToken import get_token
from follow import follow


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
		return post_feed(event)

	elif event["httpMethod"] == "GET" and event["path"] == "/feed":
		return get_feed(event)

	elif event["httpMethod"] == "GET" and event["path"] == "/feed/token":
		return get_token(event)

	elif event["httpMethod"] == "PATCH" and event["path"] == '/feed/follow':
		return follow(event)
