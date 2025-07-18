from fastapi import FastAPI, Depends
from starlette.requests import Request
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.api_v1.routers.users import users_router
from app.api.api_v1.routers.auth import auth_router
from app.api.api_v1.routers.leaves import leaves_router
from app.api.api_v1.routers.wfh import wfh_router
from app.core import config
from app.db.session import SessionLocal, engine, Base
from app.core.auth import get_current_active_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api", lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get("/api/v1")
async def root():
    return {"message": "Hello World"}


# Routers
app.include_router(
    users_router,
    prefix="/api/v1",
    tags=["users"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(
    leaves_router,
    prefix="/api/v1",
    tags=["leaves"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    wfh_router,
    prefix="/api/v1",
    tags=["wfh"],
    dependencies=[Depends(get_current_active_user)],
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
