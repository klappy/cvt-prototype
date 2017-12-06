import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
// icons
import AccessTime from 'material-ui/svg-icons/device/access-time';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';

const OpenOrders = ({
  orders,
  ...otherProps
}) => {

  const openOrdersListItems = orders.map((order, index) => (
    <ListItem key={index}
      leftIcon={(order.type === 'buy') ? <AddCircleOutline /> : <RemoveCircleOutline />}
      primaryText={order.type}
      secondaryText={
        <p>
          <strong>ID</strong>: {order.orderNumber},
          <strong> Amount</strong>: {order.amount.toFixed(8)}
          <br/>
          <strong>Rate</strong>: {order.rate.toFixed(8)},
          <strong> Total</strong>: {order.total.toFixed(8)}
        </p>
      }
      secondaryTextLines={2}
    />
  ));

  return (
    <ListItem
      {...otherProps}
      primaryText="Open Orders"
      leftIcon={<AccessTime />}
      primaryTogglesNestedList={true}
      nestedItems={openOrdersListItems}
      initiallyOpen={true}
    />
  );
};

OpenOrders.propTypes = {
  orders: PropTypes.array.isRequired
};

export default OpenOrders;
