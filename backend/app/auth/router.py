
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.schemas import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse 
from app.auth.service import AuthService
from app.config import config

router = APIRouter(prefix="/auth", tags=["users"])

def get_auth_service(db: Session = Depends(get_db)):
    return AuthService(db)

COOKIE_NAME = "token"

def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=not config.DEBUG if hasattr(config, 'DEBUG') else True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
        path="/",
    )

def clear_auth_cookie(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        secure=not config.DEBUG if hasattr(config, 'DEBUG') else True,
        samesite="lax",
        path="/",
    )

@router.post("/register", response_model=RegisterResponse)
async def register_user(response: Response, request: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)):
    result = auth_service.register_user(request)
    set_auth_cookie(response, result.token)
    return result

@router.post("/login", response_model=LoginResponse)
async def login_user(response: Response, request: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    result = auth_service.login_user(request)
    set_auth_cookie(response, result.token)
    return result

@router.post("/logout")
async def logout_user(response: Response):
    clear_auth_cookie(response)
    return {"message": "Logged out successfully"}