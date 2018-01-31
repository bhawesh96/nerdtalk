import stream
from respond import respond


def get_feed(event):
	try:
		client = stream.connect('mwb8vtrjbmak', 'vqamq876cznxede4fvgpt247w82pwuxs3wwru8sku7nv9w8azp6ae5zn52cp6qz9',
								location='us-east')
		user_feed = client.feed(event['queryStringParameters']['mode'], event['queryStringParameters']['user'])

		feed = user_feed.get(limit=event['queryStringParameters']['limit'], offset=event['queryStringParameters']['offset'])
		return respond(None, feed)
	except Exception as err:
		return respond(err, None, 502)
