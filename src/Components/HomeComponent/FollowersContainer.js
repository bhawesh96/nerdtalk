import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar';
import DropDownMenu from 'material-ui/DropDownMenu';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

import axios from 'axios'
import {hashHistory} from 'react-router'
import {firebaseDB} from '../../firebaseConfig'
import Snackbar from 'material-ui/Snackbar';
import {connect} from 'react-redux'

class FollowersContainer extends Component {
  constructor(props) {
    super(props)
    this.checkFollow = this.checkFollow.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.follow = this.follow.bind(this)
    this.state = { people: {}, follows: {}, snackbar: { open: false, message: "" } };
}
  
  checkFollow(user) {
    const {follows} = this.state
    for(var item in follows) {
      if(user.uid == follows[item])
        return false
    }
    return true
  }

  follow(lol) {
    var scope = this
    axios({
      method: 'patch',
      url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed/follow',
      headers: { 'Authorization': scope.props.userToken },
      params: { user1: scope.props.user.uid, mode1: 'user', user2: lol.uid, mode2: 'user' }
    })
    .then(function(resp) {
      console.log(resp)
      firebaseDB.ref('nerdtalkUsers/' + scope.props.user.uid + '/follows').push(lol.uid)
        .then(function() {
          console.log('added to firebase follows list');
          scope.setState({snackbar: {open: true, message: 'You followed ' + lol.displayName}})
        })
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  componentDidMount() {
    var scope = this
    firebaseDB.ref('nerdtalkUsers').on('value',
    function(snapshot) {
      const {people} = scope.state
      scope.setState({people: snapshot.val()})
      console.log(scope.state.people)
    })

    firebaseDB.ref('nerdtalkUsers/' + scope.props.user.uid + '/follows').on('value',
    function(snapshot) {
      const {follows} = scope.state
      scope.setState({follows: snapshot.val()})
      console.log(scope.state.follows)
    })
  }

  handleRequestClose = () => {
    this.setState({snackbar: {open:false, message: ""}});
  };
    
  render() {
    return (
        
        <div className='flex-row' style={{marginBottom: 10}}>
        <DropDownMenu style={{width: '50%'}}>
          <List>
          {this.state.people && Object.values(this.state.people).map(function(person, index) {
            if((person.uid != this.props.user.uid) && this.checkFollow(person))
              return (
                <ListItem
                  hoverColor={'#EEE'}
                  key={index}
                  primaryText={person.displayName}
                  leftIcon={<Avatar src={person.photoURL} />}
                  rightAvatar={<RaisedButton primary={true} label='follow' onClick={() => this.follow(person)}/>}
                />
              )
            }, this)
          }
          </List>
        </DropDownMenu>
        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
          style={{left: '14%'}}
        />
        </div>
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