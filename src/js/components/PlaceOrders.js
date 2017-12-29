import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import {ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
// icons
import AttachMoney from 'material-ui/svg-icons/editor/attach-money';
import Repeat from 'material-ui/svg-icons/av/repeat';
// helpers
import * as PairHelpers from '../helpers/PairHelpers';
// components
import PlaceOrder from './PlaceOrder';

export default class PlaceOrders extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  replacePairOrders = (orders) => {
    const pairCode = PairHelpers.getPair(this.props.assetCode, this.props.currencyCode);
    this.props.actions.replacePairOrders(pairCode, orders);
  };

  render() {
    const {assetCode, currencyCode, balance, ticker, tradeHistory, settings, ...otherProps} = this.props;

    const buyOrder = PairHelpers.getTargetBuyOrder(assetCode, currencyCode, balance, ticker, tradeHistory, settings);
    const sellOrder = PairHelpers.getTargetSellOrder(assetCode, currencyCode, balance, ticker, tradeHistory, settings);

    const actionButtons = [
      <FlatButton
        key="close"
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <ListItem
          {...otherProps}
          leftIcon={<AttachMoney />}
          primaryText="Place Orders"
          onClick={this.handleOpen}
          rightIconButton={
            <IconButton>
              <Repeat
                onClick={() => {
                  this.replacePairOrders([sellOrder, buyOrder]);
                }}
              />
            </IconButton>
          }
        />
        <Dialog
          title="Place Orders"
          actions={actionButtons}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={{width: '100%', maxWidth: 'none'}}
          modal={false}
          autoScrollBodyContent={true}
        >
          <Divider />
          <Subheader>Place a Sell Order for when the price goes higher.</Subheader>
          <PlaceOrder actions={this.props.actions} key="sell" order={sellOrder} />
          <Divider />
          <Subheader>Place a Buy Order for when the price goes lower.</Subheader>
          <PlaceOrder actions={this.props.actions} key="buy" order={buyOrder} />
        </Dialog>
      </div>
    );
  }
}

PlaceOrders.propTypes = {
  assetCode: PropTypes.string.isRequired,
  currencyCode: PropTypes.string.isRequired,
  balance: PropTypes.object.isRequired,
  ticker: PropTypes.object.isRequired,
  tradeHistory: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};
