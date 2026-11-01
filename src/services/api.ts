export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public path?: string,
  ) {
    super(message)
  }
}
const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
export async function request<T>(
  path: string,
  body?: unknown,
  token?: string,
  method = body === undefined ? 'GET' : 'POST',
): Promise<T> {
  let response: Response
  try {
    response = await fetch(base + path, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please try again.', path)
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const fallback: Record<number, string> = {
      400: 'Please check the entered values.',
      401: 'Invalid credentials or expired session.',
      409: 'Username or email is already registered.',
      429: 'Too many attempts. Please try again later.',
    }
    throw new ApiError(
      response.status,
      data.detail ||
        data.message ||
        fallback[response.status] ||
        'Request failed. Please try again.',
      path,
    )
  }
  return response.status === 204 ? (undefined as T) : response.json()
}
