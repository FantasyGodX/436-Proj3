// Renders exactly one of: loading placeholder, error with retry, or the data view (children).
export default function AsyncView({ loading, error, onRetry, skeleton, loadingLabel = 'Loading…', children }) {
  if (loading) {
    return (
      <div role="status" aria-live="polite" aria-label={loadingLabel}>
        {skeleton ?? <div className="spinner" />}
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-box" role="alert">
        <p className="error-title">The courier got lost.</p>
        <p className="error-message">{error}</p>
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }

  return children
}
