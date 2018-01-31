import React,  {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import UpvoteIcon from 'material-ui/svg-icons/action/thumb-up'
import ShareIcon from 'material-ui/svg-icons/social/share'
import axios from 'axios'
import Parser from 'html-react-parser';

// import {client} from '../../Services/StreamService'

class CardComponent extends Component {
  constructor(props) {
    super(props)
    this.clickLike = this.clickLike.bind(this)
    this.clickShare = this.clickShare.bind(this)

    this.state = {
      date : (new Date(this.props.news.time)).toGMTString(),
    }
  }

  clickLike() {
    console.log('like')
    axios({
          method: 'post',
          url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
          headers: { 'Authorization': this.props.userToken },
          params: { mode: 'user', user: this.props.user.uid },
          data: JSON.stringify({
                "actor": this.props.news.actor,
                "verb": 'like',
                "object": this.props.news.object,
                "time": this.props.news.time,
                "foreign_id": this.props.news.foreign_id,
                "to": ["notification:" + this.props.news.actor],
                "content": this.props.news.content,
                "name": this.props.news.name,
                "pp_url": this.props.news.pp_url,
                "popularity": this.props.news.popularity + 1,
                "media_url": this.props.news.media_url
          })
        })
        .then(function(resp) {
          console.log(resp)
        })
        .catch(function(err) {
          console.log(err)
        })
  }

  clickShare() {
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
                "time": (new Date()).toISOString().slice(0,-5) + '.00+05:30',
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
          {/*<CardMedia
            overlay={<CardTitle title={this.props.title} subtitle="Post subtitle" />}
          >
            <img src="https://s.hswstatic.com/gif/fullmoon-sleep-1200x800.jpg" alt="" />
          </CardMedia>
          <CardTitle title="Card title" subtitle="Card subtitle" />*/}
          <CardText>
            {this.props.content}
          </CardText>
          {!this.props.timeline && <CardActions style={{backgroundColor: '#EEE', display: 'flex', justifyContent: 'space-between'}}>
            <RaisedButton icon={<UpvoteIcon/>} primary={false} label={this.props.news.popularity} onClick={this.clickLike}/>
            <RaisedButton icon={<ShareIcon/>} primary={true} onClick={this.clickShare} />
          </CardActions>}
        </Card>
      )
  }
}

export default CardComponent;
