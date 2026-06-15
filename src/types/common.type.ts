export type ApiStatus = 'success' | 'error'

export class AppResponseWrapper<T = unknown> {
  status: ApiStatus = 'success'
  message: string = ''
  data: T | null = null
}

export function createSuccessResponse<T>(
  message: string,
  data: T,
): AppResponseWrapper<T> {
  return { status: 'success', message, data }
}

export function createErrorResponse<T = unknown>(
  message: string,
): AppResponseWrapper<T> {
  return {
    status: 'error',
    message,
    data: null,
  }
}

export type PagedData<T> = {
  items: T[]
  pageInfo: {
    currentPage: number
    totalPage: number
    pageSize: number
    currentPageStart: number
    currentPageEnd: number
    totalCount: number
  }
}

export const getPageInfo = (
  pageNo: number,
  pageSize: number,
  totalCount: number,
): PagedData<unknown>['pageInfo'] => ({
  currentPage: pageNo,
  totalPage: Math.ceil(totalCount / pageSize),
  pageSize,
  currentPageStart: (pageNo - 1) * pageSize + 1,
  currentPageEnd: Math.min(pageNo * pageSize, totalCount),
  totalCount,
})

export type PaginationQuery = {
  pageNo: number
  pageSize: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const DEFAULT_PAGE_SIZE = 10

export const parsePaginationQuery = (searchParams: URLSearchParams): PaginationQuery => ({
  pageNo: Math.max(1, parseInt(searchParams.get('pageNo') ?? '1')),
  pageSize: Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE)))),
  search: searchParams.get('search') ?? undefined,
  sortBy: searchParams.get('sortBy') ?? undefined,
  sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') ?? 'desc',
})
