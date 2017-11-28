import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './js/containers/AppContainer';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './js/reducers/index';

const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};

const store = createStore(reducer, persistedState);

store.subscribe(()=>{
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>, document.getElementById('root'));
registerServiceWorker();
