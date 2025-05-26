import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Message,
    PuestosTrabajoPublic,
    PuestoTrabajo,
    PuestoTrabajoCreate,
    PuestoTrabajoPublic,
    PuestoTrabajoUpdate,
)

router = APIRouter(prefix="/puestostrabajo", tags=["puestos"])


@router.get("/", response_model=PuestosTrabajoPublic)
def read_puestos(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Obtener puestos de trabajo.
    """
    count_statement = select(func.count()).select_from(PuestoTrabajo)
    count = session.exec(count_statement).one()
    statement = select(PuestoTrabajo).offset(skip).limit(limit)
    puestostrabajo = session.exec(statement).all()
    return PuestosTrabajoPublic(data=puestostrabajo, count=count)


@router.get("/{id}", response_model=PuestoTrabajoPublic)
def read_puesto(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get Puesto de Trabajo by ID.
    """
    puesto = session.get(PuestoTrabajo, id)
    if not puesto:
        raise HTTPException(status_code=404, detail="Puesto de trabajo no encontrado")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return puesto


@router.post("/", response_model=PuestoTrabajoPublic)
def create_puesto(
    *, session: SessionDep, current_user: CurrentUser, puesto_in: PuestoTrabajoCreate
) -> Any:
    """
    Create un nuevo Puesto.
    """
    puesto = PuestoTrabajo.model_validate(puesto_in)
    session.add(puesto)
    session.commit()
    session.refresh(puesto)
    return puesto


@router.put("/{id}", response_model=PuestoTrabajoPublic)
def update_puesto(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    puesto_in: PuestoTrabajoUpdate,
) -> Any:
    """
    Actualizar un puesto de trabajo.
    """
    puesto = session.get(PuestoTrabajo, id)
    if not puesto:
        raise HTTPException(status_code=404, detail="Puesto de trabajo no encontrado")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = puesto_in.model_dump(exclude_unset=True)
    puesto.sqlmodel_update(update_dict)
    session.add(puesto)
    session.commit()
    session.refresh(puesto)
    return puesto


@router.delete("/{id}")
def delete_puesto(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Eliminar un puesto de trabajo.
    """
    puesto = session.get(PuestoTrabajo, id)
    if not puesto:
        raise HTTPException(status_code=404, detail="Puesto de trabajo no encontrado")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(puesto)
    session.commit()
    return Message(message="Puesto de trabajo borrado con éxito")
