import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
// icons
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';

const PlaceOrder = ({
  order,
  actions
}) => {
  const icon = (order.type === 'buy') ? <AddCircleOutline /> : <RemoveCircleOutline />;
  return (
    <ListItem
      leftIcon={icon}
      primaryText={order.type}
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
