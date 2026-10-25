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
  const [state, setState] = useState({ data: null, error: null, loading: Boolean(url) })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!url) {
      setState({ data: null, error: null, loading: false })
      return
    }

    const controller = new AbortController()
    setState({ data: null, error: null, loading: true })

    async function load() {
      try {
        const res = await fetch(url, { signal: controller.signal })
        // fetch only rejects on network failure, so HTTP errors are checked by hand
        if (!res.ok) throw new Error(`The recipe server replied with an error (HTTP ${res.status}).`)
        const data = await res.json()
        setState({ data, error: null, loading: false })
      } catch (err) {
        if (err.name === 'AbortError') return // superseded by a newer request or unmounted
        setState({ data: null, error: toMessage(err), loading: false })
      }
    }
    load()

    // Cleanup runs when url/reloadKey change or the component unmounts
    return () => controller.abort()
  }, [url, reloadKey])

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  return { ...state, refetch }
}
