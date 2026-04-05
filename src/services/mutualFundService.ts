import type { Scheme } from '@/types/scheme'
import type { PagedResult } from '@t/page'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Fetches a paginated list of mutual fund schemes based on search criteria.
 * * @param pageNumber - The requested page (usually 1-indexed)
 * @param pageSize - The number of items to return per page
 * @param searchText - Optional search string to filter funds
 * @returns A promise resolving to a paginated list of Scheme objects
 */
async function fetchFunds(
  pageNumber: number,
  pageSize: number,
  searchText?: string,
): Promise<PagedResult<Scheme>> {
  const baseUrl = API_BASE_URL.replace(/\/$/, '')
  const url = new URL(`${baseUrl}/MutualFund/schemes`)

  url.searchParams.append('pageNumber', pageNumber.toString())
  url.searchParams.append('pageSize', pageSize.toString())
  if (searchText && searchText.trim() !== '') {
    url.searchParams.append('searchText', searchText.trim())
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`API error [${res.status} ${res.statusText}]: ${errorText}`)
  }
  return res.json() as Promise<PagedResult<Scheme>>
}

export { fetchFunds }
