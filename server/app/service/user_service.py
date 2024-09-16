from sqlalchemy.orm import Session
from ..model import User
from app.schema.user_schema import UserUpdate, PasswordChange
from app.util.helper import Helper
from fastapi import UploadFile, HTTPException
import os
import uuid

helper = Helper()


class UserService:
    @staticmethod
    def update_profile(db: Session, user_id: int, user_update: UserUpdate):
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            for key, value in user_update.model_dump(exclude_unset=True).items():
                setattr(user, key, value)
            db.commit()
            db.refresh(user)
        return user

    @staticmethod
    def change_password(db: Session, user_id: int, password_change: PasswordChange):
        user = db.query(User).filter(User.id == user_id).first()
        if user and helper.match_hash_text(
            str(user.password), password_change.current_password
        ):
            user.password = helper.generate_hash_password(password_change.new_password) # type: ignore
            db.commit()
            return True
        return False

    @staticmethod
    def delete_account(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            return True
        return False

    @staticmethod
    async def update_photo(db: Session, user_id: int, file: UploadFile):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Dosya uzantısını kontrol et ve sadece izin verilen uzantılara izin ver
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
        file_extension = os.path.splitext(file.filename)[1].lower() if file.filename else ""
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid file type")

        # Benzersiz bir dosya adı oluştur
        filename = f"{uuid.uuid4()}{file_extension}"

        # Uploads klasörünün varlığını kontrol et ve yoksa oluştur
        upload_dir = "uploads"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Dosyayı kaydet
        file_path = os.path.join(upload_dir, filename)
        try:
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

        # Kullanıcının eski fotoğrafını sil (eğer varsa)
        if user.image_url: # type: ignore
            old_file_path = user.image_url.replace("/uploads/", "uploads/")
            if os.path.exists(old_file_path):
                try:
                    os.remove(old_file_path)
                except Exception as e:
                    print(f"Failed to delete old file: {str(e)}")

        # Kullanıcının image_url'ini güncelle
        user.image_url = f"/uploads/{filename}" # type: ignore
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def delete_photo(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.image_url: # type: ignore
            # Dosyayı sil
            file_path = user.image_url.replace("/media/", "uploads/")
            if os.path.exists(file_path):
                os.remove(file_path)

            # Kullanıcının image_url'ini temizle
            user.image_url = None # type: ignore
            db.commit()
            db.refresh(user)

        return user