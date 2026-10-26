# The Recipe Tavern

A React app for browsing recipes by category, with live search and a country filter. Built for CSC 436 Project 3 (Async React) to demonstrate the Three States Pattern: every fetch shows a loading state, an error state with retry, or data. It never shows a blank screen.

**Live site:** https://proj3-meals.netlify.app

## API

[TheMealDB](https://www.themealdb.com/api.php), a free public API that needs no key or OAuth. The app uses three endpoints:

| Endpoint | Used for |
|---|---|
| `categories.php` | the category chips |
| `filter.php?c=<category>` | the recipe grid for the selected category |
| `lookup.php?i=<id>` | the full recipe in the detail modal |

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint
```

## How to see the error state

Either:

- tick **Simulate network failure** in the page header, or
- open the site with `?broken` on the end of the URL (for example `/?broken`).

Both point every request at an unreachable host, so each fetch fails like a dropped connection. Each error box has a **Try again** button. Unticking the box recovers on its own. Real failures are handled too: going offline gives an "offline" message, and HTTP errors such as a 500 are reported with their status code.

## How it works

- `src/hooks/useFetch.js`: custom hook, `useFetch(url)` returns `{ data, loading, error, refetch }`. The effect depends only on primitives (`url` and a retry counter), so it can't loop, and it aborts in-flight requests on cleanup.
- `src/components/AsyncView.jsx`: renders exactly one of loading, error, or data. All three fetches go through it.
- `src/components/CategoryPicker.jsx`, `RecipeGrid.jsx`, `RecipeModal.jsx`: the three fetches, each with its own skeleton.
- Search and country filtering run client-side over the already-fetched list, so typing never triggers a request.

## Deploy

Netlify builds with `npm run build` and publishes `dist` (see `netlify.toml`).
