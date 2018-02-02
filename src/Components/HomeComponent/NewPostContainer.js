import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import UploadPhotoIcon from 'material-ui/svg-icons/image/add-a-photo'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Snackbar from 'material-ui/Snackbar';

import FollowersContainer from './FollowersContainer'
import {firebaseStorage} from '../../firebaseConfig'
import axios from 'axios'
import {connect} from 'react-redux'

import {client} from '../../Services/StreamService'

class NewPostContainer extends Component {
  constructor(props) {
    super(props)
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.post = this.post.bind(this)
    this.mediaUpload = this.mediaUpload.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)

    this.state = {
      editorState: EditorState.createEmpty(),
      mediaFile: null,
      snackbar: {
        open: false,
        message: ""
      }
    };
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  };

  mediaUpload() {
    this.inputElement.click()
  }

  post() {
    this.setState({posting: true})
    var scope = this
    var html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    
    var ISOTime = (new Date()).toISOString().slice(0,-5);
    
    if(this.state.mediaFile) {
    firebaseStorage.ref(this.state.mediaType).child(this.props.user.uid + '/' + ISOTime).put(this.state.mediaFile)
    .then(function(snapshot) {
      console.log(snapshot)
        axios({
          method: 'post',
          url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
          headers: { 'Authorization': scope.props.userToken },
          params: { mode: 'user', user: scope.props.user.uid },
          data: JSON.stringify({
                "actor": scope.props.user.uid,
                "verb": "tweet",
                "object": "1",
                "time": ISOTime,
                "foreign_id": "wefwefewfw",
                "to":["notification:rakshit"],
                "content": html,
                "name": scope.props.user.displayName,
                "pp_url": scope.props.user.photoURL,
                "popularity": 0,
                "media_url": snapshot.downloadURL
          })
        })
        .then(function(resp) {
          console.log(resp)
          scope.setState({posting: false, mediaFile: null, snackbar: {open: true, message: 'Posted successfully on your timeline'}})
          const editorState = EditorState.push(scope.state.editorState, ContentState.createFromText(''));
          scope.setState({ editorState });
        })
        .catch(function(err) {
          console.log(err)
        })
    })
    .catch(function(error) {
      console.log(error)
    })
  }

  else {
    console.log('posting')
    console.log(ISOTime)
    axios({
          method: 'post',
          url: 'https://sq6ptonjpk.execute-api.ap-south-1.amazonaws.com/test/feed',
          headers: { 'Authorization': scope.props.userToken },
          params: { mode: 'user', user: scope.props.user.uid },
          data: JSON.stringify({
                "actor": scope.props.user.uid,
                "verb": "tweet",
                "object": "1",
                "time": ISOTime,
                "foreign_id": "wefwefewfw",
                "to":["notification:rakshit"],
                "content": html,
                "name": scope.props.user.displayName,
                "pp_url": scope.props.user.photoURL,
                "popularity": 0,
                "media_url": ""
          })
        })
        .then(function(resp) {
          console.log(resp)
          scope.setState({posting: false, mediaFile: null, snackbar: {open: true, message: 'Posted successfully on your timeline'}})
          const editorState = EditorState.push(scope.state.editorState, ContentState.createFromText(''));
          scope.setState({ editorState });
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  }

   handleRequestClose = () => {
    this.setState({snackbar: {open:false, message: ""}});
  };

  uploadFile(e) {
    var scope = this
    const file = e.target.files[0]
    this.setState({mediaFile: file, mediaType: file.type})
  }

  render() {
    return (
    <div>
      {this.props.user && <FollowersContainer />}

      <Card style={{marginBottom: 10, borderRadius: 0}}>
        
        <Editor
          toolbarClassName="toolbarClassName"
          wrapperClassName="rteWrapper"
          editorClassName="rteEditor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
              colorPicker: { className: 'hidden' },
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              embedded: { className: 'hidden' }
            }}
        />
        <CardActions>
          <RaisedButton backgroundColor={'#EEEEEE'} icon={<UploadPhotoIcon />} label={'Photo / Video'} onClick={this.mediaUpload} disabled={this.state.mediaFile} />

          <span style={{whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '30%', position: 'absolute', textOverflow: 'ellipsis', padding: 'inherit'}}>{this.state.mediaFile && this.state.mediaFile.name}</span>

          <input ref={input => this.inputElement = input} type="file" id="media-upload" onChange={this.uploadFile} className="hidden" accept="video/*,image/*"/>

          <RaisedButton style={{float: 'right'}} primary={true} label={this.state.posting ? 'Posting' : 'Post'} onClick={this.post} disabled={this.state.posting} />
        </CardActions>
      </Card>

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
  const {user, userToken} = state.userReducer
  return {
    user,
    userToken
  }
}

export default connect(mapStateToProps)(NewPostContainer);
