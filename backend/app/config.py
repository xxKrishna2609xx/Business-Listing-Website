from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "rightads_db"
    JWT_SECRET: str = "rightads-super-secret-jwt-key-2024"
    JWT_EXPIRE_MINUTES: int = 10080  # 7 days
    ADMIN_EMAIL: str = "admin@rightads.digital"
    ADMIN_PASSWORD: str = "Admin@123"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
