import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux'

import FollowersContainer from '../HomeComponent/FollowersContainer'

import {firebaseAuth} from '../../firebaseConfig'


class AppBarComponent extends Component {
constructor(props){
  super(props)
  this.logout = this.logout.bind(this)
}
 
logout() {
  firebaseAuth.signOut()
  const {dispatch} = this.props
  dispatch({type: 'LOGOUT', })
}
  render() {
const Logged = () => (
  <IconMenu
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText="Sign out" onClick={() => this.logout()}/>
  </IconMenu>
);
    return (
      <div>
        {this.props.user && <AppBar
        	title={'NerdTalk'}
        	showMenuIconButton={false}
          iconElementRight={this.props.user && <Logged />}
          style={{position: 'fixed', marginTop: -14}}
        />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {user} = state.userReducer
  return {
    user
  }
}

export default connect(mapStateToProps)(AppBarComponent);
