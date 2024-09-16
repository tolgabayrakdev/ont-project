from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from app.schema.user_schema import UserUpdate, PasswordChange
from app.service.user_service import UserService
from app.depends.authenticated_user import authenticated_user

router = APIRouter()


@router.put("/profile")
def update_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    updated_user = UserService.update_profile(db, current_user["id"], user_update)
    if updated_user:
        return {"message": "Profile updated successfully"}
    raise HTTPException(status_code=404, detail="User not found")


@router.put("/change-password")
def change_password(
    password_change: PasswordChange,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    if UserService.change_password(db, current_user["id"], password_change):
        return {"message": "Password changed successfully"}
    raise HTTPException(status_code=400, detail="Invalid current password")


@router.delete("/delete-account")
def delete_account(
    current_user: dict = Depends(authenticated_user), db: Session = Depends(get_db)
):
    if UserService.delete_account(db, current_user["id"]):
        return {"message": "Account deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")


@router.put("/update-photo")
async def update_photo(
    file: UploadFile = File(...),
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    updated_user = await UserService.update_photo(db, current_user["id"], file)
    return {
        "message": "Photo updated successfully",
        "image_url": updated_user.image_url,
    }


@router.delete("/delete-photo")
def delete_photo(
    current_user: dict = Depends(authenticated_user), db: Session = Depends(get_db)
):
    updated_user = UserService.delete_photo(db, current_user["id"])
    return {"message": "Photo deleted successfully"}
