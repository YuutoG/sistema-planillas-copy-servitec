import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Empresa, EmpresaCreate, EmpresaPublic, EmpresasPublic, EmpresaUpdate, Message

router = APIRouter(prefix="/empresas", tags=["empresas"])


@router.get("/", response_model=EmpresasPublic)
def read_empresas(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve empresas.
    """

    count_statement = select(func.count()).select_from(Empresa)
    count = session.exec(count_statement).one()
    statement = select(Empresa).offset(skip).limit(limit)
    empresas = session.exec(statement).all()
 
    return EmpresasPublic(data=empresas, count=count)


@router.get("/{id}", response_model=EmpresaPublic)
def read_empresa(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get empresa by ID.
    """
    empresa = session.get(Empresa, id)
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return empresa


@router.post("/", response_model=EmpresaPublic)
def create_empresa(
    *, session: SessionDep, current_user: CurrentUser, empresa_in: EmpresaCreate
) -> Any:
    """
    Create new empresa.
    """
    empresa = Empresa.model_validate(empresa_in, update={"owner_id": current_user.id})
    session.add(empresa)
    session.commit()
    session.refresh(empresa)
    return empresa


@router.put("/{id}", response_model=EmpresaPublic)
def update_empresa(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    empresa_in: EmpresaUpdate,
) -> Any:
    """
    Update an empresa.
    """
    empresa = session.get(Empresa, id)
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = empresa_in.model_dump(exclude_unset=True)
    empresa.sqlmodel_update(update_dict)
    session.add(empresa)
    session.commit()
    session.refresh(empresa)
    return empresa


@router.delete("/{id}")
def delete_empresa(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an empresa.
    """
    empresa = session.get(Empresa, id)
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(empresa)
    session.commit()
    return Message(message="Empresa deleted successfully")
