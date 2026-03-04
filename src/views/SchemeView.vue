<script setup lang="ts">
import type { PagedResult } from '@t/page'
import { fetchFunds } from '@s/mutualFundService'
import { onMounted, ref } from 'vue'

const pageSize = 10
const error = ref<string | null>(null)
const sortBy = ref([])
const page = ref<PagedResult>({
  schemes: [],
  totalCount: 0,
  pageNumber: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})
const headers = [
  { title: 'Scheme Code', key: 'code' },
  { title: 'Scheme Name', key: 'name' },
  { title: 'Fund House', key: 'house' },
  { title: 'Scheme Category', key: 'category' },
  { title: 'Scheme Sub-Category', key: 'subCategory' },
  { title: 'Scheme Plan', key: 'plan' },
  { title: 'Scheme Type', key: 'type' }
]

onMounted(() => goTo(1))

const start = () => (page.value.pageNumber - 1) * pageSize + 1

const end = () => Math.min(page.value.pageNumber * pageSize, page.value.totalCount)

const goTo = (pageNumber: number) => getMutualFundSchemes(pageNumber)

async function getMutualFundSchemes(pageNumber: number) {
  try {
    const response: PagedResult = await fetchFunds(pageNumber)
    if (!response) throw new Error('Invalid API response shape')
    page.value = response
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
            v-model:sort-by="sortBy"
            :headers="headers"
            hide-default-footer
            item-key="code"
            :items="page.schemes"
            :must-sort="true"
          />

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
            <div>{{ start() }} - {{ end() }} of {{ page.totalCount }}</div>
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

:deep(.v-data-table__th--sortable:hover),
:deep(.v-data-table__th--sorted)
  color grey !important
</style>
