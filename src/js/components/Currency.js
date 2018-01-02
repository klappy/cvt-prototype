import React from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import Asset from './Asset';
import Balance from './Balance';
import * as AssetIcons from 'react-cryptocoins';
// helpers
import * as PairHelpers from '../helpers/PairHelpers';

const Currency = ({
  currencyCode,
  assetCodes,
  assetSettings,
  balances,
  tickers,
  tradeHistories,
  openOrders,
  actions
}) => {
  const assets = [];
  assets.push(<Balance balance={balances[currencyCode]} />);

  let totalBTCValue = balances[currencyCode].btcValue;

  const assetObjects = assetCodes.map((assetCode) => {
    totalBTCValue = totalBTCValue + balances[assetCode].btcValue;
    let asset;
    const pairCode = PairHelpers.getPair(assetCode, currencyCode);
    const balance = balances[assetCode];
    const ticker = tickers[pairCode];
    const settings = assetSettings[assetCode] ? assetSettings[assetCode] : assetSettings.default;
    const tradeHistory = tradeHistories[pairCode] ? tradeHistories[pairCode] : [];
    const orders = openOrders[pairCode] ? openOrders[pairCode] : [];

    asset = {
      assetCode,
      pairCode,
      currencyCode,
      settings,
      balance,
      ticker,
      tradeHistory,
      orders,
      actions
    };
    return asset;
  })
  .slice().sort((a,b) => {
    if (a.tradeHistory[0] && b.tradeHistory[0]) {
      return b.tradeHistory[0].date < a.tradeHistory[0].date ? -1 : 1;
    } else {
      return 0;
    }
  });

  assetObjects.forEach((asset) => {
    if (asset && asset.balance && asset.ticker) {
      const portfolioPercentage = (asset.balance.btcValue / totalBTCValue * 100).toFixed(1);
      assets.push(
        <Asset
          key={asset.assetCode}
          {...asset}
          portfolioPercentage={portfolioPercentage}
        />
      );
    }
  });

  let currencyUnicode;
  switch (currencyCode) {
    case 'BTC':
      currencyUnicode = 'Ƀ';
      break;
    case 'ETH':
      currencyUnicode = 'Ξ';
      break;
    case 'XMR':
      currencyUnicode = 'ɱ';
      break;
    default:
     currencyUnicode = '';
  }
  let subheader = <div/>;
  if (balances && tickers) {
    let currencyUsdtPairCode = PairHelpers.getPair(currencyCode, 'USDT');
    const usdtCurrencyTicker = tickers[currencyUsdtPairCode];
    let usdtCurrencyPrice = 0;
    if (usdtCurrencyTicker) {
      usdtCurrencyPrice = tickers[currencyUsdtPairCode].last;
    }
    let totalUSDValue;
    if (usdtCurrencyPrice) {
      totalUSDValue = totalBTCValue * usdtCurrencyPrice;
    }
    subheader = (
      <Subheader>
      <strong>Total: </strong>
      {currencyUnicode}{totalBTCValue.toFixed(4)}<strong>/</strong>${(totalUSDValue) ? totalUSDValue.toFixed(2): ''},
      <strong> USD/{currencyCode} Rate: </strong>
      ${usdtCurrencyPrice.toFixed(2)}
      </Subheader>
    );
  }

  const iconCode = currencyCode[0].toUpperCase() + currencyCode.substring(1).toLowerCase();
  const AssetIcon = AssetIcons[iconCode];

  const portfolioPercentage = (totalBTCValue > 0) ? (balances[currencyCode].btcValue / totalBTCValue * 100).toFixed(1) : 0;
  const primaryText = `${currencyCode} - ${portfolioPercentage}%`;

  return (
    <Paper>
      <List>
        {subheader}
        <ListItem
          primaryText={primaryText}
          leftAvatar={<AssetIcon size={40} />}
          initiallyOpen={true}
          primaryTogglesNestedList={true}
          nestedItems={assets}
        />
      </List>
    </Paper>
  );
};

Currency.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  assetCodes: PropTypes.array.isRequired,
  assetSettings: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  tickers: PropTypes.object.isRequired,
  tradeHistories: PropTypes.object.isRequired,
  openOrders: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default Currency;
