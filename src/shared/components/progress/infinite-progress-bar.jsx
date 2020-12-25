
import React from 'react';
import PropTypes from 'prop-types';
import 'modules/_infinite-progress-bar.scss';

const InfiniteProgressBar = ({
  width,
  height,
  lineColor,
  fillColor,
}) => {
  const sliderStyle = {
    width,
    height,
  };

  const lineStyle = {
    background: lineColor,
    height,
  };

  const sublineStyle = {
    background: fillColor,
    height,
  };

  return (
    <div className="slider" style={sliderStyle}>
      <div className="line" style={lineStyle} />
      <div className="subline inc" style={sublineStyle} />
      <div className="subline dec" style={sublineStyle} />
    </div>
  );
};

InfiniteProgressBar.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  lineColor: PropTypes.string,
  fillColor: PropTypes.string,
};

InfiniteProgressBar.defaultProps = {
  lineColor: '#4a8df8',
  fillColor: '#4a8df8',
};

export default InfiniteProgressBar;
