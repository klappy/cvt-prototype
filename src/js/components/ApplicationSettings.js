import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';

export default class ApplicationSettings extends React.Component {
  state = {
    open: false,
    minimumYield: this.props.applicationSettings.minimumYield,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  updateApplicationSettings = () => {
    this.props.actions.updateApplicationSettings(this.state.minimumYield);
    this.handleClose();
  };

  updateMinimumYield = (event) => {
    const minimumYield = event.target.value;
    this.setState({minimumYield});
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
        onClick={this.updateApplicationSettings}
      />
    ];

    return (
      <div>
        <IconButton onClick={this.handleOpen}>
          <Menu color="white" />
        </IconButton>
        <Dialog
          title="Application Settings"
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={{width: '100%', maxWidth: 'none'}}
          modal={false}
        >
          <TextField
            style={{width: '100%'}}
            hintText="Insert the Minimum Target Yield"
            floatingLabelText="Minimum Yield"
            defaultValue={this.props.applicationSettings.minimumYield}
            onBlur={this.updateMinimumYield}
          />
        </Dialog>
      </div>
    );
  }
}

ApplicationSettings.propTypes = {
  applicationSettings: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};
