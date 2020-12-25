import React from 'react';
import PropTypes from 'prop-types';
import { PaginationPageModel } from 'shared/models/pagination-page-model';
import { PaginationItem } from './pagination-item';
import { PaginationPrev } from './pagination-prev';
import { PaginationNext } from './pagination-next';

export const Pagination = ({ currentPage, selectPage }) => {
  const paginationItems = [];
  const currentPageNumber = currentPage.currentPage;
  for (let i = 0; i < currentPage.totalPages; i++) {
    const pageNum = i + 1;
    paginationItems.push((
      <PaginationItem
        key={pageNum}
        selectPage={selectPage}
        ariaLabel={`Page ${pageNum}`}
        pageNumber={pageNum}
        isCurrentPage={pageNum === currentPageNumber}
      >
        {i + 1}
      </PaginationItem>
    ));
  }
  
  return (
    <section className="gallery-pagination-row">
      <nav>
        <div className="pagination">
          <PaginationPrev
            selectPage={selectPage}
            currentPageNumber={currentPageNumber}
            isHidden={currentPageNumber === 1}
          />
          {paginationItems}
          <PaginationNext
            selectPage={selectPage}
            currentPageNumber={currentPageNumber}
            isHidden={currentPageNumber === currentPage.totalPages}
          />
        </div>
      </nav>
    </section>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.instanceOf(PaginationPageModel).isRequired,
  selectPage: PropTypes.func.isRequired,
};
