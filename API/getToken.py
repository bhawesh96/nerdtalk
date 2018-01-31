from respond import respond
import stream


def get_token(event):
	try:
		client = stream.connect('mwb8vtrjbmak', 'vqamq876cznxede4fvgpt247w82pwuxs3wwru8sku7nv9w8azp6ae5zn52cp6qz9',
								location='us-east')
		user_feed = client.feed(event['queryStringParameters']['mode'], event['queryStringParameters']['user'])
		return respond(None, user_feed.get_readonly_token(), None)
	except Exception as e:
		return respond(e, None, 502)
