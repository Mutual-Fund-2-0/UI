import type { PagedResult } from '@t/page'
import type { Scheme } from '@/types/scheme'
import { fetchFunds } from '@s/mutualFundService'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const mockPagedResult: PagedResult<Scheme> = {
  items: [
    {
      code: 0,
      name: 'Test Scheme',
      house: 'Test House',
      category: 'Equity',
      subCategory: 'Large Cap',
      plan: 'Growth',
      type: 'Open Ended',
    },
  ],
  totalCount: 100,
  pageNumber: 1,
  totalPages: 10,
  hasNextPage: true,
  hasPreviousPage: false,
}

describe('API: fetchFunds', () => {
  beforeEach(() => vi.clearAllMocks())

  it('FetchFunds: 200 - Default pagination', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPagedResult
    } as Response)

    const result = await fetchFunds(1, 10)
    
    expect(result).toEqual(mockPagedResult)
    
    const fetchedUrl = vi.mocked(global.fetch).mock.calls[0][0] as URL
    expect(fetchedUrl.toString()).toContain('pageNumber=1')
    expect(fetchedUrl.toString()).toContain('pageSize=10')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'application/json' }
      })
    )
  })

  it('FetchFunds: 200 - With search text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPagedResult
    } as Response)

    await fetchFunds(2, 20, 'Equity')

    const fetchedUrl = vi.mocked(global.fetch).mock.calls[0][0] as URL
    expect(fetchedUrl.toString()).toContain('pageNumber=2')
    expect(fetchedUrl.toString()).toContain('pageSize=20')
    expect(fetchedUrl.toString()).toContain('searchText=Equity')
  })

  it('FetchFunds: 200 - Ignores empty or whitespace search text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPagedResult
    } as Response)

    await fetchFunds(1, 10, '   ')

    const fetchedUrl = vi.mocked(global.fetch).mock.calls[0][0] as URL
    expect(fetchedUrl.toString()).not.toContain('searchText=')
  })

  it('FetchFunds: 500 - Formats error correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: vi.fn().mockResolvedValue('Server down'),
    } as unknown as Response)

    await expect(fetchFunds(1, 10)).rejects.toThrow(
      'API error [500 Internal Server Error]: Server down',
    )
  })
})