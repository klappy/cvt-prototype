import React, { Component } from 'react';
import PortfolioContainer from './js/containers/PortfolioContainer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="Constant Value Target Trading Strategy"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <PortfolioContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
