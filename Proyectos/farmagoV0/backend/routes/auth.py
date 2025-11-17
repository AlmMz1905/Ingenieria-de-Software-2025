from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Usuario, Cliente, Farmacia
from schemas import LoginRequest, TokenResponse, UsuarioCreate, ClienteCreate, FarmaciaCreate
from utils.security import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

router = APIRouter()

class RegisterClienteRequest(BaseModel):
    email: EmailStr
    password: str
    nombre: str = "Cliente"
    apellido: str = "Test"
    dni: str = "12345678"
    telefono: str = None
    direccion: str = None

class RegisterFarmaciaRequest(BaseModel):
    email: EmailStr
    password: str
    nombre: str = "Farmacia"
    apellido: str = "Test"
    nombre_comercial: str
    cuit: str
    telefono: str = None
    direccion: str = None
    horario_apertura: str = "08:00"
    horario_cierre: str = "20:00"
    latitud: float = None
    longitud: float = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    user_type: str
    user: dict

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email and password"""
    user = db.query(Usuario).filter(Usuario.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.contraseña):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña inválidos"
        )
    
    access_token = create_access_token({"sub": str(user.id_usuario), "tipo": user.tipo_usuario})
    
    user_data = {
        "id": user.id_usuario,
        "email": user.email,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "user_type": user.tipo_usuario
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id_usuario,
        "user_type": user.tipo_usuario,
        "user": user_data
    }

@router.post("/register/cliente", response_model=TokenResponse)
def register_cliente(data: RegisterClienteRequest, db: Session = Depends(get_db)):
    """Register a new client"""
    existing_user = db.query(Usuario).filter(Usuario.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )
    
    hashed_password = hash_password(data.password)
    
    # --- ¡CAMBIO CLAVE! ---
    # ¡Creamos UN SOLO objeto Cliente con TODOS los datos!
    new_cliente = Cliente(
        # Campos de Usuario (el "Padre")
        nombre=data.nombre,
        apellido=data.apellido,
        email=data.email,
        contraseña=hashed_password,
        telefono=data.telefono,
        direccion=data.direccion,
        # tipo_usuario="cliente", # SQLAlchemy lo sabe por la herencia
        
        # Campos de Cliente (el "Hijo")
        dni=data.dni,
        fecha_nacimiento=None,
        obra_social=None
    )
    
    # ¡Borramos la lógica vieja de 'new_usuario' y 'new_cliente' separados!
    db.add(new_cliente)
    db.commit()
    db.refresh(new_cliente) # ¡Refrescamos el objeto que SÍ creamos!
    
    # ¡El resto del código ahora usa 'new_cliente' en vez de 'new_usuario'!
    access_token = create_access_token({"sub": str(new_cliente.id_usuario), "tipo": "cliente"})
    user_data = {
        "id": new_cliente.id_usuario,
        "email": new_cliente.email,
        "nombre": new_cliente.nombre,
        "apellido": new_cliente.apellido,
        "user_type": "cliente"
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": new_cliente.id_usuario,
        "user_type": "cliente",
        "user": user_data
    }

@router.post("/register/farmacia", response_model=TokenResponse)
def register_farmacia(data: RegisterFarmaciaRequest, db: Session = Depends(get_db)):
    """Register a new pharmacy"""
    existing_user = db.query(Usuario).filter(Usuario.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )
    
    hashed_password = hash_password(data.password)
    
    # --- ¡CAMBIO CLAVE! ---
    # ¡Creamos UN SOLO objeto Farmacia con TODOS los datos!
    new_farmacia = Farmacia(
        # Campos de Usuario (el "Padre")
        nombre=data.nombre,
        apellido=data.apellido,
        email=data.email,
        contraseña=hashed_password,
        telefono=data.telefono,
        direccion=data.direccion,
        # tipo_usuario="farmacia", # SQLAlchemy lo sabe
        
        # Campos de Farmacia (el "Hijo")
        nombre_comercial=data.nombre_comercial,
        cuit=data.cuit,
        horario_apertura=data.horario_apertura,
        horario_cierre=data.horario_cierre,
        latitud=data.latitud,
        longitud=data.longitud
    )
    
    # ¡Borramos la lógica vieja!
    db.add(new_farmacia)
    db.commit()
    db.refresh(new_farmacia) # ¡Refrescamos el objeto que SÍ creamos!
    
    # ¡El resto del código ahora usa 'new_farmacia'!
    access_token = create_access_token({"sub": str(new_farmacia.id_usuario), "tipo": "farmacia"})
    user_data = {
        "id": new_farmacia.id_usuario,
        "email": new_farmacia.email,
        "nombre": new_farmacia.nombre,
        "apellido": new_farmacia.apellido,
        "user_type": "farmacia"
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": new_farmacia.id_usuario,
        "user_type": "farmacia",
        "user": user_data
    }
