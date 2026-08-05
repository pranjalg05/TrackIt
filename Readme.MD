# TrackIt

A media tracking application with FastAPI backend and React frontend.

## Features

- Track games, anime, and manga
- User authentication with JWT tokens
- Integration with IGDB, TMDB, and AniList APIs

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, PostgreSQL, Alembic
**Frontend:** React, TypeScript, Vite, TanStack Query

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `SQLALCHEMY_DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | JWT signing secret | Yes |
| `ALGORITHM` | JWT algorithm (e.g., HS256) | Yes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes | Yes |
| `DEBUG` | Enable debug mode (disables Secure cookie flag) | No (default: false) |
| `TMDB_API_KEY` | TMDB API key | Yes |
| `TMDB_API_READ_ACCESS_TOKEN` | TMDB read access token | Yes |
| `TWITCH_DEVELOPER_CLIENT_ID` | Twitch/IGDB client ID | Yes |
| `TWITCH_DEVELOPER_CLIENT_SECRET` | Twitch/IGDB client secret | Yes |
| `FRONTEND_ORIGIN` | Frontend URL for CORS (e.g., `http://localhost:5173`) | Yes |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

## Security Fixes (Pre-Deployment)

The following security issues have been addressed:

### 1. Password Hashing (Fixed)
- **Issue:** Passwords were stored and compared in plaintext
- **Fix:** Added `passlib[bcrypt]` for secure password hashing
- **Files:** `backend/app/core/security.py`, `backend/app/auth/service.py`
- **Migration:** Existing users with plaintext passwords will need to reset passwords or run a rehash script

### 2. HttpOnly JWT Cookie (Fixed)
- **Issue:** JWT token was readable via `document.cookie` (XSS risk)
- **Fix:** Token now set as `httpOnly`, `Secure`, `SameSite=Lax` cookie
- **Files:** `backend/app/auth/router.py`, `backend/app/auth/dependencies.py`, `frontend/src/clients/apiClient.ts`, `frontend/src/hooks/useAuth.ts`
- **Cookie:** Named `token`, 7-day expiry, sent automatically with `withCredentials: true`

### 3. CORS Restriction (Fixed)
- **Issue:** `allow_origins=["*"]` with `allow_credentials=True` (browser rejects this)
- **Fix:** CORS now uses `FRONTEND_ORIGIN` environment variable
- **Files:** `backend/app/main.py`, `backend/app/config.py`

### 4. IGDB Token Auto-Renewal (Fixed)
- **Issue:** Static `IGDB_ACCESS_TOKEN` expired every ~60 days, required manual regeneration
- **Fix:** Token fetched automatically from Twitch OAuth, cached in memory with expiry tracking, auto-refreshed before expiry
- **Files:** `backend/app/games/igdbService.py`, `backend/app/config.py`
- **Removed:** `IGDB_ACCESS_TOKEN` from required environment variables

## Development Setup

### Backend

```bash
cd backend
uv sync
# Create .env from .env.example and fill in values
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
# Create .env with VITE_API_BASE_URL
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user (sets httpOnly cookie)
- `POST /auth/login` - Login user (sets httpOnly cookie)
- `POST /auth/logout` - Logout user (clears cookie)

### Games
- `GET /games/search?title={title}` - Search games via IGDB
- `GET /games/{game_id}` - Get game details

### Entries
- `GET /entry` - Get user's entries (requires auth)
- `POST /entry` - Create entry (requires auth)
- `PUT /entry/{entry_id}` - Update entry (requires auth)
- `DELETE /entry/{entry_id}` - Delete entry (requires auth)

## License

MIT