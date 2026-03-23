import type { PagedResult } from '@t/page'
import { fetchFunds } from '@s/mutualFundService'
import SchemeView from '@v/SchemeView.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import 'vuetify/styles'

const mockPagedResult: PagedResult = {
  schemes: [
    {
      code: 0,
      name: 'Test Equity Fund',
      house: 'TestAMC',
      category: 'Equity',
      subCategory: 'Large Cap',
      plan: 'Growth',
      type: 'Open',
    },
  ],
  totalCount: 50,
  pageNumber: 1,
  totalPages: 5,
  hasNextPage: true,
  hasPreviousPage: false,
}

vi.mock('@s/mutualFundService')

describe('MutualFundSchemes', () => {

  it('loads schemes on mount and displays data', async () => {

    vi.mocked(fetchFunds).mockResolvedValue(mockPagedResult)

    const wrapper = mount(SchemeView)

    await flushPromises()

    expect(fetchFunds).toHaveBeenCalledWith(1)

    expect(wrapper.vm.page).toEqual(mockPagedResult)

    const rows = wrapper.findAll('tbody tr')

    expect(rows).toHaveLength(1)

    expect(rows[0]!.text()).toContain(0)
    expect(rows[0]!.text()).toContain('Test Equity Fund')

  })
})