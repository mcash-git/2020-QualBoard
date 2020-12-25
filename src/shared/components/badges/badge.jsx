import React from 'react';
import PropTypes from 'prop-types';
import 'modules/_badges.scss';

const Badge = ({
  badgeClass,
  number,
}) => (
  <div className={`badge ${badgeClass}`}>{number}</div>
);

Badge.propTypes = {
  badgeClass: PropTypes.string,
  number: PropTypes.number.isRequired,
};

Badge.defaultProps = {
  badgeClass: '',
};

export default Badge;
