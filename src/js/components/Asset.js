import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
// components
import Balance from './Balance';
import Ticker from './Ticker';
import OpenOrders from './OpenOrders';
import TradeHistory from './TradeHistory';
import AssetSettings from './AssetSettings';
import PlaceOrders from './PlaceOrders';
// icons
import * as AssetIcons from 'react-cryptocoins';

const Asset = ({
  assetCode,
  currencyCode,
  settings,
  balance,
  ticker,
  tradeHistory,
  orders,
  actions
}) => {
  let signal = '';
  const targetDelta = balance.btcValue - settings.target;
  const targetBuyDelta = -settings.spread/2/100 * balance.btcValue;
  const targetSellDelta = settings.spread/2/100 * balance.btcValue;
  if (targetDelta >= targetSellDelta && Math.abs(targetDelta) >= 0.0001) signal = '-';
  if (targetDelta <= targetBuyDelta && Math.abs(targetDelta) >= 0.0001) signal = '+';

  let orderRecommendationStyle = {};
  let orderRecommendationVerb = 'Hold';
  if (signal === '-') {
    orderRecommendationStyle.color = 'rgb(0, 188, 212)';
    orderRecommendationVerb = 'Sell';
  }
  if (signal === '+') {
    orderRecommendationStyle.color = 'rgb(255, 64, 129)';
    orderRecommendationVerb = 'Buy';
  }

  const nestedItems = [
    <PlaceOrders key="placeOrders"
      assetCode={assetCode}
      currencyCode={currencyCode}
      balance={balance}
      ticker={ticker}
      settings={settings}
      actions={actions}
    />,
    <Divider key="divider0" inset={true} />,
    <Balance key="balance" balance={balance} />,
    <Divider key="divider1" inset={true} />,
    <Ticker key="ticker" ticker={ticker} />,
    <Divider key="divider2" inset={true} />,
    <OpenOrders key="orders" orders={orders} actions={actions} />,
    <Divider key="divider3" inset={true} />,
    <TradeHistory key="history" tradeHistory={tradeHistory} />,
    <Divider key="divider4" inset={true} />,
    <AssetSettings key="0" assetCode={assetCode} settings={settings} actions={actions}/>
  ];

  const percentToTrade = Math.abs(targetDelta)/0.0001*100;

  const AssetIcon = AssetIcons[assetCode[0].toUpperCase() + assetCode.substring(1).replace(/\d+$/, "").toLowerCase()];
  const assetIconColor = orderRecommendationStyle.color ? orderRecommendationStyle.color : 'rgb(117, 117, 117)';
  const assetIcon = (
    <Badge
      badgeContent={orders.length}
      secondary={true}
      badgeStyle={{top: 25, right: -10}}
      style={{padding: 0}}
    >
      <AssetIcon size={40} color={assetIconColor} />
    </Badge>
  );

  let progressColor;
  if (targetDelta < 0) progressColor = 'rgb(255, 64, 129)';
  if (targetDelta > 0) progressColor = 'rgb(0, 188, 212)';

  return (
    <div>
      <Divider />
      <ListItem
        leftAvatar={assetIcon}
        primaryText={
          <span>
            {assetCode}
            <LinearProgress size={22} thickness={2.5} mode="determinate" color={progressColor} value={percentToTrade} />
          </span>
        }
        secondaryText={
          <p>
            <span style={orderRecommendationStyle}><strong>{orderRecommendationVerb}:</strong> {signal + Math.abs(targetDelta).toFixed(8)}</span>
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
  currencyCode: PropTypes.string.isRequired,
  balance: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  tradeHistory: PropTypes.array.isRequired,
  orders: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default Asset;
