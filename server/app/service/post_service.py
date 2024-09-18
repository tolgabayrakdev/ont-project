from sqlalchemy.orm import Session
from app.schema.post_schema import PostCreate, PostUpdate
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from ..model import Post, UserInterest, User, Interest


class PostService:
    @staticmethod
    def check_user_interest(db: Session, user_id: int, interest_id: int):
        try:
            user_interest = db.query(UserInterest).filter(
                UserInterest.user_id == user_id,
                UserInterest.interest_id == interest_id
            ).first()
            return user_interest is not None
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def create_post(db: Session, post: PostCreate, user_id: int):
        try:
            db_post = Post(**post.model_dump(), author_id=user_id)
            db.add(db_post)
            db.commit()
            db.refresh(db_post)
            return PostService.format_post(db, db_post)
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_post(db: Session, post_id: int):
        try:
            post = db.query(Post).filter(Post.id == post_id).first()
            if post:
                return PostService.format_post(db, post)
            return None
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_all_posts(db: Session):
        try:
            posts = db.query(Post).all()
            return [PostService.format_post(db, post) for post in posts]
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def update_post(db: Session, post_id: int, post: PostUpdate, user_id: int):
        try:
            db_post = (
                db.query(Post)
                .filter(Post.id == post_id, Post.author_id == user_id)
                .first()
            )
            if db_post:
                for key, value in post.model_dump().items():
                    setattr(db_post, key, value)
                db.commit()
                db.refresh(db_post)
                return PostService.format_post(db, db_post)
            return None
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def delete_post(db: Session, post_id: int, user_id: int):
        try:
            db_post = (
                db.query(Post)
                .filter(Post.id == post_id, Post.author_id == user_id)
                .first()
            )
            if not db_post:
                return False
            db.delete(db_post)
            db.commit()
            return True
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def format_post(db: Session, post: Post):
        user = db.query(User).filter(User.id == post.author_id).first()
        interest = db.query(Interest).filter(Interest.id == post.interest_id).first()
        return {
            "id": post.id,
            "title": post.title,  # Yeni eklenen alan
            "content": post.content,
            "author": {
                "username": user.username if user else "Unknown",
                "image_url": user.image_url if user and user.image_url else None
            },
            "interest_name": interest.name if interest else "Unknown",
            "created_at": post.created_at,
            "updated_at": post.updated_at
        }
