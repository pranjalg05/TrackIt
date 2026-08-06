from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.user.model import User
from app.auth.schemas import LoginRequest, RegisterResponse

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        
    def register_user(self, request):
        
        existing_user = self.db.query(User).filter(User.username == request.username).first()
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        hashed_password = hash_password(request.password)
        new_user = User(username=request.username, password=hashed_password)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        user_token = create_access_token(data={"id": new_user.id, "username": new_user.username})
        return RegisterResponse(id=new_user.id, username=new_user.username, token=user_token)
    
    def login_user(self, request: LoginRequest):
        user = self.db.query(User).filter(User.username == request.username).first()
        
        if not user or not verify_password(request.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        user_token = create_access_token(data={"id": user.id, "username": user.username})
        return {"id": user.id, "username": user.username, "token": user_token}
        