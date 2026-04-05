import type { PagedResult } from '@t/page'
import type { Scheme } from '@t/scheme'
import { fetchFunds } from '@s/mutualFundService'
import SchemeView from '@v/SchemeView.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'

const mockPagedResult: PagedResult<Scheme> = {
  items: [
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

describe('SchemeView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads schemes on mount and displays data with default parameters', async () => {
    vi.mocked(fetchFunds).mockResolvedValue(mockPagedResult)

    const wrapper = mount(SchemeView)

    await flushPromises()
    await nextTick()

    expect(fetchFunds).toHaveBeenCalledWith(1, 10, '')
    expect(wrapper.vm.page).toEqual(mockPagedResult)

    expect(wrapper.text()).toContain('Test Equity Fund')
  })

  it('displays an error alert when the API call fails', async () => {
    vi.mocked(fetchFunds).mockRejectedValue(new Error('Internal Server Error'))

    const wrapper = mount(SchemeView)

    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Failed to load schemes. Please try again later.')
    expect(wrapper.find('.v-alert').exists()).toBe(true)
  })

  it('debounces the search input by 1000ms before calling the API', async () => {
    vi.useFakeTimers()
    vi.mocked(fetchFunds).mockResolvedValue(mockPagedResult)

    const wrapper = mount(SchemeView)
    await flushPromises()
    
    vi.clearAllMocks()

    wrapper.vm.onSearchInput('Growth')

    expect(fetchFunds).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)

    expect(fetchFunds).toHaveBeenCalledWith(1, 10, 'Growth')
  })

  it('fetches data again when the page size is changed', async () => {
    vi.mocked(fetchFunds).mockResolvedValue(mockPagedResult)

    const wrapper = mount(SchemeView)
    await flushPromises()
    vi.clearAllMocks()

    wrapper.vm.schemesPerPage = 50
    wrapper.vm.onPageSizeChange()

    await flushPromises()

    expect(fetchFunds).toHaveBeenCalledWith(1, 50, '')
  })

  it('resets the view state when the title is clicked', async () => {
    vi.mocked(fetchFunds).mockResolvedValue(mockPagedResult)

    const wrapper = mount(SchemeView)
    await flushPromises()

    wrapper.vm.activeSearchText = 'Dirty Search'
    wrapper.vm.schemesPerPage = 20
    vi.clearAllMocks()

    wrapper.vm.reset()
    await flushPromises()

    expect(wrapper.vm.activeSearchText).toBe('')
    expect(wrapper.vm.schemesPerPage).toBe(10)
    expect(fetchFunds).toHaveBeenCalledWith(1, 10, '')
  })

  it('fetches data for the new page when pagination is triggered', async () => {
    vi.mocked(fetchFunds).mockResolvedValue(mockPagedResult)
    const wrapper = mount(SchemeView)
    await flushPromises()
    
    vi.clearAllMocks()

    wrapper.vm.goTo(3)
    await flushPromises()

    expect(fetchFunds).toHaveBeenCalledWith(3, 10, '')
    
    expect(wrapper.vm.page.pageNumber).toBe(1) // Note: This checks the mock response data, which is hardcoded to 1 in your mockPagedResult
  })
})
