import plnx from 'plnx';
// import * as PairHelpers from './PairHelpers';

export const getBalances = (authentication) => {
  return new Promise( resolve => {
    let balances = {};
    plnx.returnBalances(authentication)
    .then(_balances => {
      Object.keys(_balances).forEach(asset => {
        const balance = parseFloat(_balances[asset]);
        if (balance > 0) balances[asset] = balance;
      });
      resolve(balances);
    })
    .catch(error => {
      console.warn(error);
    });
  });
};

export const getTicker = (authentication, pairs = []) => {
  return new Promise( resolve => {
    let ticker = {};
    plnx.returnTicker(authentication)
    .then(_ticker => {
      pairs.forEach(pair => {
        ticker[pair] = _ticker[pair];
      });
      resolve(ticker);
    })
    .catch(error => {
      console.warn(error);
    });
  });
};
