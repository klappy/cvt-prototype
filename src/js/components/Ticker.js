import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import Timeline from 'material-ui/svg-icons/action/timeline';

const Ticker = ({
  ticker,
  ...otherProps
}) => {
  const primaryText = ticker.lastUSD ? "Ticker: $" + ticker.lastUSD : "Ticker";
  return (
    <ListItem
      {...otherProps}
      primaryText={primaryText}
      secondaryText={
        <p>
          <strong>Last</strong>: {ticker.last.toFixed(8)},
          <strong> Change</strong>: {(ticker.percentChange*100).toFixed(2)}%
          <br/>
          <strong>Low</strong>: {ticker.lowestAsk.toFixed(8)},
          <strong> High</strong>: {ticker.highestBid.toFixed(8)}
        </p>
      }
      secondaryTextLines={2}
      leftIcon={<Timeline />}
    />
  );
};

Ticker.propTypes = {
  ticker: PropTypes.object.isRequired
};

export default Ticker;
