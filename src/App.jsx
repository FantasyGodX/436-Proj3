import { useState } from 'react'
import useFetch from './hooks/useFetch'
import { categoriesUrl, mealsByCategoryUrl } from './api'
import CategoryPicker from './components/CategoryPicker'
import RecipeGrid from './components/RecipeGrid'
import RecipeModal from './components/RecipeModal'

export default function App() {
  const [pickedCategory, setPickedCategory] = useState(null)
  const [openMealId, setOpenMealId] = useState(null)
  // Demo switch: points every request at an unreachable host so the error UI can be tested.
  // Also starts on when the page is opened with ?broken in the URL.
  const [broken, setBroken] = useState(() => new URLSearchParams(window.location.search).has('broken'))

  const categoriesRequest = useFetch(categoriesUrl(broken))
  // Derived, not stored: the user's pick, else the first category once loaded
  const category = pickedCategory ?? categoriesRequest.data?.categories?.[0]?.strCategory ?? null

  // null category means the list hasn't loaded yet, so this stays idle
  const mealsRequest = useFetch(mealsByCategoryUrl(category, broken))

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>The Recipe Tavern</h1>
          <p>Pull up a stool. Pick a category, find a dish.</p>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={broken} onChange={(e) => setBroken(e.target.checked)} />
          Simulate network failure
        </label>
      </header>

      <h2 className="section-title">Categories</h2>
      <CategoryPicker request={categoriesRequest} selected={category} onSelect={setPickedCategory} />

      {category && (
        <>
          <h2 className="section-title">{category} recipes</h2>
          {/* key resets the search and filter whenever the category changes */}
          <RecipeGrid key={category} request={mealsRequest} category={category} onOpen={setOpenMealId} />
        </>
      )}

      {openMealId && <RecipeModal mealId={openMealId} broken={broken} onClose={() => setOpenMealId(null)} />}
    </div>
  )
}
