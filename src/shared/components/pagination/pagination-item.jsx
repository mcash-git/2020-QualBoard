import React from 'react';
import PropTypes from 'prop-types';

export const PaginationItem = ({
  selectPage,
  ariaLabel,
  pageNumber,
  isCurrentPage,
  isHidden,
  children,
}) => {
  const className = `${isCurrentPage ? 'active ' : ''}page-item`;
  const style = {
    visibility: isHidden ? 'hidden' : 'visible',
  };
  
  return (
    <div
      className={className}
      style={style}
    >
      <button
        className="page-link"
        aria-label={ariaLabel}
        onClick={() => selectPage(pageNumber)}
      >
        {children}
      </button>
    </div>
  );
};

PaginationItem.propTypes = {
  selectPage: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  isCurrentPage: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

PaginationItem.defaultProps = {
  isHidden: false,
};
