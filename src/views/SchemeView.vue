<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MutualFundScheme } from '@/types/scheme'
import type { PagedResult } from '@/types/page'
import { fetchFunds } from '@/services/fundService'

const page = ref<PagedResult<MutualFundScheme>>({
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false
});
const correlationId = ref<string | undefined>(undefined);
const loading = ref(false);
const error = ref<string | null>(null);

async function load(pageNumber = 1) {
  loading.value = true;
  error.value = null;
  try {
    const res: FundApiResponse = await fetchFunds(pageNumber, page.value.pageSize || 10);
    if (!res || !res.page) {
      throw new Error('Invalid API response shape');
    }
    page.value = res.page;
    correlationId.value = res.correlationId;
  } catch (err: any) {
    error.value = err?.message ?? String(err);
  } finally {
    loading.value = false;
  }
}

function goTo(n: number) {
  if (n < 1) return;
  load(n);
}

function reload() {
  load(page.value.pageNumber);
}

onMounted(() => {
  load(1);
});
</script>

<template>
  <section class="fund-list">
    <header>
      <h1>Funds</h1>
      <div v-if="correlationId" class="meta">Correlation ID: {{ correlationId }}</div>
    </header>

    <div v-if="loading" class="state">Loading…</div>

    <div v-else-if="error" class="state error">
      <strong>Error:</strong> {{ error }}
      <button @click="reload" class="btn">Retry</button>
    </div>

    <table v-else class="table" aria-live="polite">
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
      <tbody>
        <tr v-for="item in page.items" :key="item.schemeCode">
          <td>{{ item.fundHouse }}</td>
          <td>{{ item.schemeName ?? '—' }}</td>
          <td>{{ item.schemeType }}</td>
          <td>{{ item.schemeCategory ?? '—' }}</td>
          <td>{{ item.schemeCode }}</td>
          <td>{{ item.isinGrowth ?? '—' }}</td>
          <td>{{ item.isinDivReinvestment ?? '—' }}</td>
        </tr>
        <tr v-if="page.items.length === 0">
          <td colspan="7">No records found.</td>
        </tr>
      </tbody>
    </table>

    <nav class="pager" v-if="!loading && !error">
      <button :disabled="page.pageNumber <= 1" @click="goTo(page.pageNumber - 1)">Previous</button>
      <span>PagedResult {{ page.pageNumber }} / {{ page.totalPages }}</span>
      <button :disabled="!page.hasNextPage" @click="goTo(page.pageNumber + 1)">Next</button>
    </nav>
  </section>
</template>

<style scoped>
.fund-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}
.meta {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.5rem;
}
.state {
  margin: 1rem 0;
}
.state.error {
  color: #b00020;
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}
.table th, .table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
  font-size: 0.95rem;
}
.pager {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}
.btn {
  margin-left: 0.5rem;
}
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
