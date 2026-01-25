import type { PagedResult } from './page'

export interface Response<T> {
  page: PagedResult<T>
  correlationId?: string
}
