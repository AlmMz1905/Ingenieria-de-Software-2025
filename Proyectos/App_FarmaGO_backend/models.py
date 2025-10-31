from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

# Base declarativa de SQLAlchemy.
# main.py la importa para crear las tablas.
Base = declarative_base()

class User(Base):
    """
    Define el modelo de la tabla 'users' en la base de datos PostgreSQL.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=True) # Permitimos que sea opcional
    
    rol = Column(String, default="Usuario", nullable=False) # 'Usuario', 'Farmacia', 'Repartidor'
    
    is_active = Column(Boolean, default=True)
    
    # A futuro...
    # foto_url = Column(String, nullable=True)
    # telefono = Column(String, nullable=True)

# --- Otros modelos que vas a necesitar ---

# class Receta(Base):
#     __tablename__ = "recetas"
#     id = Column(Integer, primary_key=True, index=True)
#     ...
#     id_usuario = Column(Integer, ForeignKey("users.id"))
#     usuario = relationship("User", back_populates="recetas")

# class Pedido(Base):
#     __tablename__ = "pedidos"
#     id = Column(Integer, primary_key=True, index=True)
#     ...

# class Farmacia(Base):
#     __tablename__ = "farmacias"
#     id = Column(Integer, primary_key=True, index=True)
#     ...
