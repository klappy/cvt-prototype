import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class Authentication extends React.Component {
  state = {
    open: false,
    key: this.props.authentication.key,
    secret: this.props.authentication.secret
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  updateAuthentication = () => {
    this.props.actions.updateAuthentication(this.state.key, this.state.secret);
    this.handleClose();
  };

  updateKey = (event) => {
    const key = event.target.value;
    this.setState({key});
  };

  updateSecret = (event) => {
    const secret = event.target.value;
    this.setState({secret});
  };

  render() {
    const actions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        primary={false}
        onClick={this.handleClose}
      />,
      <FlatButton
        key="submit"
        label="Submit"
        primary={true}
        onClick={this.updateAuthentication}
      />
    ];

    return (
      <div>
        <RaisedButton label="Authentication" onClick={this.handleOpen} />
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            style={{width: '100%'}}
            hintText="Insert the Poloniex API Key"
            defaultValue={this.props.authentication.key}
            onBlur={this.updateKey}
          />
          <TextField
            style={{width: '100%'}}
            hintText="Insert the Poloniex API Secret"
            defaultValue={this.props.authentication.secret}
            onBlur={this.updateSecret}
          />
        </Dialog>
      </div>
    );
  }
}

Authentication.propTypes = {
  authentication: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};
