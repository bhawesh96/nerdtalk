import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import {hashHistory} from 'react-router'
import {firebaseAuth} from '../../firebaseConfig'

import {connect} from 'react-redux'
import {tableData} from './data'

import axios from 'axios'
import {client} from '../../Services/StreamService' 

class NotificationsContainer extends Component {
  constructor(props) {
    super(props)
    
    this.state = { people: [] };
}

  componentDidMount() {
    var scope = this
    function successCallback() {
        console.log('now listening to changes in realtime');
    }

    function failCallback(data) {
        alert('something went wrong, check the console logs');
        console.log(data);
    }

    axios({
      method: 'get',
      url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed/token',
      headers: { 'Authorization': scope.props.userToken },
      params: { mode: 'notification', user: 'chris'},
    })
    .then(function(resp) {
      var feedToken = resp.data;
      var notification_feed = client.feed('notification', 'chris', feedToken)
      notification_feed.subscribe((data) => {
        const {people} = scope.state
        var x = data.new[0]
        people.push(x)
        scope.setState({people})
      })
        .then(successCallback, failCallback);
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  render() {
    return (
      
        <List style={{width: '100%', height: 400, overflowY: 'scroll'}}>
          {this.state.people && Object.values(this.state.people.reverse()).map((person, index) => (
              <ListItem
                key={index}
                primaryText={person.actor + ' ' + person.verb + 'ed ' + person.content}
              />
            ))
          }

          { this.state.people.length < 1 && <img src="https://cdn.dribbble.com/users/111395/screenshots/2735335/empty_state_icons-22.png" style={{width: '100%', marginTop: 60}} /> }

        </List>

    );
  }
}

function mapStateToProps(state) {
  const {user, feedToken, userToken} = state.userReducer
  return {
    user, feedToken, userToken
  }
}

export default connect(mapStateToProps)(NotificationsContainer);