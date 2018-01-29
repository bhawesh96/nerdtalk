import json


def respond(err, res=None, code=None):
	return {
		'statusCode': code if err else '200',
		'body': str(err.message) if err else json.dumps(res),
		'headers': {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
	}
