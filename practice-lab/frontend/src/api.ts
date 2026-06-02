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

export interface CriterionSpec {
  name: string;
  label: string;
  description: string;
}

export interface MiniAppDetailResponse extends MiniAppResponse {
  orientation_copy: string;
  criteria: CriterionSpec[];
}

export async function fetchMiniApps(): Promise<MiniAppResponse[]> {
  const res = await fetch(`${API_BASE}/mini-apps`);
  if (!res.ok) {
    throw new Error(`Failed to fetch mini-apps: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchMiniAppDetail(appId: string): Promise<MiniAppDetailResponse> {
  const res = await fetch(`${API_BASE}/mini-apps/${appId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch mini-app details: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function generateScenario(miniAppId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mini_app_id: miniAppId, turns: [] }),
  });
  if (!res.ok) {
    throw new Error(`Failed to generate scenario: ${res.status} ${res.statusText}`);
  }
  const data: { scenario: string } = await res.json();
  return data.scenario;
}

export interface CriterionAssessment {
  name: string;
  verdict: 'strong' | 'partial' | 'needs work';
  what_worked: string | null;
  what_to_improve: string | null;
}

export interface FeedbackPayload {
  user_response: string;
  criteria: CriterionAssessment[];
  suggestion: string;
  extras: Record<string, unknown>;
}

export async function submitResponse(
  miniAppId: string,
  scenario: string,
  userResponse: string,
): Promise<FeedbackPayload> {
  const res = await fetch(`${API_BASE}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mini_app_id: miniAppId,
      scenario,
      user_response: userResponse,
      turns: [],
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to evaluate response: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
