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
  actions
}) => {
  const assets = [];
  Object.keys(balances).forEach((assetCode, index) => {
    if (assetCode !== "BTC") {
      const pairCode = PairHelpers.getPair(assetCode, currencyCode);
      const balance = balances[assetCode];
      const ticker = tickers[pairCode];
      const settings = assetSettings[assetCode] ? assetSettings[assetCode] : assetSettings.default;
      if (balance && ticker) {
        assets.push(
          <Asset key={index} assetCode={assetCode} settings={settings} balance={balance} ticker={ticker} actions={actions} />
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
  actions: PropTypes.object.isRequired
};

export default Currency;
