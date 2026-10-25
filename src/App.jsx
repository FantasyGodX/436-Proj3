import { useState } from 'react'
import useFetch from './hooks/useFetch'
import { categoriesUrl } from './api'
import CategoryPicker from './components/CategoryPicker'

export default function App() {
  const [pickedCategory, setPickedCategory] = useState(null)

  const categoriesRequest = useFetch(categoriesUrl(false))
  // Derived, not stored: the user's pick, else the first category once loaded
  const category = pickedCategory ?? categoriesRequest.data?.categories?.[0]?.strCategory ?? null

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
    </div>
  )
}
