import AsyncView from './AsyncView'

function ChipSkeleton() {
  return (
    <div className="chips">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="skeleton chip-skeleton" />
      ))}
    </div>
  )
}

export default function CategoryPicker({ request, selected, onSelect }) {
  const categories = request.data?.categories ?? []

  return (
    <AsyncView
      loading={request.loading}
      error={request.error}
      onRetry={request.refetch}
      skeleton={<ChipSkeleton />}
      loadingLabel="Loading categories"
    >
      <div className="chips">
        {categories.map((c) => (
          <button
            key={c.idCategory}
            type="button"
            className="chip"
            aria-pressed={c.strCategory === selected}
            onClick={() => onSelect(c.strCategory)}
          >
            {c.strCategory}
          </button>
        ))}
      </div>
    </AsyncView>
  )
}
