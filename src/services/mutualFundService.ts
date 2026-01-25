import type { Response } from '@t/Response'
import type { MutualFundScheme } from '@t/scheme'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchFunds(page: number): Promise<Response<MutualFundScheme>> {
  const url = `${API_BASE_URL}/MutualFund/schemes?pageNumber=${encodeURIComponent(page)}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error: ${res.status} ${res.statusText} ${text ? `- ${text}` : ''}`)
  }
  const json = (await res.json()) as Response<MutualFundScheme>
  return json
}
