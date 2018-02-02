import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css'


import AppBarComponent from './Components/AppBarComponent/AppBarComponent'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider >
        <div >

        <AppBarComponent />
          {this.props.children}

        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
