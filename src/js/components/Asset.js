import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import Balance from './Balance';
import Ticker from './Ticker';
import OpenOrders from './OpenOrders';
import TradeHistory from './TradeHistory';
// icons
import * as AssetIcons from 'react-cryptocoins';

import AssetSettings from './AssetSettings';

const Asset = ({
  assetCode,
  settings,
  balance,
  ticker,
  tradeHistory,
  orders,
  actions
}) => {
  let signal = '';
  let targetDelta = balance.btcValue - settings.target;
  let targetBuyDelta = -settings.spread/2/100 * balance.btcValue;
  let targetSellDelta = settings.spread/2/100 * balance.btcValue;
  if (targetDelta >= targetSellDelta && Math.abs(targetDelta) >= 0.0001) signal = '-';
  if (targetDelta <= targetBuyDelta && Math.abs(targetDelta) >= 0.0001) signal = '+';

  let orderRecommendationStyle = {};
  let orderRecommendationVerb = 'Hold';
  if (signal === '-') {
    orderRecommendationStyle.color = 'green';
    orderRecommendationVerb = 'Sell';
  }
  if (signal === '+') {
    orderRecommendationStyle.color = 'red';
    orderRecommendationVerb = 'Buy';
  }

  const nestedItems = [
    <Divider key="divider0" inset={true} />,
    <Balance key="balance" balance={balance} />,
    <Divider key="divider1" inset={true} />,
    <Ticker key="ticker" ticker={ticker} />,
    <Divider key="divider2" inset={true} />,
    <OpenOrders key="orders" orders={orders} />,
    <Divider key="divider3" inset={true} />,
    <TradeHistory key="history" tradeHistory={tradeHistory} />,
    <Divider key="divider4" inset={true} />,
    <AssetSettings key="0" assetCode={assetCode} settings={settings} actions={actions}/>
  ];

  const percentToTrade = Math.abs(targetDelta)/0.0001*100;

  const AssetIcon = AssetIcons[assetCode[0].toUpperCase() + assetCode.substring(1).toLowerCase()];

  return (
    <div>
      <Divider />
      <ListItem
        leftAvatar={<AssetIcon size={40} color='rgb(117, 117, 117)' />}
        primaryText={
          <span>
            {assetCode}
            <LinearProgress size={22} thickness={2.5} mode="determinate" value={percentToTrade} />
          </span>
        }
        secondaryText={
          <p>
            <span style={orderRecommendationStyle}><strong>{orderRecommendationVerb}:</strong> {signal + Math.abs(targetDelta).toFixed(5)}</span>
            <br />
            <strong>BTC Value:</strong> {balance.btcValue}
          </p>
        }
        secondaryTextLines={2}
        primaryTogglesNestedList={true}
        nestedItems={nestedItems}
        initiallyOpen={false}
      />
    </div>
  );
};

Asset.propTypes = {
  assetCode: PropTypes.string.isRequired,
  balance: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  tradeHistory: PropTypes.array.isRequired,
  orders: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default Asset;
