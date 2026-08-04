from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrackIt"
    PROJECT_VERSION: str = "0.1.0"
    
    SQLALCHEMY_DATABASE_URL: str
    
    TMDB_IMAGE_BASE: str = "https://image.tmdb.org/t/p/w500"
    
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    TMDB_API_KEY: str
    TMDB_API_READ_ACCESS_TOKEN: str
    
    IGDB_BASE_URL: str = "https://api.igdb.com/v4"
    TWITCH_DEVELOPER_CLIENT_ID: str
    TWITCH_DEVELOPER_CLIENT_SECRET: str
    IGDB_ACCESS_TOKEN: str 
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }
    
config = Settings()
