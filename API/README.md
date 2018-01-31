# Serverless Architecture Model

Firebase(GCP) and AWS are currently the two biggest cloud platform available to any developer.
But both of them have their own individual disadvantages. For example, Firebase is very easy to use, but has sever feature and language constraints. On the other hand, AWS offers a lot of features, along with industry-tested reliability, but it takes a lot of work to setup an architecture and then integrate your code with it.
So we thought of combining both of those platforms and take the best of those.
### Features used
 - Firebase Authentication is used to authenticate new or existing users
 - AWS Lambdas are used to write the APIs that communicate with getsstream.io and return responses to the client
 - AWS API Gateway is used to provide a HTTP communication interface between the clients and AWS Lambda
 - Firebase realtime database is used to maintain a local copy of getstream.io data, thus allowing use of foreign IDs which leads to faster processing of activites on getstream.io
 - Firebase storage is used to store user media like images or videos that are uploaded as a part of posts.

### Logical Flow
 - Users sign up or login via GitHub or Google using  Firebase Authentication
 - Authentication token is obtained from Firebase, which is sent on every API call to AWS to verify it and then provide access to further API resources
 - The API has a root called /feed. All requests are received here via the API Gateway. Once a request is received and the token verified, different python functions are invoked based on the request specifications
 - The response from the API is sent back to client via the API Gateway, where the changes are reflected on the client side.

### Features and their API endpoints

| Feature | Path | Method | Headers | Query params | Request Body |
| ------- | ---- | ------ | ------- | ------------ | ------------ |
| New post | /feed | POST | Authorization | mode, user | actor, verb, object, foreign_id, time, to, content |
| Get post | /feed | GET | Authorization | mode, user, limit, offset | N.A. |
| Follow user | /feed/follow | PATCH | Authorization | user1, mode1, user2, mode2 | N.A. |


**NOTE:** The Like API calls the new post API twice. The first call adds an activity to the logged in user, thus notifying followers that the user has liked another user's post. The second call to new post is made with the same foreign id+time combination such that the popularity count is updated, instead of creating a new activity. The user whose post was liked then receives a notification. 
 
### API Gateway 
A lot of configuration has to be done in the API gateway for eash API that is exposed. It includes: 
 - Declaring path parameters
 - Declaring query parameters
 - Declaring headers
 - Declaring request bady
 - Adding validation models
 - Adding response models
 - Configuring Lambda integration
 - Managing CORS
 - Deployment stages

### Tools used in APIs
 - Firebase Admin SDK
```sh
$ pip install firebase-admin
```
 - Stream SDK
```sh
$ pip install stream-python
```

### Languages used
 - Python 2.7


