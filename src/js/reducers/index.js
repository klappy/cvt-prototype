import { combineReducers } from 'redux';
import authentication from './authentication';
import balances from './balances';
import portfolio from './portfolio';
import ticker from './ticker';

const rootReducer = combineReducers({
  authentication,
  balances,
  portfolio,
  ticker
});

export default rootReducer;
