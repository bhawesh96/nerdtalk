import React, { Component } from 'react';
import {hashHistory} from 'react-router'
import {firebaseAuth} from '../../firebaseConfig'
import {connect} from 'react-redux'

import axios from 'axios'

import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import NewsFeedComponent from './NewsFeedComponent'
import ProfileContainer from './ProfileContainer'
import NotificationsContainer from './NotificationsContainer'
import NewPostContainer from './NewPostContainer'


import RaisedButton from 'material-ui/RaisedButton'
import {client} from '../../Services/StreamService'

class HomeComponent extends Component {
  constructor(props) {
    super(props)
    this.follow = this.follow.bind(this)
  }

  componentWillMount() {
    var scope = this;
    firebaseAuth.onAuthStateChanged(function(user) {
        if(user) {
        user.getToken().then(function(userToken) {
        dispatch({type: 'TOKEN', userToken})
          axios({
            method: 'get',
            url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed/token',
            headers: { 'Authorization': userToken },
            params: { mode: 'user', user: scope.props.user.uid},
          })
          .then(function(resp) {
            var feedToken = resp.data;
            const {dispatch} = scope.props
            dispatch({type: 'FEED_TOKEN', feedToken})
            var user_feed = client.feed('user', scope.props.user.uid , feedToken);
            dispatch({type: 'USER_FEED', user_feed})
          })
          .catch(function(err) {
            // first time user
            console.log(err)
          })})
        const {dispatch} = scope.props
        dispatch({type: 'SUCCESS_LOGIN', user})
      }
      else
        hashHistory.push('/auth')
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props)
    console.log(nextProps)
  }

  follow() {
    var scope = this
    axios({
      method: 'patch',
      url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed/follow',
      headers: { 'Authorization': scope.props.userToken },
      params: { user1: scope.props.user.uid, mode1: 'user', user2: 'bBoPWEHS6UNbinCP6bkyZH1YXa32', mode2: 'user' }
    })
    .then(function(resp) {
      console.log(resp)
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  render() {
    return (
      <div className='flex-row' style={{margin: 1+"%", justifyContent: 'flex-start'}}>
        
        <div style={{width: '30%', position: 'fixed', left: 40}} className="mobile-hide">
          <Paper className="flex-col" zDepth={2} style={{minHeight: 210, borderRadius: 0, maxWidth: 20+'em', padding: 10, textAlign: 'center'}}>
              {this.props.user ? <ProfileContainer /> : <CircularProgress size={60} thickness={7} style={{marginTop: 40}}/>}
          </Paper>

          
        </div>

        <div className='feedContainer'>
          <NewPostContainer />

          {this.props.user && this.props.userToken && <NewsFeedComponent />}

        </div>

        <div style={{position: 'fixed'}} className="mobile-hide notificationsContainer">
            <Paper className="flex-col" zDepth={2} style={{height: 400, borderRadius: 0}}>
            {(this.props.user_feed && this.props.userToken) ? <NotificationsContainer /> : <CircularProgress size={60} thickness={7} style={{marginTop: 200}}/>}
            </Paper>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const {userToken, user_feed, user, feedToken} = state.userReducer
  return {
    userToken, user_feed, user, feedToken
  }
}

export default connect(mapStateToProps)(HomeComponent);
