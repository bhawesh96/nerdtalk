const initialState = {}

export function userReducer(state=initialState, action) {
	switch(action.type) {
		case "REQUEST LOGIN":
			return Object.assign({}, state, {
		        logging: true
      		})
		case "SUCCESS_LOGIN":
			return Object.assign({}, state, {
				logging: false,
				user: action.user
			})
		case "FAILURE_LOGIN":
			return Object.assign({}, state, {
			    logging: false
			})
		case "TOKEN":
			return Object.assign({}, state, {
			    userToken: action.userToken
			})
		case "FEED_TOKEN":
			return Object.assign({}, state, {
			    feedToken: action.feedToken
			})
		case "USER_FEED":
			return Object.assign({}, state, {
			    user_feed: action.user_feed
			})
		default:
			return state
	}
}