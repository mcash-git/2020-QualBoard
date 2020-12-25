import React from 'react';
import PropTypes from 'prop-types';

const LoaderImg = ({ className }) => (
  <img
    alt=""
    src="/images/media-loader.svg"
    className={className}
  />
);

LoaderImg.propTypes = {
  className: PropTypes.string,
};

LoaderImg.defaultProps = {
  className: 'loader',
};

export default LoaderImg;
