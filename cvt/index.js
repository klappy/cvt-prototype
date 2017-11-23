import Exchanges from 'crypto-exchange';
import fs from 'fs-extra';

const auth = fs.readJSONSync('auth.json');
const poloniex = new Exchanges.poloniex(auth);

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

export const getAssetValues = (asset, currency) => {
  return new Promise(resolve => {
    getBalance(asset)
    .then(balance => {
      getTicker(asset, currency)
      .then(ticker => {
        let values = {};
        Object.keys(ticker).forEach(key => {
          if (key !== 'volume' && key !== 'timestamp') {
            values[key] = ticker[key] * balance.balance;
          }
        });
        resolve(values);
      });
    });
  });
};

export const getBalance = (asset) => {
  return new Promise( resolve => {
    poloniex.balances().then(balance => {
      resolve(balance[asset]);
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
