from sqlalchemy.orm import Session
from ..model import Interest, UserInterest
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.schema.interest_schema import InterestCreate, InterestUpdate


class InterestService:

    @staticmethod
    def add_user_interest(db: Session, user_id: int, interest_id: int):
        try:
            user_interest = UserInterest(user_id=user_id, interest_id=interest_id)
            db.add(user_interest)
            db.commit()
            db.refresh(user_interest)
            return user_interest
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def remove_user_interest(db: Session, user_id: int, interest_id: int):
        try:
            user_interest = (
                db.query(UserInterest)
                .filter(
                    UserInterest.user_id == user_id,
                    UserInterest.interest_id == interest_id,
                )
                .first()
            )
            if not user_interest:
                raise HTTPException(status_code=404, detail="User interest not found")
            db.delete(user_interest)
            db.commit()
            return user_interest
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_interest_by_id(db: Session, interest_id: int):
        try:
            interest = db.query(Interest).filter(Interest.id == interest_id).first()
            if not interest:
                raise HTTPException(status_code=404, detail="Interest not found")
            return interest
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_all_interests(db: Session):
        try:
            interests = db.query(Interest).all()
            return interests
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )
