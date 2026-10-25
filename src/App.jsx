import { useState } from 'react'
import useFetch from './hooks/useFetch'
import { categoriesUrl, mealsByCategoryUrl } from './api'
import CategoryPicker from './components/CategoryPicker'
import RecipeGrid from './components/RecipeGrid'
import RecipeModal from './components/RecipeModal'

export default function App() {
  const [pickedCategory, setPickedCategory] = useState(null)
  const [openMealId, setOpenMealId] = useState(null)

  const categoriesRequest = useFetch(categoriesUrl(false))
  // Derived, not stored: the user's pick, else the first category once loaded
  const category = pickedCategory ?? categoriesRequest.data?.categories?.[0]?.strCategory ?? null

  // null category means the list hasn't loaded yet, so this stays idle
  const mealsRequest = useFetch(mealsByCategoryUrl(category, false))

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>The Recipe Tavern</h1>
          <p>Pull up a stool. Pick a category, find a dish.</p>
        </div>
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

      {openMealId && <RecipeModal mealId={openMealId} broken={false} onClose={() => setOpenMealId(null)} />}
    </div>
  )
}
