import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
import Receipt from 'material-ui/svg-icons/action/receipt';

const Balance = ({
  balance,
  ...otherProps
}) => {

  return (
    <ListItem
      {...otherProps}
      primaryText="Balance"
      secondaryText={
        <p>
          <strong>Available</strong>: {balance.available.toFixed(2)},
          <strong> Orders</strong>: {balance.onOrders.toFixed(8)}
          <br/>
          <strong>BTC Value</strong>: {balance.btcValue.toFixed(8)}
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
