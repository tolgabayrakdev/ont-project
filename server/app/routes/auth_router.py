from fastapi import APIRouter, Response, Request, HTTPException, Depends
from app.service.auth_service import AuthenticationService
from app.schema.authentication_schema import LoginUser, RegisterUser
from sqlalchemy.orm import Session
from ..database import get_db
import jwt
from app.util.helper import Helper
from app.depends.authenticated_user import authenticated_user
from typing import Dict

router = APIRouter()
helper = Helper()


@router.post("/login")
async def login(user: LoginUser, response: Response, db: Session = Depends(get_db)):
    result = AuthenticationService.login(
        email=user.email, password=user.password, db=db
    )
    response.set_cookie(key="access_token", value=result["access_token"], httponly=True)
    response.set_cookie(
        key="refresh_token", value=result["refresh_token"], httponly=True
    )
    return {"message": "Login is successful."}


@router.post("/register", status_code=201)
async def register(user: RegisterUser, db: Session = Depends(get_db)):
    return AuthenticationService.register(payload=user, db=db)


@router.get("/private")
async def private_route(user=Depends(authenticated_user)):
    return {"message": f"Welcome {user['username']}, this is a private route."}


@router.post("/verify", status_code=200)
async def verify_user(request: Request, db: Session = Depends(get_db)):
    try:
        access_token = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")

        if access_token and refresh_token:
            user_id = helper.decode_jwt(token=access_token)
            result = AuthenticationService.verify_user(user_id, db=db)  # type: ignore

            if result:
                full_image_url = None
                if result.image_url:  # type: ignore
                    image_path = result.image_url
                    full_image_url = f"{request.base_url.scheme}://{request.base_url.netloc}{image_path}"

                return {
                    "success": True,
                    "user": {
                        "username": result.username,
                        "email": result.email,
                        "photo": full_image_url,
                    },
                }
            else:
                raise HTTPException(status_code=404, detail="User not found")
        else:
            raise HTTPException(status_code=401, detail="Unauthorized")

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Access token has expired.")
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=400, detail="Invalid token: " + str(e))


@router.post("/logout")
async def logout(response: Response) -> Dict[str, str]:
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "You are logged out."}
