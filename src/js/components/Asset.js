import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import History from 'material-ui/svg-icons/action/history';
import Timeline from 'material-ui/svg-icons/action/timeline';
import * as AssetIcons from 'react-cryptocoins';

import AssetSettings from './AssetSettings';

const Asset = ({
  assetCode,
  settings,
  balance,
  ticker,
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

  const tradeHistory = [
    {type: "sell", rate: 0.02565498, amount: 0.10000000, total: 0.00256549},
    {type: "buy", rate: 0.02465499, amount: 0.10000000, total: 0.00246549}
  ];
  const tradeHistoryListItems = tradeHistory.map((trade, index) => (
    <ListItem key={index}
      primaryText={trade.type}
      secondaryText={
        <span><strong>Rate</strong>: {trade.rate}, <strong>Amount</strong>: {trade.amount}, <strong>Total</strong>: {trade.total}</span>
      }
    />
  ));

  const openOrders = [
    {orderNumber: "120466", type: "sell", rate: 0.025, amount: 100, total: 2.5},
    {orderNumber: "120467", type: "sell", rate: 0.04, amount: 100, total: 4}
  ];
  const openOrdersListItems = openOrders.map((order, index) => (
    <ListItem key={index}
      primaryText={order.type}
      secondaryText={
        <span><strong>Number</strong>: {order.orderNumber}, <strong>Rate</strong>: {order.rate}, <strong>Total</strong>: {order.total}</span>
      }
    />
  ));

  const nestedItems = [
    <ListItem key="balance"
      primaryText="Balance"
      secondaryText={
        <span>
          <strong>Available</strong>: {balance.available.toFixed(4)},
          <strong> On Orders</strong>: {balance.onOrders.toFixed(4)},
          <strong> BTC Value</strong>: {balance.btcValue.toFixed(4)}
        </span>
      }
      leftIcon={<CircularProgress size={22} thickness={2.5} mode="determinate" value={percentToTrade} />}
    />,
    <ListItem key="ticker"
    primaryText="Ticker"
    secondaryText={
      <span>
        <strong>Last</strong>: {ticker.last.toFixed(4)},
        <strong> Low</strong>: {ticker.lowestAsk.toFixed(4)},
        <strong> High</strong>: {ticker.highestBid.toFixed(4)},
        <strong> Change</strong>: {(ticker.percentChange*100).toFixed(4)}%
      </span>
    }
    leftIcon={<Timeline />}
    />,
    <ListItem key="open"
      primaryText="Open Orders"
      leftIcon={<AccessTime />}
      primaryTogglesNestedList={true}
      nestedItems={openOrdersListItems}
      initiallyOpen={false}
    />,
    <ListItem key="history"
      primaryText="Trade History"
      leftIcon={<History />}
      primaryTogglesNestedList={true}
      nestedItems={tradeHistoryListItems}
      initiallyOpen={false}
    />,
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
          <span style={orderRecommendationStyle}>
            <strong>{orderRecommendationVerb}</strong> {signal + Math.abs(targetDelta).toFixed(5)}
          </span>
        }
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
  actions: PropTypes.object.isRequired
};

export default Asset;
