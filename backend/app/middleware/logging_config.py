"""
Logging configuration and setup.
Handles rotating file logs, request logging, and startup/shutdown events.
"""
import logging
import logging.handlers
import sys
from pathlib import Path
from typing import Optional

from app.core.config import settings


def setup_logging() -> logging.Logger:
    """
    Configure application logging with rotating file handlers.
    Returns the root logger instance.
    """
    # Create logs directory if it doesn't exist
    log_dir = Path(settings.LOG_DIR)
    log_dir.mkdir(parents=True, exist_ok=True)

    # Create logger
    logger = logging.getLogger("app")
    logger.setLevel(getattr(logging, settings.LOG_LEVEL))

    # Remove existing handlers
    logger.handlers.clear()

    # Log format
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console handler (always output to console)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, settings.LOG_LEVEL))
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File handler with rotation
    log_file = log_dir / settings.LOG_FILE
    file_handler = logging.handlers.RotatingFileHandler(
        str(log_file),
        maxBytes=settings.LOG_MAX_BYTES,
        backupCount=settings.LOG_BACKUP_COUNT
    )
    file_handler.setLevel(logging.DEBUG)  # Log everything to file
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Error file handler for errors only
    error_log_file = log_dir / "error.log"
    error_handler = logging.handlers.RotatingFileHandler(
        str(error_log_file),
        maxBytes=settings.LOG_MAX_BYTES,
        backupCount=settings.LOG_BACKUP_COUNT
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    logger.addHandler(error_handler)

    return logger


# Get or create logger
logger = setup_logging()


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance for a specific module."""
    return logging.getLogger(f"app.{name}")
