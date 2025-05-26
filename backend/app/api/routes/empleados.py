import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Empleado, EmpleadoCreate, EmpleadoPublic, EmpleadosPublic, EmpleadoUpdate, Message, Sexo

router = APIRouter(prefix="/empleados", tags=["empleados"])


@router.get("/", response_model=EmpleadosPublic)
def read_empleados(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve empleados.
    """

    count_statement = select(func.count()).select_from(Empleado)
    count = session.exec(count_statement).one()
    statement = select(Empleado, Sexo).join(Sexo).offset(skip).limit(limit)
    empleados = session.exec(statement).all()
    final_empleados = [EmpleadoPublic(**empleado.model_dump(), nombre_sexo=sexo.nombre_sexo) for empleado, sexo in empleados]

    return EmpleadosPublic(data=final_empleados, count=count)


@router.get("/{id}", response_model=EmpleadoPublic)
def read_empleado(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get empleado by ID.
    """
    stmt = select(Empleado, Sexo).join(Sexo).where(Empleado.id == id)
    # empleado = session.get(Empleado, id)
    empleado, sexo = session.exec(stmt).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="empleado not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return EmpleadoPublic(**empleado.model_dump(), nombre_sexo=sexo.nombre_sexo)


@router.post("/", response_model=EmpleadoPublic)
def create_empleado(
    *, session: SessionDep, current_user: CurrentUser, empleado_in: EmpleadoCreate
) -> Any:
    """
    Create new empleado.
    """
    empleado = Empleado.model_validate(empleado_in, update={"owner_id": current_user.id})
    session.add(empleado)
    session.commit()
    session.refresh(empleado)
    sexo = session.get(Sexo, empleado.id_sexo)
    return EmpleadoPublic(**empleado.model_dump(), nombre_sexo=sexo.nombre_sexo)


@router.put("/{id}", response_model=EmpleadoPublic)
def update_empleado(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    empleado_in: EmpleadoUpdate,
) -> Any:
    """
    Update an Empleado.
    """
    empleado = session.get(Empleado, id)
    if not empleado:
        raise HTTPException(status_code=404, detail="empleado not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = empleado_in.model_dump(exclude_unset=True)
    empleado.sqlmodel_update(update_dict)
    session.add(empleado)
    session.commit()
    session.refresh(empleado)

    sexo = session.get(Sexo, empleado.id_sexo)
    return EmpleadoPublic(**empleado.model_dump(), nombre_sexo=sexo.nombre_sexo)


@router.delete("/{id}")
def delete_empleado(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an empleado.
    """
    empleado = session.get(Empleado, id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(empleado)
    session.commit()
    return Message(message="Empleado deleted successfully")
