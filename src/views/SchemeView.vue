<script setup lang="ts">
import type { PagedResult } from '@t/page'
import type { Response } from '@t/Response'
import type { MutualFundScheme } from '@t/scheme'
import { fetchFunds } from '@s/mutualFundService'
import { onMounted, ref } from 'vue'

const page = ref<PagedResult<MutualFundScheme>>({
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})
const error = ref<string | null>(null)

async function getMutualFundSchemes(pageNumber = 1) {
  error.value = null
  try {
    const res: Response<MutualFundScheme> = await fetchFunds(pageNumber)
    if (!res || !res.page) throw new Error('Invalid API response shape')
    page.value = res.page
  } catch (error_: unknown) {
    error.value = error_ instanceof Error ? error_.message : String(error_)
  }
}

const goTo = (n: number) => getMutualFundSchemes(n)

onMounted(() => getMutualFundSchemes(1))
</script>

<template>
  <section class="scheme-list">
    <header>
      <h1>Mutual Fund Schemes</h1>
    </header>
    <div v-if="error" class="state error"><strong>Error:</strong> {{ error }}</div>
    <table v-else aria-live="polite" class="table">
      <thead>
        <tr>
          <th>Fund House</th>
          <th>Scheme Name</th>
          <th>Type</th>
          <th>Category</th>
          <th>Code</th>
          <th>ISIN (Growth)</th>
          <th>ISIN (Div Reinvest)</th>
        </tr>
      </thead>
      <tbody v-if="page.items.length > 0">
        <tr v-for="item in page.items" :key="item.schemeCode">
          <td>{{ item.fundHouse }}</td>
          <td>{{ item.schemeName ?? '—' }}</td>
          <td>{{ item.schemeType }}</td>
          <td>{{ item.schemeCategory ?? '—' }}</td>
          <td>{{ item.schemeCode }}</td>
          <td>{{ item.isinGrowth ?? '—' }}</td>
          <td>{{ item.isinDivReinvestment ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
    <nav v-if="!error" class="pager">
      <button :disabled="!page.hasPreviousPage" @click="goTo(page.pageNumber - 1)">Previous</button>
      <span>PagedResult {{ page.pageNumber }} / {{ page.totalPages }}</span>
      <button :disabled="!page.hasNextPage" @click="goTo(page.pageNumber + 1)">Next</button>
    </nav>
  </section>
</template>

<style lang="stylus" scoped>
.scheme-list
  max-width 1000px
  margin 0 auto
  padding 1rem
  font-family system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial
.state
  margin 1rem 0
.state.error
  color #b00020
.table
  width 100%
  border-collapse collapse
  margin-top 0.5rem
.table th, .table td
  border 1px solid #e5e7eb
  padding 0.5rem
  text-align left
  font-size 0.95rem
.pager
  display flex
  gap 1rem
  align-items center
  margin-top 1rem
.btn
  margin-left 0.5rem
button[disabled]
  opacity 0.5
  cursor not-allowed
</style>
