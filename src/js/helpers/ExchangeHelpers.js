import Exchanges from 'crypto-exchange';
import fs from 'fs-extra';
import * as PairHelpers from './PairHelpers';

const auth = fs.readJSONSync('auth.json');
const poloniex = new Exchanges.poloniex(auth);

export const getBalances = (assets = []) => {
  return new Promise( resolve => {
    let _balances = {};
    poloniex.balances().then(balances => {
      assets.forEach(asset => {
        _balances[asset] = balances[asset];
      });
      resolve(_balances);
    });
  });
};

export const getTicker = (asset, currency) => {
  const pair = PairHelpers.getPair(asset, currency);
  return new Promise( resolve => {
    poloniex.ticker(pair).then(ticker => {
      resolve(ticker[pair]);
    });
  });
};
