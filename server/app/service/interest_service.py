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
                .join(Interest, UserInterest.interest_id == Interest.id)
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
            return {"message": "Interest removed successfully"}
        except SQLAlchemyError:
            db.rollback()
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

    @staticmethod
    def get_user_interests(db: Session, user_id: int):
        try:
            user_interests = (
                db.query(UserInterest, Interest.id.label('interest_id'), Interest.name)
                .join(Interest, UserInterest.interest_id == Interest.id)
                .filter(UserInterest.user_id == user_id)
                .all()
            )
            return [
                {
                    "id": ui.UserInterest.id,
                    "user_id": ui.UserInterest.user_id,
                    "interest_id": ui.interest_id,
                    "interest_name": ui.name
                }
                for ui in user_interests
            ]
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def update_user_interests(db: Session, user_id: int, interest_ids: list[int]):
        try:
            # Remove all existing user interests
            db.query(UserInterest).filter(UserInterest.user_id == user_id).delete()

            # Add new user interests
            for interest_id in interest_ids:
                user_interest = UserInterest(user_id=user_id, interest_id=interest_id)
                db.add(user_interest)

            db.commit()
            return {"message": "User interests updated successfully"}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )
