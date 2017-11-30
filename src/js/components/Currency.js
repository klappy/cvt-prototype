import React from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import Asset from './Asset';
import * as AssetIcons from 'react-cryptocoins';
// helpers
import * as PairHelpers from '../helpers/PairHelpers';

const Currency = ({
  currencyCode,
  assetSettings,
  balances,
  tickers,
  tradeHistories,
  openOrders,
  actions
}) => {
  const assets = [];

  const balance = <ListItem key="balance"
    primaryText="Balance"
    secondaryText={
      <p>
        <strong>Available</strong>: {balances.BTC.available}
        <br/>
        <strong> On Orders</strong>: {balances.BTC.onOrders}
      </p>
    }
    secondaryTextLines={2}
  />;
  assets.push(balance);

  Object.keys(balances).forEach((assetCode, index) => {
    if (assetCode !== "BTC") {
      const pairCode = PairHelpers.getPair(assetCode, currencyCode);
      const balance = balances[assetCode];
      const ticker = tickers[pairCode];
      const settings = assetSettings[assetCode] ? assetSettings[assetCode] : assetSettings.default;
      const tradeHistory = tradeHistories[pairCode];
      const orders = openOrders[pairCode] ? openOrders[pairCode] : [];

      if (balance && ticker) {
        assets.push(
          <Asset key={index}
            assetCode={assetCode}
            settings={settings}
            balance={balance}
            ticker={ticker}
            tradeHistory={tradeHistory}
            orders={orders}
            actions={actions}
          />
        );
      }
    }
  });

  return (
    <Paper>
      <List>
        <Subheader>Portfolio</Subheader>
        <ListItem
          primaryText={currencyCode}
          leftAvatar={<AssetIcons.Btc size={40} />}
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
  assetSettings: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  tickers: PropTypes.object.isRequired,
  tradeHistories: PropTypes.object.isRequired,
  openOrders: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default Currency;
