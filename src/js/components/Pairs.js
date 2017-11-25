import React from 'react';
import PropTypes from 'prop-types';
import Pair from './Pair';

const Pairs = ({
  pairs
}) => {
  const _pairs = pairs.map((pair) => {
    return (
      <Pair key={pair} pair={pair} />
    );
  });

  return (
    <div style={{}}>
      {_pairs}
    </div>
  );
};

Pairs.propTypes = {
  pairs: PropTypes.array.isRequired
};

export default Pairs;
