from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schema.post_schema import PostCreate, PostUpdate
from ..service.post_service import PostService
from ..database import get_db
from app.depends.authenticated_user import authenticated_user

router = APIRouter()


@router.post("/")
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(authenticated_user),
):
    # Kullanıcının ilgi alanını kontrol et
    if not PostService.check_user_interest(db, current_user["id"], post.interest_id):
        raise HTTPException(status_code=400, detail="First you need to select this field from the interests tab")
    return PostService.create_post(db, post, current_user["id"])


@router.get("/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = PostService.get_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/")
def read_posts(db: Session = Depends(get_db)):
    return PostService.get_all_posts(db)


@router.put("/{post_id}")
def update_post(
    post_id: int,
    post: PostUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(authenticated_user),
):
    updated_post = PostService.update_post(db, post_id, post, current_user["id"])
    if updated_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated_post


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(authenticated_user),
):
    success = PostService.delete_post(db, post_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}
