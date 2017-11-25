import React, { Component } from 'react';
import PairsContainer from './js/containers/PairsContainer';
import AssetsContainer from './js/containers/AssetsContainer';

import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CVT</h1>
        </header>
        <AssetsContainer />
        <PairsContainer />
      </div>
    );
  }
}

export default App;
