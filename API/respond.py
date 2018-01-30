from datetime import datetime
import json


class JSONEncoder(json.JSONEncoder):
	def default(self, o):
		if isinstance(o, datetime):
			return o.isoformat()
		return super(JSONEncoder, self).default(o)


def respond(err, res=None, code=None):
	return {
		'statusCode': code if err else '200',
		'body': str(err.message) if err else json.dumps(res, cls=JSONEncoder),
		'headers': {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
	}
