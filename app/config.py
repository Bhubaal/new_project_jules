import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
# For async database connection, if you plan to use it:
# ASYNC_DATABASE_URL = os.getenv("ASYNC_DATABASE_URL", "sqlite+aiosqlite:///./test.db")

# You can add other configurations here, e.g., API keys, secret keys, etc.
# SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Settings:
    PROJECT_NAME: str = "FastAPI Application"
    PROJECT_VERSION: str = "0.1.0"
    DATABASE_URL: str = DATABASE_URL
    # ASYNC_DATABASE_URL: str = ASYNC_DATABASE_URL # Uncomment if using async

settings = Settings()
