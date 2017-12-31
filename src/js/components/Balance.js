import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import Receipt from 'material-ui/svg-icons/action/receipt';

const Balance = ({
  balance,
  ...otherProps
}) => {
  const primaryText = `Balance: Ƀ${balance.btcValue.toFixed(8)} | $${balance.usdtValue ? balance.usdtValue.toFixed(2): 0}`;
  return (
    <ListItem
      {...otherProps}
      primaryText={primaryText}
      secondaryText={
        <p>
          <strong>Available</strong>: {balance.available.toFixed(8)}
          <br/>
          <strong> Orders</strong>: {balance.onOrders.toFixed(8)}
        </p>
      }
      secondaryTextLines={2}
      leftIcon={<Receipt />}
    />
  );
};

Balance.propTypes = {
  balance: PropTypes.object.isRequired
};

export default Balance;
