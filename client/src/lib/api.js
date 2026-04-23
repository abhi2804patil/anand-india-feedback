const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

function authHeaders() {
  const t = localStorage.getItem('aibh_token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(opts.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('aibh_token');
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export const api = {
  submitFeedback: (payload) =>
    request('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  listResponses: (filters = {}) => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    return request('/admin/responses' + (qs.toString() ? `?${qs}` : ''));
  },
  clearAllResponses: () =>
    request('/admin/responses', { method: 'DELETE' }),
  stats: (filters = {}) => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    return request('/admin/stats' + (qs.toString() ? `?${qs}` : ''));
  },
  exportCsvUrl: (filters = {}) => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    return BASE + '/admin/export.csv' + (qs.toString() ? `?${qs}` : '');
  },
};
