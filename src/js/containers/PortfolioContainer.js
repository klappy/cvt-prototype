import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Pairs from '../components/Pairs';

class PortfolioContainer extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader
          title='Portfolio'
          subtitle='Portfolio'
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={false}>
          <Pairs portfolio={this.props.portfolio} />
        </CardText>
      </Card>
    );
  }
}

PortfolioContainer.propTypes = {
  portfolio: PropTypes.object.isRequired
};

export default PortfolioContainer;
