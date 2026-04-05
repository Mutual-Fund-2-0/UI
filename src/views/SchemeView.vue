<script setup lang="ts">
import type { PagedResult } from '@t/page'
import type { Scheme } from '@t/scheme'
import { fetchFunds } from '@s/mutualFundService'
import { computed, onMounted, ref } from 'vue'

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const loading = ref(false)
const schemesPerPage = ref(10)
const pageSizeOptions = [10, 20, 30, 40, 50]
const error = ref<string | null>(null)
const sortBy = ref([])
const activeSearchText = ref<string>('')
const page = ref<PagedResult<Scheme>>({
  items: [],
  totalCount: 0,
  pageNumber: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})
defineExpose({ page })
const headers = [
  { title: 'Scheme Name', key: 'name' },
  { title: 'Fund House', key: 'house' },
  { title: 'Scheme Category', key: 'category' },
  { title: 'Scheme Sub-Category', key: 'subCategory' },
  { title: 'Scheme Plan', key: 'plan' },
  { title: 'Scheme Type', key: 'type' },
]

onMounted(() => goTo(1))

const start = computed((): number =>
  page.value.totalCount === 0 ? 0 : (page.value.pageNumber - 1) * schemesPerPage.value + 1,
)

const end = computed((): number =>
  Math.min(page.value.pageNumber * schemesPerPage.value, page.value.totalCount),
)

function reset (): void {
  schemesPerPage.value = 10
  activeSearchText.value = ''
  sortBy.value = []
  getMutualFundSchemes(1, schemesPerPage.value, activeSearchText.value)
}

const onPageSizeChange = (): void => goTo(1)

function onSearchInput(value: string): void {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => goTo(1, value || ''), 1000)
}

function goTo(pageNumber: number, searchText?: string): void {
  if (searchText !== undefined) activeSearchText.value = searchText
  getMutualFundSchemes(pageNumber, schemesPerPage.value, activeSearchText.value)
}

async function getMutualFundSchemes(
  pageNumber: number,
  pageSize: number,
  searchText?: string,
): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const response: PagedResult<Scheme> = await fetchFunds(pageNumber, pageSize, searchText)
    if (!response) throw new Error('Invalid API response shape')
    page.value = response
  } catch (error_: unknown) {
    error.value = error_ instanceof Error ? error_.message : String(error_)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="pb-0" fluid>
    <v-row>
      <v-col class="pb-0">
        <h1 class="title" @click="reset">Mutual Fund Schemes</h1>
      </v-col>

      <v-col class="d-flex justify-end pb-0" cols="3">
        <v-text-field
          v-model="activeSearchText"
          clearable
          density="comfortable"
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @update:model-value="onSearchInput"
        />
      </v-col>
    </v-row>

    <v-alert
      v-if="error"
      class="mb-4"
      closable
      text="Failed to load schemes. Please try again later."
      type="error"
    />

    <v-card class="pa-3 mb-2" elevation="1">
      <v-data-table
        v-model:sort-by="sortBy"
        :headers="headers"
        hide-default-footer
        item-key="code"
        :items="page.items"
        :items-per-page="schemesPerPage"
        :loading="loading"
        :must-sort="true"
      />

      <v-divider />

      <div class="table-footer d-flex justify-space-between align-center">
        <v-pagination
          v-model="page.pageNumber"
          active-color="whitesmoke"
          color="grey"
          density="compact"
          :length="page.totalPages"
          rounded="circle"
          total-visible="5"
          variant="plain"
          @update:model-value="goTo"
        />
        <div class="d-flex align-center">
          <div>
            <v-select
              v-model="schemesPerPage"
              class="page-size-select mr-3 mt-3"
              density="comfortable"
              hide-details
              :items="pageSizeOptions"
              variant="outlined"
              @update:model-value="onPageSizeChange"
            />

            <v-tooltip activator="parent" location="left"> Schemes per page </v-tooltip>
          </div>
          <div class="text-no-wrap footer-count mt-3">
            {{ start }} - {{ end }} of {{ page.totalCount }}
          </div>
        </div>
      </div>
    </v-card>
  </v-container>
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

:deep(.page-size-select .v-field__append-inner),
:deep(.v-pagination__prev),
:deep(.v-pagination__next)
  display none !important

.title:hover
  cursor pointer
</style>
