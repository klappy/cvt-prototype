import React from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
// components
import Message from 'material-ui/svg-icons/communication/message';

export default class Messages extends React.Component {
  state = {
    open: false,
    checked: []
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleDismiss = () => {
    this.props.actions.clearMessages();
    this.handleClose();
  };

  render() {
    const {messages} = this.props;

    const actionButtons = [
      <FlatButton
        key="dismiss"
        label="Dismiss All"
        primary={false}
        onClick={this.handleDismiss}
      />,
      <FlatButton
        key="close"
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    const messageListItems = messages.map((message, index) => (
      <div key={index}>
        <Divider />
        <ListItem
          primaryText={message.primaryText}
          secondaryText={message.secondaryText}
          secondaryTextLines={2}
        />
      </div>
    ));

    return (
      <div>
        <Badge
          badgeContent={messages.length}
          secondary={true}
          badgeStyle={{top: -3, right: -3}}
          style={{padding: 0}}
        >
          <IconButton>
            <Message color="white" onClick={this.handleOpen} />
          </IconButton>
        </Badge>
        <Dialog
          title="Messages"
          actions={actionButtons}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          contentStyle={{width: '100%', maxWidth: 'none'}}
          modal={false}
        >
          <List>
            {messageListItems}
          </List>
        </Dialog>
      </div>
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};
