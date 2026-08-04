from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware as CorsMiddleware
from app.database import Base, engine
from app.auth.router import router as auth_router
from app.movies.route import router as movies_router
from app.games.route import router as games_router
from app.entry.route import router as entry_router

# Base.metadata.create_all(bind=engine)
app = FastAPI(title="TrackIt", version="0.1.0")

app.include_router(auth_router)
app.include_router(movies_router)
app.include_router(games_router)
app.include_router(entry_router)

app.add_middleware(
    CorsMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
