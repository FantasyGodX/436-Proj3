import { useEffect, useRef } from 'react'
import useFetch from '../hooks/useFetch'
import { mealDetailUrl } from '../api'
import { getIngredients } from '../utils/ingredients'
import AsyncView from './AsyncView'

function DetailSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ height: 220, width: 220 }} />
      <div className="skeleton skeleton-line" style={{ width: '60%' }} />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" style={{ width: '80%' }} />
    </div>
  )
}

export default function RecipeModal({ mealId, broken, onClose }) {
  const dialogRef = useRef(null)
  const request = useFetch(mealDetailUrl(mealId, broken))
  const meal = request.data?.meals?.[0]

  // Open as a modal once mounted; the guard avoids a double-open under StrictMode
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label="Recipe details"
      onClose={onClose}
      // A click on the backdrop targets the dialog element itself
      onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
    >
      <div className="modal-bar">
        <button type="button" className="modal-close" aria-label="Close recipe" onClick={() => dialogRef.current.close()}>
          ×
        </button>
      </div>
      <div className="modal-content">
        <AsyncView
          loading={request.loading}
          error={request.error}
          onRetry={request.refetch}
          skeleton={<DetailSkeleton />}
          loadingLabel="Loading recipe"
        >
          {meal ? (
            <article className="detail">
              <div className="detail-head">
                <img src={`${meal.strMealThumb}/medium`} alt={meal.strMeal} />
                <div>
                  <h2>{meal.strMeal}</h2>
                  <p className="card-meta">
                    {[meal.strCategory, meal.strCountry].filter(Boolean).join(' · ')}
                  </p>
                  {meal.strTags && (
                    <div className="tags">
                      {meal.strTags.split(',').map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {meal.strYoutube && (
                    <p>
                      <a className="link" href={meal.strYoutube} target="_blank" rel="noreferrer">
                        Watch on YouTube
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <h3>Ingredients</h3>
              <ul className="ingredients">
                {getIngredients(meal).map((ing, i) => (
                  <li key={`${ing.name}-${i}`}>
                    {ing.measure} {ing.name}
                  </li>
                ))}
              </ul>
              <h3>Instructions</h3>
              <p className="instructions">{meal.strInstructions}</p>
            </article>
          ) : (
            <p className="empty">We couldn't find that recipe.</p>
          )}
        </AsyncView>
      </div>
    </dialog>
  )
}
