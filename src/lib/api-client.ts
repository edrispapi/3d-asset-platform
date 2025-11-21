import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (path.startsWith('/api/')) {
    const token = localStorage.getItem('aetherlens_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  const res = await fetch(path, { ...init, headers });

  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  // Handle 204 No Content explicitly
  if (res.status === 204) {
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    // No content to return; preserve call-site expectations by returning undefined as T
    return undefined as unknown as T;
  }

  let parsed: any;
  if (contentType.includes('application/json')) {
    try {
      parsed = await res.json();
    } catch (err) {
      // If JSON parse fails, attempt to get text for better error messages
      const text = await res.text().catch(() => '');
      const msg = `Failed to parse JSON response (status ${res.status})${text ? `: ${text}` : ''}`;
      throw new Error(msg);
    }
  } else {
    // Non-JSON responses: read as text (could be HTML, plain text, etc.)
    parsed = await res.text().catch(() => '');
  }

  // For non-OK responses, include status and body when available
  if (!res.ok) {
    let bodySnippet = '';
    if (typeof parsed === 'string') {
      bodySnippet = parsed;
    } else if (parsed && typeof parsed === 'object') {
      bodySnippet = parsed.error || parsed.message || JSON.stringify(parsed);
    }
    throw new Error(`Request failed with status ${res.status}${bodySnippet ? `: ${bodySnippet}` : ''}`);
  }

  // For JSON responses, enforce ApiResponse<T> shape and behavior
  if (contentType.includes('application/json')) {
    const json = parsed as ApiResponse<T>;
    if (!json.success || json.data === undefined) {
      throw new Error(json.error || 'Request failed');
    }
    return json.data;
  }

  // For successful non-JSON responses, return the raw text as T
  return parsed as unknown as T;
}