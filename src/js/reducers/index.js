import { combineReducers } from 'redux';
import assetSettings from './assetSettings';
import authentication from './authentication';
import balances from './balances';
import tickers from './tickers';

const rootReducer = combineReducers({
  assetSettings,
  authentication,
  balances,
  tickers
});

export default rootReducer;
