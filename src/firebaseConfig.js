import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAelsDpnxA1UmvbKVByqfFUYcfVBn7RIok",
    authDomain: "nerdtalk-e3941.firebaseapp.com",
    databaseURL: "https://nerdtalk-e3941.firebaseio.com",
    projectId: "nerdtalk-e3941",
    storageBucket: "nerdtalk-e3941.appspot.com",
    messagingSenderId: "211539605105"
  };
  
firebase.initializeApp(config);

export const firebaseDB = firebase.database();
export const firebaseAuth = firebase.auth();
export const GithubProvider = new firebase.auth.GithubAuthProvider();
export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseStorage = new firebase.storage();