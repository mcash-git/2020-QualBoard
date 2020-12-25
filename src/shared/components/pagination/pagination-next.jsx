import React from 'react';
import PropTypes from 'prop-types';
import { PaginationItem } from './pagination-item';

export const PaginationNext = ({
  selectPage,
  currentPageNumber,
  isHidden,
}) => (
  <PaginationItem
    selectPage={selectPage}
    ariaLabel="Next Page"
    pageNumber={currentPageNumber + 1}
    isCurrentPage={false}
    isHidden={isHidden}
  >
    <i className="icon-ion-ios-arrow-forward" />
  </PaginationItem>
);

PaginationNext.propTypes = {
  selectPage: PropTypes.func.isRequired,
  currentPageNumber: PropTypes.number.isRequired,
  isHidden: PropTypes.bool.isRequired,
};
