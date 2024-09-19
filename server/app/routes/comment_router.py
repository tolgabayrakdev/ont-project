from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.service.comment_service import CommentService
from app.schema.comment_schema import CommentCreate, CommentUpdate
from app.database import get_db
from app.depends.authenticated_user import authenticated_user

router = APIRouter()


@router.post("/posts/{post_id}/comments")
def create_comment(
    post_id: int,
    comment: CommentCreate,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return CommentService.create_comment(db, comment, post_id, current_user["id"])


@router.put("/{comment_id}")
def update_comment(comment_id: int, comment: CommentUpdate, current_user: dict = Depends(authenticated_user), db: Session = Depends(get_db)):
    updated_comment = CommentService.update_comment(db, comment_id, comment, current_user["id"])
    if not updated_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return updated_comment


@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    success = CommentService.delete_comment(db, comment_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"detail": "Comment deleted successfully"}


@router.get("/posts/{post_id}/comments")
def get_comments(post_id: int, db: Session = Depends(get_db)):
    result = CommentService.get_comments_by_post(db, post_id)
    return result  # Yorumları ve sayısını döndür
