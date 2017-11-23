import Exchanges from 'crypto-exchange';
import fs from 'fs-extra';

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
  const pair = getPair(asset, currency);
  return new Promise( resolve => {
    poloniex.ticker(pair).then(ticker => {
      resolve(ticker[pair]);
    });
  });
};

export const getPair = (asset, currency) => {
  return asset + '_' + currency;
};

export const getBuyPrice = (targetValue, assetBalance, percent) => {
  const targetPrice = getTargetPrice(targetValue, assetBalance);
  const targetBuyPrice = targetPrice - (targetPrice * percent);
  return targetBuyPrice;
};

export const getSellPrice = (targetValue, assetBalance, percent) => {
  const targetPrice = getTargetPrice(targetValue, assetBalance);
  const targetSellPrice = targetPrice + (targetPrice * percent);
  return targetSellPrice;
};

export const getTargetPrice = (targetValue, assetBalance) => {
  return targetValue/assetBalance;
};
