
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.schemas import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse 
from app.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["users"])

def get_auth_service(db: Session = Depends(get_db)):
    return AuthService(db)

@router.post("/register", response_model=RegisterResponse)
async def register_user(request: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register_user(request)

@router.post("/login", response_model=LoginResponse)
async def login_user(request: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login_user(request)