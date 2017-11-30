import { combineReducers } from 'redux';
import assetSettings from './assetSettings';
import authentication from './authentication';
import balances from './balances';
import tickers from './tickers';
import tradeHistories from './tradeHistories';
import openOrders from './openOrders';

const rootReducer = combineReducers({
  assetSettings,
  authentication,
  balances,
  tickers,
  tradeHistories,
  openOrders
});

export default rootReducer;
