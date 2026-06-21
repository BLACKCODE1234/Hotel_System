import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from router.admin_router import router as admin_router
from router.auth_router import router as auth_router
from router.booking_router import router as booking_router
from router.hotel_router import router as hotel_router
from router.otp_router import router as otp_router
from router.payment_router import router as payment_router
from router.room_router import router as room_router
from router.staff_router import router as staff_router
from router.user_router import router as user_router

load_dotenv()

frontend_origins = os.getenv("FRONTEND_ORIGINS", "")
allowed_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]
if "*" in allowed_origins:
    allowed_origins = ["http://localhost:3000"]

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Hotel System API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(HTTPException)
async def http_exception_handler(_request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(content=exc.detail, status_code=exc.status_code)
    return JSONResponse(content={"message": exc.detail}, status_code=exc.status_code)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Set-Cookie"],
)

app.include_router(otp_router)
app.include_router(auth_router)
app.include_router(booking_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(payment_router)
app.include_router(room_router)
app.include_router(hotel_router)
app.include_router(staff_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
