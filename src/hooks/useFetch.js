import { useCallback, useEffect, useState } from 'react'

// Turn whatever went wrong into a sentence a person can act on
function toMessage(err) {
  if (err instanceof TypeError) {
    return navigator.onLine
      ? "We couldn't reach the recipe server. It may be down or unreachable."
      : 'You appear to be offline. Check your connection and try again.'
  }
  return err.message || 'Something unexpected went wrong.'
}

// Fetches `url` and reports exactly one of three states: loading, error, or data.
// Pass null to stay idle (nothing to fetch yet).
export default function useFetch(url) {
  // Each result remembers which request produced it
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  // Identifies one specific request: this URL on this retry attempt
  const requestKey = url ? `${reloadKey}:${url}` : null

  useEffect(() => {
    if (!url) return

    const controller = new AbortController()

    async function load() {
      try {
        const res = await fetch(url, { signal: controller.signal })
        // fetch only rejects on network failure, so HTTP errors are checked by hand
        if (!res.ok) throw new Error(`The recipe server replied with an error (HTTP ${res.status}).`)
        const data = await res.json()
        setResult({ key: requestKey, data, error: null })
      } catch (err) {
        if (err.name === 'AbortError') return // superseded by a newer request or unmounted
        setResult({ key: requestKey, data: null, error: toMessage(err) })
      }
    }
    load()

    // Cleanup runs when url/reloadKey change or the component unmounts
    return () => controller.abort()
  }, [url, requestKey])

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  // A result only counts if it belongs to the current request; otherwise we're still loading.
  // Deriving this makes impossible combinations (loading + error) unrepresentable.
  const current = result.key === requestKey
  return {
    data: current ? result.data : null,
    error: current ? result.error : null,
    loading: Boolean(url) && !current,
    refetch,
  }
}
