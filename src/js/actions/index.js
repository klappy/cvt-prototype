import * as types from '../constants/ActionTypes';
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';
import * as PairHelpers from '../helpers/PairHelpers';

export const updateAuthentication = (key, secret) => ({ type: types.UPDATE_AUTHENTICATION, key, secret });
export const updateConstantValueTarget = (assetCode, targetValue) => ({ type: types.UPDATE_CONSTANT_VALUE_TARGET, assetCode, targetValue });

export const updateBalancesAndTicker = () => {
  return ((dispatch) => {
    dispatch(updateBalances());
    dispatch(updateTicker());
    dispatch(updatePortfolio());
  });
};

export const updateBalances = () => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.getBalances(state.authentication)
    .then(balances => {
      dispatch({ type: types.UPDATE_BALANCES, balances });
    });
  });
};

export const updateTicker = () => {
  return ((dispatch, getState) => {
    const state = getState();
    const currencyCode = 'BTC';
    const assetCodes = Object.keys(state.balances);
    const pairCodes = assetCodes.map(assetCode => PairHelpers.getPair(assetCode, currencyCode));
    ExchangeHelpers.getTicker(state.authentication, pairCodes)
    .then(ticker => {
      dispatch({ type: types.UPDATE_TICKER, ticker });
    });
  });
};

export const updatePortfolio = () => {
  return ((dispatch, getState) => {
    const state = getState();
    const {balances, ticker} = state;
    let tickers = ticker;
    const portfolio = {};
    const currencyCode = 'BTC';
    let currencyBalance;
    Object.keys(balances).forEach((assetCode) => {
      const balance = balances[assetCode];
      const pairCode = PairHelpers.getPair(assetCode, currencyCode);
      const ticker = tickers[pairCode] ? tickers[pairCode] : {};
      let value;
      if (assetCode === currencyCode) {
        currencyBalance = balance;
        value = balance;
      } else {
        value = tickers[pairCode].last * balance;
        value = value.toFixed(8);
      }
      const currency = {
        code: currencyCode,
        currencyBalance
      };
      const asset = {
        code: assetCode,
        balance,
        value
      };
      let config = {
        constantValueTarget: 0.01,
        spreadPercent: 1,
        feePercent: 0.25
      };
      switch (assetCode) {
        case 'ETH': {
          config.constantValueTarget = 0.02;
          break;
        }
        case 'XRP': {
          config.constantValueTarget = 0.005;
          break;
        }
        default: {
          config.constantValueTarget = 0.01;
        }
      }
      portfolio[pairCode] = {
        currency,
        asset,
        config,
        ticker,
        orders: {}
      };
    });
    dispatch({ type: types.UPDATE_PORTFOLIO, portfolio });
  });
};
