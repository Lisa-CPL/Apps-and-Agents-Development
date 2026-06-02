/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_BASE = '/api';

export interface MiniAppResponse {
  id: string;
  name: string;
  skill_one_liner: string;
  estimated_time: string;
}

export async function fetchMiniApps(): Promise<MiniAppResponse[]> {
  const res = await fetch(`${API_BASE}/mini-apps`);
  if (!res.ok) {
    throw new Error(`Failed to fetch mini-apps: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
