export interface pagination {
    currentPage?: number;
    ItemsPerpage?: number;
    TotalItems?: number;
    TotalPages?: number;
}

export  class PaginationResult<T>{
result?: T | undefined ;
pagination?:pagination | string;
}