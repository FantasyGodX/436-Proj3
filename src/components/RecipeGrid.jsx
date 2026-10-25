import { useMemo, useState } from 'react'
import AsyncView from './AsyncView'

function GridSkeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  )
}

export default function RecipeGrid({ request, category, onOpen }) {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')

  // The API returns { meals: null } for an empty category
  // Memoized so the filters below only recompute when the fetched data changes
  const meals = useMemo(() => request.data?.meals ?? [], [request.data])

  const countries = useMemo(
    () => [...new Set(meals.map((m) => m.strCountry).filter(Boolean))].sort(),
    [meals],
  )

  // Client-side filtering of data we already have: no extra requests while typing
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return meals.filter(
      (m) => m.strMeal.toLowerCase().includes(q) && (!country || m.strCountry === country),
    )
  }, [meals, query, country])

  return (
    <AsyncView
      loading={request.loading}
      error={request.error}
      onRetry={request.refetch}
      skeleton={<GridSkeleton />}
      loadingLabel={`Loading ${category} recipes`}
    >
      <div className="filters">
        <input
          type="search"
          placeholder={`Search ${category} recipes…`}
          aria-label="Search recipes by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {countries.length > 0 && (
          <select aria-label="Filter by country" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {meals.length === 0 ? (
        <p className="empty">No recipes in this category yet.</p>
      ) : visible.length === 0 ? (
        <p className="empty">No recipes match your search. Try a different word.</p>
      ) : (
        <>
          <p className="result-count">
            Showing {visible.length} of {meals.length}
          </p>
          <div className="grid">
            {visible.map((m) => (
              <button key={m.idMeal} type="button" className="card" onClick={() => onOpen(m.idMeal)}>
                <img src={`${m.strMealThumb}/medium`} alt={m.strMeal} loading="lazy" />
                <div className="card-body">
                  <h3 className="card-title">{m.strMeal}</h3>
                  {m.strCountry && <p className="card-meta">{m.strCountry}</p>}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </AsyncView>
  )
}
