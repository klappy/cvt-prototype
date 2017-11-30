import * as types from '../constants/ActionTypes';
import * as ExchangeHelpers from '../helpers/ExchangeHelpers';
import * as PairHelpers from '../helpers/PairHelpers';

export const updateBalancesAndTicker = () => {
  return ((dispatch) => {
    dispatch(updateTickers());
    dispatch(updateBalances());
  });
};

export const updateAssetSettings = (assetCode, target, spread) => (
  { type: types.UPDATE_ASSET_SETTINGS, assetCode, target, spread }
);

export const updateAuthentication = (key, secret) => (
  { type: types.UPDATE_AUTHENTICATION, key, secret }
);

export const updateBalances = () => {
  return ((dispatch, getState) => {
    const state = getState();
    ExchangeHelpers.getCompleteBalances(state.authentication)
    .then(balances => {
      dispatch({ type: types.UPDATE_BALANCES, balances });
    });
  });
};

export const updateTickers = () => {
  return ((dispatch, getState) => {
    const state = getState();
    const currencyCode = 'BTC';
    const assetCodes = Object.keys(state.balances)
      .filter(pairCode => (pairCode !== 'BTC'));
    const pairCodes = assetCodes
      .map(assetCode => PairHelpers.getPair(assetCode, currencyCode));
    ExchangeHelpers.getTicker(state.authentication, pairCodes)
    .then(_tickers => {
      let tickers = {};
      Object.keys(_tickers).forEach(pairCode => {
        const _ticker = _tickers[pairCode];
        let ticker = {};
        Object.keys(_ticker).forEach(key => {
          ticker[key] = (_ticker[key]) ? parseFloat(_ticker[key]) : undefined;
        });
        tickers[pairCode] = ticker;
      });
      dispatch({ type: types.UPDATE_TICKERS, tickers });
    });
  });
};
