const REAL_BASE = 'https://www.themealdb.com/api/json/v1/1'
// .invalid is a reserved TLD that never resolves, so requests fail like a dropped network
const BROKEN_BASE = 'https://themealdb.invalid/api/json/v1/1'

const baseFor = (broken) => (broken ? BROKEN_BASE : REAL_BASE)

export const categoriesUrl = (broken) => `${baseFor(broken)}/categories.php`

export const mealsByCategoryUrl = (category, broken) =>
  category ? `${baseFor(broken)}/filter.php?c=${encodeURIComponent(category)}` : null

export const mealDetailUrl = (id, broken) =>
  id ? `${baseFor(broken)}/lookup.php?i=${encodeURIComponent(id)}` : null
