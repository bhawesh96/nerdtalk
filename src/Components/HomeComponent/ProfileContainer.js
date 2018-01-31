import React, { Component } from 'react';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import {hashHistory} from 'react-router'
import {firebaseAuth} from '../../firebaseConfig'

import {connect} from 'react-redux'

class ProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.switch = this.switch.bind(this)
    this.logout = this.logout.bind(this)
  }

  logout() {
    firebaseAuth.signOut()
    .then(function(res) {
      console.log('signed out successfully')
    })
    .catch(function(err) {
      console.log('error')
    })
  }

  switch(bool) {
    let timeline = bool
    const {dispatch} = this.props
    dispatch({type: 'TIMELINE', timeline})
  }

  render() {
    return (
        <div>
          <img src={this.props.user && this.props.user.photoURL} style={{width: 7+'em', height: 7+'em', borderRadius: '50%'}}/>

          <h4>{this.props.user && this.props.user.displayName}</h4>
          <h5 style={{color: 'grey'}}>{this.props.user && this.props.user.email}</h5>

          <RaisedButton label='News Feed' primary={!this.props.timeline} style={{width: 120, margin: 2}} onClick={() => this.switch(false)} />
          <RaisedButton label='Timeline' primary={this.props.timeline} style={{width: 120, margin: 2}} onClick={() => this.switch(true)}/>
          
          <RaisedButton label='Logout' style={{width: 120, marginTop: 20}} onClick={this.logout}/>

          <span style={{margin: 10, borderBottom: '1px solid lightgrey', width: '100%'}}></span>
        </div>
    );
  }
}

function mapStateToProps(state) {
  const {user, timeline} = state.userReducer
  return {
    user, timeline
  }
}

export default connect(mapStateToProps)(ProfileContainer);