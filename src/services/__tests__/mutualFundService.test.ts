import type { PagedResult } from '@t/page'
import { fetchFunds } from '@s/mutualFundService'
import { describe, expect, it, vi } from 'vitest'

const mockPagedResult: PagedResult = {
  schemes: [
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

describe('API:fetchFunds', () => {
  it('FetchFunds:200', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPagedResult,
    } as Response)
    const result = await fetchFunds(1)
    expect(result).toEqual(mockPagedResult)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('pageNumber=1'),
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'application/json' },
      }),
    )
  })

  it('FetchFunds:500', async () => {
    global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: vi.fn().mockResolvedValue('Server down'),
      } as unknown as Response)
    await expect(fetchFunds(1)).rejects.toThrow('API error: 500 Internal Server Error - Server down')
  })
})
