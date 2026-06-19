/**
 * Fetch Utilities
 *
 * Wrapper around fetch that adds timeout protection to prevent hanging requests.
 * Use this for all external API calls to improve reliability.
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number // Timeout in milliseconds (default: 10000ms)
}

/**
 * Fetch with automatic timeout protection
 *
 * @param url - The URL to fetch
 * @param options - Fetch options with optional timeout
 * @returns Promise<Response>
 * @throws AbortError if timeout is reached
 *
 * @example
 * ```ts
 * try {
 *   const response = await fetchWithTimeout('https://api.example.com/data', {
 *     timeout: 5000, // 5 second timeout
 *     method: 'POST',
 *     body: JSON.stringify(data)
 *   })
 *   const result = await response.json()
 * } catch (error) {
 *   if (error.name === 'AbortError') {
 *     console.error('Request timed out')
 *   }
 * }
 * ```
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 10000, signal: externalSignal, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // If an external signal is provided, listen to it and abort our controller
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort())
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}
