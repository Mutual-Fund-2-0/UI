import { MutualFundScheme } from "./scheme"

export interface PagedResult {
  schemes: MutualFundScheme[]
  totalCount: number
  pageNumber: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
