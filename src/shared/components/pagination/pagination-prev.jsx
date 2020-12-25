import React from 'react';
import PropTypes from 'prop-types';
import { PaginationItem } from './pagination-item';

export const PaginationPrev = ({
  selectPage,
  currentPageNumber,
  isHidden,
}) => (
  <PaginationItem
    selectPage={selectPage}
    ariaLabel="Previous Page"
    pageNumber={currentPageNumber - 1}
    isCurrentPage={false}
    isHidden={isHidden}
  >
    <i className="icon-ion-ios-arrow-back" />
  </PaginationItem>
);

PaginationPrev.propTypes = {
  selectPage: PropTypes.func.isRequired,
  currentPageNumber: PropTypes.number.isRequired,
  isHidden: PropTypes.bool.isRequired,
};
