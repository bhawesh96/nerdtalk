import React,  {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar'
import UpvoteIcon from 'material-ui/svg-icons/action/thumb-up'
import ShareIcon from 'material-ui/svg-icons/social/share'
import axios from 'axios'
import Parser from 'html-react-parser';

import {firebaseDB} from '../../firebaseConfig'

class CardComponent extends Component {
  constructor(props) {
    super(props)
    this.clickLike = this.clickLike.bind(this)
    this.clickShare = this.clickShare.bind(this)
    this.checkLike = this.checkLike.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
  
    this.state = {
      date : (new Date(this.props.news.time)).toGMTString(),
      likes: {},
      snackbar: {
        open: false,
        message: ""
      }
    }
  }

  handleRequestClose = () => {
    this.setState({snackbar: {open:false, message: ""}});
  };

  checkLike(post) {
    const {likes} = this.state
    for(var item in likes) {
      if(post == likes[item])
        return true
    }
    return false
  }

  componentDidMount() {
    var scope = this
    firebaseDB.ref('nerdtalkUsers/' + scope.props.user.uid + '/likes').on('value',
    function(snapshot) {
      const {likes} = scope.state
      scope.setState({likes: snapshot.val()})
      console.log(snapshot.val())
    })
  }

  clickLike() {
    var scope = this
    console.log('like')
    axios({
          method: 'post',
          url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
          headers: { 'Authorization': this.props.userToken },
          params: { mode: 'user', user: this.props.user.uid },
          data: JSON.stringify({
                "actor": this.props.news.actor,
                "verb": 'tweet',
                "object": this.props.news.object,
                "time": this.props.news.time,
                "foreign_id": this.props.news.foreign_id,
                "to": [],
                "content": this.props.news.content,
                "name": this.props.news.name,
                "pp_url": this.props.news.pp_url,
                "popularity": this.props.news.popularity + 1,
                "media_url": this.props.news.media_url
          })
        })
        .then(function(resp) {
          console.log(resp)
          var ISOTime = (new Date()).toISOString().slice(0,-5);
          firebaseDB.ref('nerdtalkUsers/' + scope.props.user.uid + '/likes').push(resp.data)
            .then(function() {console.log('added to firebase LIKES list')
              axios({
              method: 'post',
              url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
              headers: { 'Authorization': scope.props.userToken },
              params: { mode: 'timeline', user: scope.props.user.uid },
              data: JSON.stringify({
                    "actor": scope.props.user.uid,
                    "verb": 'like',
                    "object": resp.data,
                    "time": ISOTime,
                    "foreign_id": ISOTime,
                    "to": ["notification:" + scope.props.news.actor],
                    "content": "",
                    "name": scope.props.user.displayName,
                    "pp_url": scope.props.user.photoURL,
                    "popularity": 0,
                    "media_url": ""
              })
            })
            .then(function(resp) {
              console.log(resp)
            })
            .catch(function(err) {
              console.log(err)
            })
            })
        })
        .catch(function(err) {
          console.log(err)
        })
    
  }

  clickShare() {
    var scope = this
    console.log('share')
    axios({
          method: 'post',
          url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
          headers: { 'Authorization': this.props.userToken },
          params: { mode: 'user', user: this.props.user.uid },
          data: JSON.stringify({
                "actor": this.props.user.uid,
                "verb": 'share',
                "object": this.props.news.object,
                "time": (new Date()).toISOString().slice(0,-5),
                "foreign_id": this.props.news.foreign_id,
                "to": ["notification:" + this.props.news.actor],
                "content": this.props.news.content,
                "name": this.props.user.displayName,
                "pp_url": this.props.user.photoURL,
                "popularity": this.props.news.popularity,
                "media_url": this.props.news.media_url
          })
        })
        .then(function(resp) {
          console.log(resp)
          scope.setState({snackbar: {open: true, message: 'Post has been shared on your timeline'}})
        })
        .catch(function(err) {
          console.log(err)
        })
  }

  render() {
    return (
        <Card style={{marginBottom: 10, borderRadius: 0}}>
          <CardHeader
            title={this.props.news.name}
            subtitle={this.props.news.time}
            avatar={this.props.news.pp_url}
            style={{backgroundColor: '#EEE'}}
          />
          {this.props.news.media_url &&
            <CardMedia style={{padding: 10, backgroundColor: '#D0D0D0'}}>
            {
              this.props.news.media_url.indexOf('video') > -1 ? 
              <video controls>
                <source src={this.props.news.media_url} type="video/mp4" />
              </video>
              :
              <img src={this.props.news.media_url} alt="Video is not supported on this browser" />
            }
            </CardMedia>
          }
          <CardText>
            {this.props.content}
          </CardText>
          <CardActions style={{backgroundColor: '#EEE', display: 'flex', justifyContent: 'space-between'}}>
            
            <RaisedButton icon={<UpvoteIcon/>} primary={this.checkLike(this.props.news.id)} label={this.props.news.popularity} onClick={this.clickLike} disabled={this.checkLike(this.props.news.id)}/>

            <RaisedButton icon={<ShareIcon/>} primary={true} onClick={this.clickShare} />
          </CardActions>
        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
          style={{left: '14%'}}
        />
        </Card>
      )
  }
}

export default CardComponent;
