/**
 * A generic wrapper for paginated API responses.
 * @template T - The type of the items in the paginated list.
 */

export interface PagedResult<T> {
  readonly items: T[]
  totalCount: number
  pageNumber: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
