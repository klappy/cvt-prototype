import React from 'react';
import PropTypes from 'prop-types';
import Asset from './Asset';

const Assets = ({
  assets
}) => {
  const _assets = assets.map((asset) => {
    return (
      <Asset key={asset.name} asset={asset} />
    );
  });

  return (
    <div style={{}}>
      {_assets}
    </div>
  );
};

Assets.propTypes = {
  assets: PropTypes.array.isRequired
};

export default Assets;
