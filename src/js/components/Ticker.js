import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import Timeline from 'material-ui/svg-icons/action/timeline';

const Ticker = ({
  ticker,
  ...otherProps
}) => {

  return (
    <ListItem
      {...otherProps}
      primaryText="Ticker"
      secondaryText={
        <p>
          <strong>Last</strong>: {ticker.last.toFixed(6)},
          <strong> Change</strong>: {(ticker.percentChange*100).toFixed(4)}%
          <br/>
          <strong>Low</strong>: {ticker.lowestAsk.toFixed(6)},
          <strong> High</strong>: {ticker.highestBid.toFixed(6)}
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
