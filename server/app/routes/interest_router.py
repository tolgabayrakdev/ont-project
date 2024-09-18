from fastapi import APIRouter, Depends
from app.service.interest_service import InterestService
from sqlalchemy.orm import Session
from ..database import get_db
from app.schema.interest_schema import InterestCreate, InterestUpdate
from app.depends.authenticated_user import authenticated_user


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
async def add_interest(interest: InterestCreate, current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),):
    return InterestService.add_user_interest(db, current_user["id"], interest.id)

@router.delete("/")
async def remove_interest(interest: InterestUpdate, current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),):
    return InterestService.remove_user_interest(db, current_user["id"], interest.id)