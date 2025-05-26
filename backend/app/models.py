import uuid
from datetime import date, datetime

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class BaseIdentifier(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)


# Catalogo de Sexo
class SexoBase(SQLModel):
    nombre_sexo: str = Field(min_length=0, max_length=10, nullable=False)


class Sexo(SexoBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class SexoPublic(Sexo): ...


# Properties to receive on item creation
class SexoCreate(SexoBase):
    pass


# Properties to receive on item update
class SexoUpdate(SexoBase): ...


class SexosPublic(SQLModel):
    data: list[SexoPublic]
    count: int


# Catálogo de Estado Civil
class EstadoCivilBase(SQLModel):
    nombre_estado_civil: str = Field(min_length=0, max_length=256, nullable=False)


class EstadoCivil(EstadoCivilBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


# Catálogo de puestos de trabajo
class PuestoTrabajoBase(SQLModel):
    nombre_puesto: str = Field(nullable=False, max_length=256)
    descripcion_puesto: str = Field(nullable=True, max_length=512)
    salario_limite_inferior: float = Field(nullable=False)
    salario_limite_superior: float = Field(nullable=False)


class PuestoTrabajo(BaseIdentifier, PuestoTrabajoBase, table=True): ...


class PuestoTrabajoPublic(PuestoTrabajo): ...


class PuestoTrabajoCreate(PuestoTrabajoBase): ...


class PuestoTrabajoUpdate(PuestoTrabajoBase): ...


class PuestosTrabajoPublic(SQLModel):
    data: list[PuestoTrabajoPublic]
    count: int


# Empleado


class EmpleadoBase(SQLModel):
    primer_nombre: str = Field(min_length=0, max_length=256, nullable=False)
    segundo_nombre: str | None = Field(min_length=0, max_length=256, nullable=True)
    primer_apellido: str = Field(min_length=0, max_length=256, nullable=False)
    segundo_apellido: str | None = Field(min_length=0, max_length=256, nullable=True)
    apellido_casada: str | None = Field(min_length=0, max_length=256, nullable=True)
    fecha_nacimiento: date = Field(nullable=False)
    fecha_ingreso: date = Field(nullable=False)
    numero_documento: str = Field(min_length=0, max_length=256, nullable=False)
    numero_nit: str = Field(min_length=0, max_length=256, nullable=False)
    codigo_isss: str = Field(min_length=0, max_length=256, nullable=False)
    codigo_nup: str = Field(min_length=0, max_length=256, nullable=False)
    salario: float = Field(nullable=False)
    id_sexo: uuid.UUID = Field(nullable=False, default=None, foreign_key="sexo.id")


class Empleado(BaseIdentifier, EmpleadoBase, table=True): ...


class EmpleadoCreate(EmpleadoBase): ...


class EmpleadoPublic(Empleado):
    nombre_sexo: str = Field(min_length=0, max_length=10, nullable=False)


class EmpleadoUpdate(EmpleadoBase): ...


class EmpleadosPublic(SQLModel):
    data: list[EmpleadoPublic]
    count: int


# Empresa


class EmpresaBase(SQLModel):
    nombre_empresa: str = Field(min_length=0, max_length=512, nullable=False)
    direccion: str = Field(min_length=0, max_length=512, nullable=False)
    representante_legal: str = Field(min_length=0, max_length=512, nullable=False)
    nit: str = Field(min_length=0, max_length=256, nullable=False)
    nic: str = Field(min_length=0, max_length=256, nullable=False)
    telefono: str = Field(min_length=0, max_length=256, nullable=False)
    pagina_web: str = Field(min_length=0, max_length=256, nullable=False)
    correo_electronico: str = Field(min_length=0, max_length=256, nullable=False)


class Empresa(BaseIdentifier, EmpresaBase, table=True): ...


class EmpresaCreate(EmpresaBase): ...


class EmpresaPublic(Empresa): ...


class EmpresaUpdate(EmpresaBase): ...


class EmpresasPublic(SQLModel):
    data: list[EmpresaPublic]
    count: int


# Unidad Organizacional
class UnidadOrganizacionalBase(SQLModel):
    nombre_unidad_organizacional: str = Field(
        min_length=0, max_length=256, nullable=False
    )
    tipo_unidad_organizacional: str = Field(
        min_length=0, max_length=256, nullable=False
    )
    empresa_id: str = Field(nullable=False, foreign_key="empresa.id")
    empresa: Empresa = Relationship(back_populates="empresa")
