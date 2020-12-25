export interface IPaginationPageModel<T> {
  currentPage?:number;
  hasNextPage?:boolean;
  hasPreviousPage?:boolean;
  items?:T[];
  pageSize?:number;
  totalItems?:number;
  totalPages?:number;
}

export class PaginationPageModel<T> implements IPaginationPageModel<T> {
  constructor(init:IPaginationPageModel<T>) {
    const {
      currentPage,
      hasNextPage,
      hasPreviousPage,
      items,
      pageSize,
      totalItems,
      totalPages,
    } = init;

    this.currentPage = currentPage;
    this.hasNextPage = hasNextPage;
    this.hasPreviousPage = hasPreviousPage;
    this.items = items;
    this.pageSize = pageSize;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
  }

  currentPage:number;
  hasNextPage:boolean;
  hasPreviousPage:boolean;
  items:T[];
  pageSize:number;
  totalItems:number;
  totalPages:number;

  static buildPagination<T>(collection:T[], pageSize:number = 24) : PaginationPageModel<T>[] {
    if (pageSize <= 0) {
      throw new Error('Unable to build pagination.  Must supply positive integer.')
    }
    const pagination:PaginationPageModel<T>[] = [];
    const totalPages = Math.ceil(collection.length / pageSize);
    const totalItems = collection.length;

    for (let j = 0; j < totalPages; j++) {
      const pageNum = j + 1;
      pagination.push(new PaginationPageModel({
        currentPage: pageNum,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
        items: collection.slice(j*pageSize, pageNum*pageSize),
        pageSize,
        totalItems,
        totalPages,
      }))
    }

    return pagination.length > 0 ?
      pagination :
      getEmptyPagination(pageSize);
  }
}

function getEmptyPagination<T>(pageSize:number) : PaginationPageModel<T>[] {
  return [new PaginationPageModel<T>({
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 0
  })];
}
