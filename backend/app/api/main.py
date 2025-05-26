from fastapi import APIRouter

from app.api.routes import (
    empleados,
    empresas,
    items,
    login,
    private,
    puestostrabajo,
    sexos,
    users,
    utils,
)
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(sexos.router)
api_router.include_router(empresas.router)
api_router.include_router(empleados.router)
api_router.include_router(puestostrabajo.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
