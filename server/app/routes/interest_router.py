from fastapi import APIRouter, Depends, Body
from app.service.interest_service import InterestService
from sqlalchemy.orm import Session
from ..database import get_db
from app.schema.interest_schema import InterestCreate, InterestUpdate
from app.depends.authenticated_user import authenticated_user
from typing import List

router = APIRouter()

@router.get("/all")
async def get_interests(current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),):
    return InterestService.get_all_interests(db)

@router.get("/")
async def get_user_interests(current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),):
    return InterestService.get_user_interests(db, current_user["id"])

@router.post("/")
async def update_interests(
    interest_ids: List[int] = Body(..., embed=True),
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return InterestService.update_user_interests(db, current_user["id"], interest_ids)