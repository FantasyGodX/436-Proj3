// The API flattens ingredients into strIngredient1..20 / strMeasure1..20 fields
export function getIngredients(meal) {
  const items = []
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim()
    if (!name) continue
    const measure = meal[`strMeasure${i}`]?.trim()
    items.push({ name, measure: measure || '' })
  }
  return items
}
