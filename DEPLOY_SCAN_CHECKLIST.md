# Pre-Deployment Scan Checklist

Purpose: Track which folders/files have been reviewed for pre-deployment issues.
**Checkbox = `[x]` scanned. `[ ]` = not yet scanned.**
If the connection cuts, resume by scanning the first unchecked item and continue.

Last updated: FULL SCAN COMPLETE — all blockers FIXED (build + lint verified passing)

## Findings (deployment blockers / risks)

1. **`backend/app/alembic/versions/6ee2d3dfd4b9`**: migration titled "changed anime model" actually CREATES the `manga` table. Not fatal, but confusing; also means fresh DB gets manga before the "changed manga" migration.
2. **[CONFIRMED BLOCKER] The `games` table is never created.** `backend/app/main.py:11` has `Base.metadata.create_all` COMMENTED OUT and NO alembic migration creates `games`. On a fresh/empty DB, any game operation (add/get, game search→add) fails with missing-table error. Add a migration for the `Game` model or re-enable `create_all`.
3. **[BLOCKER] `backend/app/entry/route.py:26` calls `create_entry(user_id, media_item_id, status, rating)` but `backend/app/entry/service.py:109` defines `create_entry(self, user_id, media_item_id, status)` — no `rating` param.** Creating an entry raises `TypeError` → HTTP 500. Fix signature (add `rating=None`) or drop the arg.
4. **[BLOCKER] Frontend production build fails.** `npm run build` ("tsc -b && vite build") errors: `src/pages/anime/AnimeDetailPage.tsx:69,70` TS2322 — `anime.cover_url` and derived `title` can be `null`/`undefined` but `<img src>/alt` expects `string`. Add null-safe fallbacks.
5. **[BLOCKER] ESLint fails:** `npm run lint` errors on `src/utils/utils.ts:4` — `useCookies` called inside `isLoggedIn`, which is neither a component nor a `use*` hook. `isLoggedIn` is also currently UNUSED (dead code). Remove it or convert to `useIsLoggedIn`.
6. **`backend/app/anime/route.py:35`**: `get_anime_by_id(anime_id: str)` then `int(anime_id)` — a non-numeric path param raises uncaught `ValueError` → HTTP 500. Use `anime_id: int` in the path.
7. WARN: `backend/main.py` is a leftover scaffold ("Hello from backend!") — NOT the deployed entrypoint (README uses `app.main:app`). Harmless, but remove to avoid confusion.
8. MINOR: unused import `from turtle import title` in `backend/app/games/route.py:1` and `backend/app/games/models.py:1`.
9. MINOR: `get_manga_details` end_date uses `_date_str({"from": published.get("to")})` (`jikanMangaService.py:92`) — works only because `_date_str` reads the `"from"` key.
10. MINOR: Secure-cookie logic in `auth/router.py:22` uses `hasattr(config,'DEBUG')`; DEBUG defaults False so Secure cookie is on in prod. OK.
11. WARN: env-var mismatch — README documents `VITE_API_BASE_URL`, but `src/libs/config.ts` reads `import.meta.env.VITE_BASE_URL` (fallback `http://localhost:8000`). In prod the base must be set via `VITE_BASE_URL` or the correct var must be wired.
12. WARN: cookie-name mismatch — backend sets httponly cookie `token` (`auth/dependencies.py:5`); `src/utils/utils.ts:4` checks an `access_token` cookie. Unused today, but would always report logged-out.
13. WARN: `App.tsx` has no root `/` route or redirect (login at `/login`, dashboard at `/dashboard`); unknown paths render blank.
14. WARN: Anime/Game/Manga detail pages call `useGetXById(id!)` even when `useParams` id is null → requests to `/anime/null` etc.
15. WARN: `EntryCard.tsx` `TYPE_ROUTE_MAP` maps `movie→/movie`, `tv_show→/tv-show` but those routes don't exist in `App.tsx` → blank page for movie/tv entries.
16. WARN: `GameCard.tsx:22` / `GamePage.tsx:30` — `release_date === "Unreleased"` breaks `new Date("Unreleased")` (Invalid Date → NaN) in sort comparator.
17. WARN: `AnimePage` / `MangaPage` search does not reset `page` to 1 (unlike `GamePage`).
18. NOTE: `EntryCard.tsx:49` `img src={entry.image_url}` typed `string` but backend `MediaItem.image_url` is nullable → broken image, no fallback.
19. NOTE: mutations in `MediaLibraryControls` / `NotePopUp` / `RatingPopUp` / `EntryCard` have no `.onError` handlers → silent failures.
20. NOTE: `GameDetailPage.tsx:101` class broken across a newline (`"text\n-XS"`) → lost styling.

