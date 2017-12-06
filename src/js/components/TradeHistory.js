import React from 'react';
import PropTypes from 'prop-types';
import {ListItem} from 'material-ui/List';
// icons
import History from 'material-ui/svg-icons/action/history';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';

const OpenOrders = ({
  tradeHistory,
  ...otherProps
}) => {

  const tradeHistoryListItems = tradeHistory.map((trade, index) => (
    <ListItem key={index}
      leftIcon={(trade.type === 'buy') ? <AddCircleOutline /> : <RemoveCircleOutline />}
      primaryText={trade.type}
      secondaryText={
        <p>
          <strong>ID</strong>: {trade.tradeID},
          <strong> Amount</strong>: {trade.amount.toFixed(8)}
          <br/>
          <strong>Rate</strong>: {trade.rate.toFixed(8)},
          <strong> Total</strong>: {trade.total.toFixed(8)}
        </p>
      }
      secondaryTextLines={2}
    />
  ));

  return (
    <ListItem
      {...otherProps}
      primaryText="Trade History"
      leftIcon={<History />}
      primaryTogglesNestedList={true}
      nestedItems={tradeHistoryListItems}
      initiallyOpen={false}
    />
  );
};

OpenOrders.propTypes = {
  tradeHistory: PropTypes.array.isRequired
};

export default OpenOrders;
