import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import Badge from 'material-ui/Badge';
// components
import Balance from './Balance';
import Ticker from './Ticker';
import OpenOrders from './OpenOrders';
import TradeHistory from './TradeHistory';
import AssetSettings from './AssetSettings';
import PlaceOrders from './PlaceOrders';
// icons
import * as AssetIcons from 'react-cryptocoins';
// helpers
import * as PairHelpers from '../helpers/PairHelpers';

const Asset = ({
  assetCode,
  minimumYield,
  currencyCode,
  settings,
  balance,
  ticker,
  tradeHistory,
  orders,
  portfolioPercentage,
  actions
}) => {
  const urgentOrder = PairHelpers.getUrgentOrder(assetCode, currencyCode, balance, ticker, tradeHistory, settings.target, minimumYield);

  let orderRecommendationStyle = {};
  if (urgentOrder.type === 'sell') orderRecommendationStyle.color = 'rgb(0, 188, 212)';
  if (urgentOrder.type === 'buy') orderRecommendationStyle.color = 'rgb(255, 64, 129)';

  const nestedItems = [
    <PlaceOrders key="placeOrders"
      assetCode={assetCode}
      minimumYield={minimumYield}
      currencyCode={currencyCode}
      balance={balance}
      ticker={ticker}
      tradeHistory={tradeHistory}
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

  const orderBuyCount = orders.filter((o) => (o.type === 'buy')).length;
  const orderSellCount = orders.filter((o) => (o.type === 'sell')).length;
  const historyBuyCount = tradeHistory.filter((o) => (o.type === 'buy')).length;
  const historySellCount = tradeHistory.filter((o) => (o.type === 'sell')).length;

  let assetIconCode;
  switch (assetCode) {
    case 'SC':
      assetIconCode = 'Sia';
      break;
    case 'NAV':
      assetIconCode = 'Nvc';
      break;
    case 'PASC':
      assetIconCode = 'Pivx';
      break;
    default:
      assetIconCode = assetCode[0].toUpperCase() + assetCode.substring(1).replace(/\d+$/, "").toLowerCase();
  }
  let AssetIcon = AssetIcons[assetIconCode];
  const assetIconColor = orderRecommendationStyle.color ? orderRecommendationStyle.color : 'rgb(117, 117, 117)';
  const assetIcon = (
    <Badge
      badgeContent={historySellCount}
      secondary={false}
      badgeStyle={{top: -15, right: 31, background: 'transparent'}}
      style={{padding: 0}}
    >
      <Badge
        badgeContent={orderSellCount}
        secondary={false}
        badgeStyle={{top: -15, right: -15, background: 'transparent'}}
        style={{padding: 0}}
      >
        <Badge
          badgeContent={historyBuyCount}
          secondary={false}
          badgeStyle={{top: 31, right: 31, background: 'transparent'}}
          style={{padding: 0}}
        >
          <Badge
            badgeContent={orderBuyCount}
            secondary={false}
            badgeStyle={{top: 31, right: -15, background: 'transparent'}}
            style={{padding: 0}}
          >
            <AssetIcon
              size={40}
              color={assetIconColor}
              onClick={(e) => {
                if (urgentOrder.type !== 'hold') {
                  actions.placeOrder(urgentOrder);
                }
                e.stopPropagation();
              }}
            />
          </Badge>
        </Badge>
      </Badge>
    </Badge>
  );

  let progressColor;
  let signal = '';
  if (balance.btcValue - settings.target < 0) {
    progressColor = 'rgb(255, 64, 129)';
    signal = '+';
  }
  if (balance.btcValue - settings.target > 0) {
    progressColor = 'rgb(0, 188, 212)';
    signal = '-';
  }

  let lastTrade = "over a month ago";
  if (tradeHistory.length > 0) {
    const lastTradeTime = tradeHistory[0].date;
    const timeZoneOffset = (new Date()).getTimezoneOffset();
    const lastTradeTimeOffset = moment(lastTradeTime).subtract(timeZoneOffset, 'minutes');
    lastTrade = moment(lastTradeTimeOffset).fromNow();
  }

  return (
    <div>
      <Divider />
      <ListItem
        leftAvatar={assetIcon}
        primaryText={
          <span>
            {assetCode} ({portfolioPercentage}%) {lastTrade}
            <LinearProgress size={22} thickness={2.5} mode="determinate" color={progressColor} value={urgentOrder.percentToTrade*100} />
          </span>
        }
        secondaryText={
          <p>
            <span style={orderRecommendationStyle}><strong>{urgentOrder.type}:</strong> {signal + urgentOrder.btcValue.toFixed(8)}</span>,
            <span> <strong> Yield: </strong>
              {urgentOrder.targetYield}%
            </span>
            <br />
            <strong>Value:</strong> Ƀ{balance.btcValue.toFixed(8)} |
             ${balance.usdtValue ? balance.usdtValue.toFixed(2): 0}
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
  minimumYield: PropTypes.number.isRequired,
  currencyCode: PropTypes.string.isRequired,
  balance: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  tradeHistory: PropTypes.array.isRequired,
  orders: PropTypes.array.isRequired,
  portfolioPercentage: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
};

export default Asset;
