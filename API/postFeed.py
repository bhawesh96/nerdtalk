import stream
from respond import respond


def postFeed(event):
	try:
		client = stream.connect('mwb8vtrjbmak', 'vqamq876cznxede4fvgpt247w82pwuxs3wwru8sku7nv9w8azp6ae5zn52cp6qz9',
		                        location='us-east')
		user_feed = client.feed(event["queryStringParameters"]["mode"], event["queryStringParameters"]["user"])
		activity_data = {
			"actor": event["body"]["actor"],
			"verb": event["body"]["verb"],
			"object": event["body"]["object"],
			"content": event["body"]["content"],
			"time": event["body"]["time"],
			"foreign_id": event["body"]["foreign_id"],
			"to": event["body"]["to"]
		}

		user_feed.add_activity(activity_data)
		return respond(None, "Success")
	except Exception as err:
		return respond(err, None, 502)
