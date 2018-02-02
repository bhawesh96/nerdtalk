import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CircularProgress from 'material-ui/CircularProgress'
import {hashHistory} from 'react-router'
import {firebaseAuth} from '../../firebaseConfig'
import {connect} from 'react-redux'
import axios from 'axios'
import {client} from '../../Services/StreamService' 

import CardComponent from './CardComponent'
import Parser from 'html-react-parser';

class NotificationsContainer extends Component {
  constructor(props) {
    super(props)
    this.fetch = this.fetch.bind(this)
    this.fetchTimeline = this.fetchTimeline.bind(this)
    
    this.state = { newsFeed: [] };
  }

  componentWillMount() {
    this.fetch(this.props.user.uid)
  }

  componentWillReceiveProps(nextProps) {
    var scope = this;
    if(nextProps.timeline)
      this.fetchTimeline()
  }

  fetch(user) {
    this.setState({fetching: true})
    var scope = this
    
    axios({ 
      method: 'get',
      url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
      headers: { 'Authorization': scope.props.userToken },
      params: { mode: 'user', user: scope.props.user.uid, limit: 100, offset: 0 },
    })
    .then(function(resp) {
        const {newsFeed} = scope.state
        scope.setState({newsFeed: resp.data.results, fetching: false})
        console.log(resp)
        scope.fetchx(scope.props.user.uid)
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  fetchx(user) {
    var scope = this
    function successCallback() {
        console.log('now listening to ' +  user + ' FEEDchanges in realtime');
    }

    function failCallback(data) {
        alert('something went wrong, check the console logs');
        console.log(data);
    }

    axios({
      method: 'get',
      url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed/token',
      headers: { 'Authorization': scope.props.userToken },
      params: { mode: 'user', user: user},
    })
    .then(function(resp) {
      var feedToken = resp.data;
      var realtime_user_feed = client.feed('user', user, feedToken)
      realtime_user_feed.subscribe((data) => {
        const {newsFeed} = scope.state
        var x = data.new[0]
        var i = 0;
        var push = true;
        if(x) {
          for(let news of newsFeed) {
            if(news.id == x.id){
              console.log('matching present hence not pushing')
              newsFeed[i] = x
              push = false;
              break;
            }
            i++;
          }
        }
        if(x && push)
        {
          console.log('pushing')
          newsFeed.push(x)
         
        }
        scope.setState({newsFeed})
        console.log(scope.state.newsFeed)
      })
        .then(successCallback, failCallback);
    })
    .catch(function(err) {
      console.log(err)
    })
  }


  fetchTimeline() {
    this.setState({newsFeed: [], fetching: true})
    var scope = this
    
    axios({
      method: 'get',
      url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
      headers: { 'Authorization': scope.props.userToken },
      params: { mode: 'user', user: scope.props.user.uid, limit: 100, offset: 0 },
    })
    .then(function(resp) {
        const {newsFeed} = scope.state
        scope.setState({newsFeed: resp.data.results, fetching: false})
        console.log(resp)
    })
    .catch(function(err) {
      console.log(err)
    })
  }



  render() {
    return (
      <div>
        
      {this.state.fetching && <CircularProgress size={60} thickness={7} style={{margin: 40, color: 'white'}} />}

      {this.state.newsFeed && Object.values(this.state.newsFeed).map(function(news, index) {
        if(this.props.timeline)
          if(news.actor == this.props.user.uid)
          return(
            <CardComponent news={news} timeline={this.props.timeline} userToken={this.props.userToken} user={this.props.user} content={Parser(news.content)} date={Date.parse(news.time)} key={index}/>
            )
          else
            return
        else if(news.actor != this.props.user.uid)
          return(
            <CardComponent news={news} timeline={this.props.timeline} userToken={this.props.userToken} user={this.props.user} content={Parser(news.content)} date={Date.parse(news.time)} key={index}/>
            )
          else
            return
          }, this)
      }

      </div>
    );
  }
}

function mapStateToProps(state) {
  const {user, feedToken, userToken, timeline} = state.userReducer
  return {
    user, feedToken, userToken, timeline
  }
}

export default connect(mapStateToProps)(NotificationsContainer);