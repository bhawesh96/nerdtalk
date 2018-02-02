import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import {hashHistory} from 'react-router'
import {firebaseAuth} from '../../firebaseConfig'
import Parser from 'html-react-parser'
import {connect} from 'react-redux'

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
      params: { mode: 'notification', user: scope.props.user.uid},
    })
    .then(function(resp) {
      var feedToken = resp.data;
      var notification_feed = client.feed('notification', scope.props.user.uid, feedToken)
      notification_feed.subscribe((data) => {
        const {people} = scope.state
        var x = data.new[0]
        people.push(x)
        scope.setState({people})
        console.log(data)
      })
        .then(successCallback, failCallback);
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  // style={{whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '30%', position: 'absolute', textOverflow: 'ellipsis', padding: 'inherit'}}

  render() {
    const Text = (props) => {
      return (
      <span style={{whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '50%', position: 'absolute', textOverflow: 'ellipsis', height: 30}}> {Parser(props.content)}</span>
      )
    }
    return (
      
        <List style={{width: '100%', height: 400, overflowY: 'scroll'}}>
          {this.state.people && Object.values(this.state.people.reverse()).map((person, index) => (
              <ListItem
                key={index}
                primaryText={<div><span>{person.name} {person.verb}d </span> your post - <Text content={person.content}/></div>}
                leftAvatar={<Avatar style={{marginTop: 10}} src={person.pp_url} />}
              />
            ))
          }

          { this.state.people.length < 1 && <div><img src="https://cdn.dribbble.com/users/111395/screenshots/2735335/empty_state_icons-22.png" style={{width: '100%', marginTop: 60}} /><p style={{width: '100%', textAlign: 'center'}}>No new notifications</p></div> }
          {/*<ListItem
           key={1}
           primaryText={<div><span>{person.name}</span><span>{person.verb}ed</span> your post <Text /></div>}
           leftAvatar={<Avatar src={this.props.user.photoURL} />} />*/}
          
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