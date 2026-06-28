"""
FastAPI validation utilities for query parameters and path parameters.
"""
from typing import Optional

from fastapi import Query, Path


def pagination_query(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(10, ge=1, le=100, description="Items per page (1-100)")
) -> tuple[int, int]:
    """
    Validate pagination parameters.
    Returns: (page, limit)
    """
    return page, limit


def email_query(email: str = Query(..., regex=r"^[\w\.-]+@[\w\.-]+\.\w+$")) -> str:
    """Validate email query parameter."""
    return email


def phone_query(phone: str = Query(..., regex=r"^\+?1?\d{9,15}$")) -> str:
    """Validate phone number query parameter."""
    return phone


def object_id_path(id: str = Path(..., min_length=24, max_length=24)) -> str:
    """
    Validate MongoDB ObjectId path parameter.
    MongoDB ObjectIds are 24-character hex strings.
    """
    return id


def optional_search_query(
    query: Optional[str] = Query(None, min_length=1, max_length=100),
) -> Optional[str]:
    """Validate optional search query parameter."""
    return query


def city_query(city: Optional[str] = Query(None, min_length=1, max_length=50)) -> Optional[str]:
    """Validate city query parameter."""
    return city


def category_query(
    categoryId: Optional[str] = Query(None, min_length=1, max_length=100)
) -> Optional[str]:
    """Validate category ID query parameter."""
    return categoryId


def brand_query(brand: Optional[str] = Query(None, min_length=1, max_length=100)) -> Optional[str]:
    """Validate brand query parameter."""
    return brand
