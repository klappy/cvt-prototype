import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
// icons
import AccessTime from 'material-ui/svg-icons/device/access-time';
import History from 'material-ui/svg-icons/action/history';
import Timeline from 'material-ui/svg-icons/action/timeline';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
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
  // console.log(assetCode, settings, balance, ticker)
  // const percentChange = ticker.percentChange ? (100 * parseFloat(ticker.percentChange)).toFixed(2) + '%' : '';
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

  const percentToTrade = Math.abs(targetDelta)/0.0001*100;

  const tradeHistoryListItems = tradeHistory.map((trade, index) => (
    <ListItem key={index}
      leftIcon={(trade.type === 'buy') ? <AddCircleOutline /> : <RemoveCircleOutline />}
      primaryText={trade.type}
      secondaryText={
        <p>
          <strong>ID</strong>: {trade.tradeID},
          <strong> Amount</strong>: {trade.amount.toFixed(5)}
          <br/>
          <strong>Rate</strong>: {trade.rate.toFixed(5)},
          <strong> Total</strong>: {trade.total.toFixed(5)}
        </p>
      }
      secondaryTextLines={2}
    />
  ));

  const openOrdersListItems = orders.map((order, index) => (
    <ListItem key={index}
      leftIcon={(order.type === 'buy') ? <AddCircleOutline /> : <RemoveCircleOutline />}
      primaryText={order.type}
      secondaryText={
        <p>
          <strong>ID</strong>: {order.orderNumber},
          <strong> Amount</strong>: {order.amount.toFixed(5)}
          <br/>
          <strong>Rate</strong>: {order.rate.toFixed(5)},
          <strong> Total</strong>: {order.total.toFixed(5)}
        </p>
      }
      secondaryTextLines={2}
    />
  ));

  const nestedItems = [
    <Divider key="divider0" inset={true} />,
    <ListItem key="balance"
      primaryText="Balance"
      secondaryText={
        <p>
          <strong>Available</strong>: {balance.available.toFixed(4)},
          <strong> On Orders</strong>: {balance.onOrders.toFixed(4)}
          <br/>
          <strong>BTC Value</strong>: {balance.btcValue.toFixed(4)}
        </p>
      }
      secondaryTextLines={2}
      leftIcon={<CircularProgress size={22} thickness={2.5} mode="determinate" value={percentToTrade} />}
    />,
    <Divider key="divider1" inset={true} />,
    <ListItem key="ticker"
      primaryText="Ticker"
      secondaryText={
        <p>
          <strong>Last</strong>: {ticker.last.toFixed(4)},
          <strong> Change</strong>: {(ticker.percentChange*100).toFixed(4)}%
          <br/>
          <strong>Low</strong>: {ticker.lowestAsk.toFixed(4)},
          <strong> High</strong>: {ticker.highestBid.toFixed(4)}
        </p>
      }
      secondaryTextLines={2}
      leftIcon={<Timeline />}
    />,
    <Divider key="divider2" inset={true} />,
    <ListItem key="open"
      primaryText="Open Orders"
      leftIcon={<AccessTime />}
      primaryTogglesNestedList={true}
      nestedItems={openOrdersListItems}
      initiallyOpen={true}
    />,
    <Divider key="divider3" inset={true} />,
    <ListItem key="history"
      primaryText="Trade History"
      leftIcon={<History />}
      primaryTogglesNestedList={true}
      nestedItems={tradeHistoryListItems}
      initiallyOpen={false}
    />,
    <Divider key="divider4" inset={true} />,
    <AssetSettings key="0" assetCode={assetCode} settings={settings} actions={actions}/>
  ];

  const AssetIcon = AssetIcons[assetCode[0].toUpperCase() + assetCode.substring(1).toLowerCase()];

  return (
    <div>
      <Divider />
      <ListItem
        leftAvatar={<AssetIcon size={40} color='rgb(117, 117, 117)' />}
        primaryText={assetCode}
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
