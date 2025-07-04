from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app.db.session import get_db
from app.db import schemas # Added import
from app.core import security
from app.core.auth import authenticate_user, sign_up_new_user

auth_router = r = APIRouter()


@r.post("/token", response_model=schemas.Token) # Added response_model
async def login(
    db=Depends(get_db),
    username: str = Form(...),
    password: str = Form(...)
):
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    if user.is_superuser:
        permissions = "admin"
    else:
        permissions = "user"
    access_token = security.create_access_token(
        data={"sub": user.email, "permissions": permissions},
        expires_delta=access_token_expires,
    )
    return schemas.Token(access_token=access_token, token_type="bearer")


@r.post("/signup")
async def signup(
    db=Depends(get_db),
    username: str = Form(...),
    password: str = Form(...)
):
    user = sign_up_new_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Account already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"message": "User created successfully"}
