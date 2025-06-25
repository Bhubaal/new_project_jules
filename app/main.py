from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import settings
# Import your models here when you create them
# from .models import Base as AppBase # Assuming your models' Base is named AppBase

# SQLAlchemy setup
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Create database tables
# This is a simple way to ensure tables are created based on your models.
# For production, you'd typically use migrations (like Alembic).
# AppBase.metadata.create_all(bind=engine) # Uncomment when you have models

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    # You can add more FastAPI app configurations here
    # openapi_url="/api/v1/openapi.json",
    # docs_url="/docs",
    # redoc_url="/redoc"
)

@app.on_event("startup")
async def startup_event():
    """
    Actions to perform on application startup.
    For example, creating database tables (if not using migrations extensively for this).
    """
    # Note: Calling create_all() here is generally for development or simple apps.
    # For production, Alembic or another migration tool is recommended.
    # If you have models in app.models.Base, uncomment the following lines:
    # from .models import Base as ModelsBase # Ensure your models use this Base
    # ModelsBase.metadata.create_all(bind=engine)
    print("Application startup: Database tables check/creation (if models are defined and uncommented).")
    pass

@app.get("/")
async def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} v{settings.PROJECT_VERSION}"}

# Placeholder for database dependency - to be used in your routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# You will import and include your routers here
# from .routes import items_router, users_router # Example
# app.include_router(users_router.router, prefix="/users", tags=["users"])
# app.include_router(items_router.router, prefix="/items", tags=["items"])


if __name__ == "__main__":
    import uvicorn
    # This is for running the app directly with Uvicorn, useful for development.
    # For production, you might use Gunicorn or another ASGI server.
    uvicorn.run(app, host="0.0.0.0", port=8000)
