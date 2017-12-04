import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import VerifiedUser from 'material-ui/svg-icons/action/verified-user';

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
        <IconButton onClick={this.handleOpen}>
          <VerifiedUser color="white" />
        </IconButton>
        <Dialog
          title="Poloniex API"
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={{width: '100%', maxWidth: 'none'}}
          modal={false}
        >
          <TextField
            style={{width: '100%'}}
            hintText="Insert the Poloniex API Key"
            floatingLabelText="Key"
            defaultValue={this.props.authentication.key}
            onBlur={this.updateKey}
          />
          <TextField
            style={{width: '100%'}}
            hintText="Insert the Poloniex API Secret"
            floatingLabelText="Secret"
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
