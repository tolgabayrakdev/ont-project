from sqlalchemy.orm import Session
from app.schema.comment_schema import CommentCreate, CommentUpdate
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from ..model import Comment, User


class CommentService:
    @staticmethod
    def create_comment(db: Session, comment: CommentCreate, post_id: int, user_id: int):
        try:
            db_comment = Comment(**comment.model_dump(), post_id=post_id, author_id=user_id)
            db.add(db_comment)
            db.commit()
            db.refresh(db_comment)
            return db_comment
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def update_comment(db: Session, comment_id: int, comment: CommentUpdate, user_id: int):
        try:
            db_comment = db.query(Comment).filter(Comment.id == comment_id, Comment.author_id == user_id).first()
            if db_comment:
                for key, value in comment.model_dump().items():
                    setattr(db_comment, key, value)
                db.commit()
                db.refresh(db_comment)
                return db_comment
            return None
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def delete_comment(db: Session, comment_id: int, user_id: int):
        try:
            db_comment = db.query(Comment).filter(Comment.id == comment_id, Comment.author_id == user_id).first()
            if not db_comment:
                return False
            db.delete(db_comment)
            db.commit()
            return True
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_comments_by_post(db: Session, post_id: int):
        try:
            comments = db.query(Comment).filter(Comment.post_id == post_id).all()
            formatted_comments = []
            
            for comment in comments:
                author = db.query(User).filter(User.id == comment.author_id).first()  # Yazar bilgilerini al
                formatted_comments.append({
                    "id": comment.id,
                    "content": comment.content,
                    "author": {
                        "username": author.username if author else "Unknown",  # Yazar adı
                        "image_url": author.image_url if author else None,  # Yazar resmi
                    },
                    "created_at": comment.created_at,
                })
            
            return {"comments": formatted_comments, "count": len(formatted_comments)}  # Yorumları ve sayısını döndür
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )