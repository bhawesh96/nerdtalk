import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import {hashHistory} from 'react-router'
import {firebaseAuth} from '../../firebaseConfig'

import {connect} from 'react-redux'

import axios from 'axios'
import {client} from '../../Services/StreamService' 

class FollowersContainer extends Component {
  constructor(props) {
    super(props)
    
    this.state = { people: [] };
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

export default connect(mapStateToProps)(FollowersContainer);