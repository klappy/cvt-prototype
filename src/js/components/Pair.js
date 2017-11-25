import React from 'react';
import PropTypes from 'prop-types';

const Pair = ({
  pair
}) => {
  return (
    <div style={{}}>
      {pair}
    </div>
  );
};

Pair.propTypes = {
  pair: PropTypes.string.isRequired
};

export default Pair;
