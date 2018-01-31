import stream
from respond import respond
import json


def post_feed(event):
	try:
		client = stream.connect('mwb8vtrjbmak', 'vqamq876cznxede4fvgpt247w82pwuxs3wwru8sku7nv9w8azp6ae5zn52cp6qz9',
		                        location='us-east')
		user_feed = client.feed(event['queryStringParameters']['mode'], event['queryStringParameters']['user'])
		body = json.loads(event['body'])
		activity_data = {
			"actor": body['actor'],
			"verb": body['verb'],
			"object": body['object'],
			"content": body['content'],
			"time": body['time'],
			"foreign_id": body['foreign_id'],
			"to": body['to'],
			"name": body['name'],
			"pp_url": body['pp_url'],
			"popularity": int(body['popularity']),
			"media_url": body["media_url"]
		}

		response = user_feed.add_activity(activity_data)['id']
		return respond(None, response)
	except Exception as err:
		return respond(err, None, 502)
