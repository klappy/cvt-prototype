import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
// icons
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import PauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline';

const PlaceOrder = ({
  order,
  actions
}) => {
  let icon = <PauseCircleOutline />;
  if (order.type === 'buy') icon = <AddCircleOutline color="rgb(255, 64, 129)" />;
  if (order.type === 'sell') icon = <RemoveCircleOutline color="rgb(0, 188, 212)" />;

  return (
    <ListItem
      leftIcon={icon}
      primaryText={order.type}
      disabled={order.type === 'hold'}
      secondaryText={
        <p>
          <strong>Amount</strong>: {order.amount.toFixed(8)},
          <strong> Rate</strong>: {order.rate.toFixed(8)}
          <br/>
          <strong> BTC Total</strong>: {order.btcValue.toFixed(8)}
        </p>
      }
      secondaryTextLines={2}
      onClick={() => {actions.placeOrder(order)}}
    />
  );
};

PlaceOrder.propTypes = {
  order: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default PlaceOrder;
