<script setup lang="ts">
import type { PagedResult } from '@t/page'
import type { Response } from '@t/Response'
import type { MutualFundScheme } from '@t/scheme'
import { fetchFunds } from '@s/mutualFundService'
import { onMounted, ref } from 'vue'

let totalCount: number
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
const headers = [
  { title: 'Fund House', key: 'fundHouse' },
  { title: 'Scheme Name', key: 'schemeName' },
  { title: 'Scheme Type', key: 'schemeType' },
  { title: 'Scheme Category', key: 'schemeCategory' },
  { title: 'Scheme Code', key: 'schemeCode' },
  { title: 'ISIN (Growth)', key: 'isinGrowth' },
  { title: 'ISIN (Div Reinvest)', key: 'isinDivReinvestment' },
]

onMounted(() => goTo(1))

const start = 1

const end = 10

const goTo = (n: number) => getMutualFundSchemes(n)

async function getMutualFundSchemes(pageNumber: number) {
  error.value = null
  try {
    const res: Response<MutualFundScheme> = await fetchFunds(pageNumber)
    if (!res || !res.page) throw new Error('Invalid API response shape')
    page.value = res.page
    totalCount = page.value.totalCount
  } catch (error_: unknown) {
    error.value = error_ instanceof Error ? error_.message : String(error_)
  }
}

</script>

<template>
  <v-app>
    <v-main>
      <v-container class="pb-0" fluid>
        <v-row>
          <v-col class="pb-0">
            <h1 class="title">Mutual Fund Schemes</h1>
          </v-col>

          <v-col class="d-flex justify-end pb-0" cols="4">
            <v-text-field
              density="comfortable"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-card class="pa-3 mb-2" elevation="1">
          <v-data-table
            :headers="headers"
            hide-default-footer
            item-key="schemeCode"
            :items="page.items"
          >
            <template #item.fundHouse="{ item }">
              <div>{{ item.fundHouse }}</div>
            </template>

            <template #item.schemeName="{ item }">
              <div>{{ item.schemeName }}</div>
            </template>
            <template #item.schemeType="{ item }">
              <div>{{ item.schemeType }}</div>
            </template>
            <template #item.schemeCategory="{ item }">
              <div>{{ item.schemeCategory }}</div>
            </template>
            <template #item.schemeCode="{ item }">
              <div>{{ item.schemeCode }}</div>
            </template>
            <template #item.isinGrowth="{ item }">
              <div>{{ item.isinGrowth }}</div>
            </template>
            <template #item.isinDivReinvestment="{ item }">
              <div>{{ item.isinDivReinvestment }}</div>
            </template>
          </v-data-table>

          <v-divider />

          <div class="table-footer d-flex justify-space-between align-center">
            <v-pagination
              active-color="whitesmoke"
              color="grey"
              density="compact"
              :length="page.totalPages"
              rounded="circle"
              total-visible="5"
              variant="plain"
              @update:model-value="goTo"
            />
            <div>{{ start }} - {{ end }} of {{ totalCount }}</div>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="stylus" scoped>
.v-main, .v-card, .v-table
  color whitesmoke

.v-table :deep(.v-table__wrapper) > table > tbody > tr > td,
.v-table :deep(.v-table__wrapper) > table > thead > tr > th,
.v-table :deep(.v-table__wrapper) > table > tbody > tr:last-child > td
  border-bottom-color white !important

.v-main
  background-color black

.v-card
  background-color #0B0B0F
  border-radius 12px
  border 1px solid #1A1A1F

.v-table
  background-color #111117


.v-table :deep(.v-table__wrapper) > table > tbody > tr:last-child > td
  border-bottom 1px solid !important

.table-footer
  padding-top 2px
</style>
