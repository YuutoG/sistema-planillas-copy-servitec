import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Sexo, SexoPublic, SexosPublic, SexoCreate, SexoUpdate, Message

router = APIRouter(prefix="/sexos", tags=["sexos"])


@router.get("/", response_model=SexosPublic)
def read_sexos(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve sexos.
    """
    count_statement = select(func.count()).select_from(Sexo)
    count = session.exec(count_statement).one()
    statement = select(Sexo).offset(skip).limit(limit)
    sexos = session.exec(statement).all()

    return SexosPublic(data=sexos, count=count)


@router.get("/{id}", response_model=SexoPublic)
def read_sexo(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get sexo by ID.
    """
    sexo = session.get(Sexo, id)
    if not sexo:
        raise HTTPException(status_code=404, detail="Sexo not found")
    return sexo


@router.post("/", response_model=SexoPublic)
def create_sexo(
    *, session: SessionDep, current_user: CurrentUser, sexo_in: SexoCreate
) -> Any:
    """
    Create new sexo.
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    sexo = Sexo.model_validate(sexo_in)
    session.add(sexo)
    session.commit()
    session.refresh(sexo)
    return sexo


@router.put("/{id}", response_model=SexoPublic)
def update_sexo(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    sexo_in: SexoUpdate,
) -> Any:
    """
    Update an sexo.
    """
    sexo = session.get(Sexo, id)
    if not sexo:
        raise HTTPException(status_code=404, detail="Sexo not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = sexo_in.model_dump(exclude_unset=True)
    sexo.sqlmodel_update(update_dict)
    session.add(sexo)
    session.commit()
    session.refresh(sexo)
    return sexo


@router.delete("/{id}")
def delete_sexo(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an sexo.
    """
    sexo = session.get(Sexo, id)
    if not sexo:
        raise HTTPException(status_code=404, detail="Sexo not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(sexo)
    session.commit()
    return Message(message="Sexo deleted successfully")