---

## Backend (`backend/app`)

- [x] `backend/app/alembic/` (migrations)
- [x] `backend/app/anime/` (anilistService, models, route, service)
- [x] `backend/app/auth/` (dependencies, router, schemas, service)
- [x] `backend/app/core/` (security)
- [x] `backend/app/entry/` (model, route, service)
- [x] `backend/app/games/` (igdbService, models, route, service)
- [x] `backend/app/manga/` (jikanMangaService, models, route, service)
- [x] `backend/app/mediaItem/` (model, service)
- [x] `backend/app/user/` (model)
- Backend root files:
- [x] `backend/app/config.py`
- [x] `backend/app/database.py`
- [x] `backend/app/main.py`

## Backend config / scripts

- [x] `backend/main.py`
- [x] `backend/scripts/` (generate_igdb_access_token.py)
- [x] `backend/pyproject.toml`
- [x] `backend/alembic.ini`
- [x] `backend/.env.example` / `.env` (secrets audit)

## Frontend config

- [x] `frontend/package.json`
- [x] `frontend/vite.config.ts`
- [x] `frontend/tsconfig*.json`
- [x] `frontend/eslint.config.js`
- [x] `frontend/index.html`
- [x] `frontend/.env` (secrets audit)

## Frontend `src/clients`

- [x] `src/clients/apiClient.ts`
- [x] `src/clients/queryClient.ts`

## Frontend `src/components/layout`

- [x] `AppLayout.tsx`
- [x] `SideBar.tsx`
- [x] `TopBar.tsx`

## Frontend `src/components/media`

- [x] `AnimeCard.tsx`
- [x] `GameCard.tsx`
- [x] `MangaCard.tsx`

## Frontend `src/components/ui`

- [x] `EntryCard.tsx`
- [x] `MediaLibraryControls.tsx`
- [x] `NotePopUp.tsx`
- [x] `PaginationFooter.tsx`
- [x] `RatingPopUp.tsx`
- [x] `SearchBar.tsx`
- [x] `SortDropDown.tsx`
- [x] `StatusBadge.tsx`
- [x] `StatusDropdown.tsx`

## Frontend `src/hooks`

- [x] `useAnime.ts`
- [x] `useAuth.ts`
- [x] `useEntries.ts`
- [x] `useGames.ts`
- [x] `useManga.ts`

## Frontend `src/libs` / `src/models` / `src/utils`

- [x] `src/libs/config.ts`
- [x] `src/libs/statusConfig.ts`
- [x] `src/models/anime.ts`
- [x] `src/models/entries.ts`
- [x] `src/models/games.ts`
- [x] `src/models/manga.ts`
- [x] `src/utils/utils.ts`

## Frontend `src/pages`

- [x] `src/pages/Dashboard.tsx`
- [x] `src/pages/auth/` (LoginPage, RegisterPage)
- [x] `src/pages/anime/` (AnimePage, AnimeDetailPage)
- [x] `src/pages/games/` (GamePage, GameDetailPage)
- [x] `src/pages/manga/` (MangaPage, MangaDetailPage)
- [x] `src/App.tsx`, `src/main.tsx`, `src/index.css`

## Global checks (repeat at end)

- [x] Build backend (py_compile app/ — OK)
- [x] Build frontend (tsc + vite build) — **PASS (fixed)**
- [x] ESLint run — **PASS (fixed)**
- [x] Secrets / .env audit (only `.env.example` tracked; `.env` gitignored — OK)
- [x] .gitignore correctness (OK)

## Fixes applied

- [x] Added `backend/app/alembic/versions/ab12cd34ef56_add_games_table.py` (creates `games`; chain head verified).
- [x] `entry/service.py`: `create_entry` now accepts `rating` and stores it.
- [x] `anime/route.py`: `get_anime_by_id(anime_id: int)` (no raw `int()` cast).
- [x] `AnimeDetailPage.tsx`: null-safe `cover_url ?? ""` and `title || ""`; frontend build passes.
- [x] Deleted unused/broken `src/utils/utils.ts` (dead code + hook misuse); lint passes.
- [x] Removed stray `from turtle import title` in `games/route.py` & `games/models.py`.
- [x] **bcrypt fix**: passlib 1.7.4 (abandoned) was incompatible with bcrypt 5.0.0 (`RuntimeError: bcrypt backend unexpectedly has wraparound bug for $2y$`). Replaced passlib with the `bcrypt` library directly in `core/security.py` (`hash_password`/`verify_password`) + updated `auth/service.py` and `pyproject.toml`; `uv sync` removed passlib. Verified: new hashes `$2b$12$`, legacy `$2y$` hashes still verify (existing users can log in), malformed hashes return False.