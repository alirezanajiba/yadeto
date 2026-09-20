const API_URL = import.meta.env.VITE_API_URL ?? 'https://api.yadeto.ir/api/v1';

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Yadeto API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
