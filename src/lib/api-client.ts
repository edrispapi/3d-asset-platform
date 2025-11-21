import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  // Build Headers robustly from possible init.headers shapes (Headers | [key,value][] | object)
  let headers = new Headers();
  const incoming = init?.headers as HeadersInit | undefined;
  if (incoming instanceof Headers) {
    incoming.forEach((v, k) => headers.append(k, v));
  } else if (Array.isArray(incoming)) {
    // Handle array of [key, value] tuples
    (incoming as Array<[string, string]>).forEach(([k, v]) => {
      if (k && v !== undefined && v !== null) headers.append(k, String(v));
    });
  } else if (incoming && typeof incoming === 'object') {
    Object.entries(incoming as Record<string, any>).forEach(([k, v]) => {
      if (v !== undefined && v !== null) headers.append(k, String(v));
    });
  }

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

  // If parsed JSON follows ApiResponse<T> shape (has boolean 'success'), handle explicitly
  if (contentType.includes('application/json') && parsed && typeof parsed === 'object' && typeof (parsed as any).success === 'boolean') {
    const json = parsed as ApiResponse<T>;
    if (json.success === false) {
      throw new Error(json.error || `Request failed with status ${res.status}`);
    }
    // success === true
    if (json.data !== undefined) {
      return json.data;
    }
    // success true but no data provided; preserve previous behavior by returning undefined as T
    return undefined as unknown as T;
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

  // If JSON but not ApiResponse-shaped, return the parsed JSON as-is (fallback)
  return parsed as unknown as T;
}