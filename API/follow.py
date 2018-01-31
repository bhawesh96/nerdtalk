from respond import respond
import stream


def follow(event):
	try:
		client = stream.connect('mwb8vtrjbmak', 'vqamq876cznxede4fvgpt247w82pwuxs3wwru8sku7nv9w8azp6ae5zn52cp6qz9',
	                        location='us-east')
		user_feed = client.feed(event['queryStringParameters']['mode1'], event['queryStringParameters']['user1'])
		user_feed.follow(event['queryStringParameters']['mode2'], event['queryStringParameters']['user2'])
		return respond(None, "Success")

	except Exception as e:
		return respond(e, None, 502)
