import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './js/containers/AppContainer';
import registerServiceWorker from './registerServiceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './js/reducers/index';

const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};

const store = createStore(reducer, persistedState, compose(applyMiddleware(thunk)));

store.subscribe(()=>{
  const state = store.getState();
  const {authentication, assetSettings, messages} = state;
  const reduxState = {authentication, assetSettings, messages};
  localStorage.setItem('reduxState', JSON.stringify(reduxState));
});

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
