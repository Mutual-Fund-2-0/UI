// src/services/fundService.ts
import type { FundApiResponse } from '@/models/fund';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''; // set in .env

export async function fetchFunds(page = 1, pageSize = 10): Promise<FundApiResponse> {
  const url = `${API_BASE}/funds?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error: ${res.status} ${res.statusText} ${text ? `- ${text}` : ''}`);
  }

  const json = (await res.json()) as FundApiResponse;
  return json;
}
