import React from 'react';
import Pairs from '../components/Pairs';

class PairsContainer extends React.Component {
  state = { pairs: ["ETH_BTC"] };

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <p>Pairs</p>
        <Pairs pairs={this.state.pairs} />
      </div>
    );
  }
}

export default PairsContainer;
