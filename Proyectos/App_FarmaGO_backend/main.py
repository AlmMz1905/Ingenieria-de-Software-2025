import uvicorn  # El servidor
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware  # ¡Importante para CORS!
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel # Para validación de datos

# --- Configuración de Base de Datos (SQLAlchemy) ---

# Reemplazá esto con tus datos de PostgreSQL
DATABASE_URL = "postgresql://postgres:12345678@localhost/farmago_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Modelos (Pydantic) ---
# Pydantic define la "forma" de los datos que entran y salen de la API

class UserCreate(BaseModel):
    email: str
    password: str
    nombre: str
    rol: str = "Usuario"

class UserOut(BaseModel):
    id: int
    email: str
    nombre: str
    rol: str

    class Config:
        orm_mode = True # Permite que Pydantic lea desde el modelo de SQLAlchemy

# --- Dependencia de BD ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Creación de la App (FastAPI) ---
app = FastAPI(
    title="API de FarmaGo+",
    description="Backend para la aplicación de gestión de farmacias."
)

# --- Configuración de CORS ---
# ¡ESTO ES CRÍTICO!
# Permite que tu app de React (que corre en localhost:5173)
# hable con tu backend (que corre en localhost:8000).

origins = [
    "http://localhost:5173",  # El puerto de Vite/React
    "http://localhost:3000",  # Por si acaso
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],
)

# --- Endpoints de la API ---

@app.get("/api/v1/test")
def get_test_message():
    """
    Endpoint de prueba para verificar que el backend y frontend se conectan.
    """
    return {"message": "¡El Backend está conectado y funcionando!"}

@app.post("/api/v1/users/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo usuario.
    (Falta la parte de hashear la contraseña)
    """
    # ¡Importante! Acá faltaría hashear (encriptar) user.password
    # antes de guardarlo en la BD. (Usando `passlib`)

    # TODO: Hashear la contraseña
    hashed_password = f"hashed_{user.password}" # Placeholder

    # Importá tu modelo de `models.py`
    from models import User

    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        nombre=user.nombre,
        rol=user.rol
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Punto de entrada para Uvicorn ---
if __name__ == "__main__":
    # Esto te permite correr el script con `python main.py`
    # aunque lo recomendado es `uvicorn main:app --reload`
    
    # Crea las tablas en la BD si no existen
    # (¡Importante! Necesita que los modelos estén importados)
    import models
    Base.metadata.create_all(bind=engine)
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
