import { bindable, bindingMode } from 'aurelia-framework';

export class MediaPagination {
  static inject = [Element];

  constructor(element) {
    this.element = element;
  }

  @bindable({ defaultBindingMode: bindingMode.oneWay }) pageSummary;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) fnSelectPage;

  pageSummaryChanged({
    currentPage,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  }) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.hasPreviousPage = hasPreviousPage;
    this.hasNextPage = hasNextPage;

    this.pageNumbers = buildPageNumbers(totalPages);
  }

  selectPage(pageNumber) {
    if (this.fnSelectPage && typeof this.fnSelectPage === 'function') {
      this.fnSelectPage(pageNumber);
    } else {
      this.element.dispatchEvent(new CustomEvent('select-page', {
        bubbles: true,
        detail: { pageNumber },
      }));
    }
  }
}

function buildPageNumbers(total) {
  const pages = [];
  for (let i = 0; i < total; i++) {
    pages.push(i + 1);
  }
  return pages;
}
