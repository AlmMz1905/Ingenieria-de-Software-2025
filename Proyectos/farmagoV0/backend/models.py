from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, Enum, ForeignKey, Table, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
from datetime import datetime
import enum

recipe_medication_association = Table(
    'recipe_medicamentos',
    Base.metadata,
    Column('id_receta', Integer, ForeignKey('recetas.id_receta')),
    Column('id_medicamento', Integer, ForeignKey('medicamentos.id_medicamento'))
)

order_medication_association = Table(
    'pedido_medicamentos',
    Base.metadata,
    Column('id_pedido', Integer, ForeignKey('pedidos.id_pedido')),
    Column('id_medicamento', Integer, ForeignKey('medicamentos.id_medicamento'))
)

class Usuario(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    contraseña = Column(String(255), nullable=False)
    telefono = Column(String(20), nullable=True)
    direccion = Column(String(255), nullable=True)
    tipo_usuario = Column(String(50), nullable=False)
    fecha_creacion = Column(DateTime, server_default=func.now())
    
    # --- ¡CAMBIO! ---
    # Sacamos las 'relationships' de acá
    # porque ahora las maneja la herencia
    
    __mapper_args__ = {
        "polymorphic_identity": "usuario",
        "polymorphic_on": tipo_usuario,
    }

# --- ¡¡¡CAMBIO CLAVE!!! ¡Hereda de 'Usuario', no de 'Base'! ---
class Cliente(Usuario):
    __tablename__ = "clientes"
    
    # --- ¡CAMBIO! ---
    # Sacamos el id_usuario porque lo hereda del padre
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), primary_key=True)
    dni = Column(String(20), unique=True, nullable=False, index=True)
    fecha_nacimiento = Column(Date, nullable=True)
    obra_social = Column(String(100), nullable=True)
    
    # Relationships
    # Sacamos la 'relationship' a 'Usuario'
    recetas = relationship("Receta", back_populates="cliente", cascade="all, delete-orphan")
    pedidos = relationship("Pedido", back_populates="cliente", cascade="all, delete-orphan")
    
    __mapper_args__ = {
        "polymorphic_identity": "cliente",
    }

# --- ¡¡¡CAMBIO CLAVE!!! ¡Hereda de 'Usuario', no de 'Base'! ---
class Farmacia(Usuario):
    __tablename__ = "farmacias"
    
    # --- ¡CAMBIO! ---
    # Sacamos el id_usuario porque lo hereda del padre
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), primary_key=True)
    nombre_comercial = Column(String(150), nullable=False)
    cuit = Column(String(20), unique=True, nullable=False, index=True)
    horario_apertura = Column(String(5), nullable=True)  # HH:MM
    horario_cierre = Column(String(5), nullable=True)    # HH:MM
    latitud = Column(Float, nullable=True)
    longitud = Column(Float, nullable=True)
    
    # Relationships
    # Sacamos la 'relationship' a 'Usuario'
    stocks = relationship("StockMedicamento", back_populates="farmacia", cascade="all, delete-orphan")
    pedidos = relationship("Pedido", back_populates="farmacia", cascade="all, delete-orphan")
    
    __mapper_args__ = {
        "polymorphic_identity": "farmacia",
    }
# --- FIN DE LOS CAMBIOS ---

class Medicamento(Base):
    __tablename__ = "medicamentos"
    
    id_medicamento = Column(Integer, primary_key=True, index=True)
    nombre_comercial = Column(String(150), nullable=False, index=True)
    principio_activo = Column(String(150), nullable=False)
    presentacion = Column(String(255), nullable=False)
    requiere_receta = Column(Boolean, default=False)
    laboratorio = Column(String(100), nullable=False)
    categoria = Column(String(100), nullable=False, index=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    
    # Relationships
    stocks = relationship("StockMedicamento", back_populates="medicamento", cascade="all, delete-orphan")
    recetas = relationship("Receta", secondary=recipe_medication_association, back_populates="medicamentos")
    pedidos = relationship("Pedido", secondary=order_medication_association, back_populates="medicamentos")

class StockMedicamento(Base):
    __tablename__ = "stock_medicamentos"
    
    id_stock = Column(Integer, primary_key=True, index=True)
    id_farmacia = Column(Integer, ForeignKey("farmacias.id_usuario"), nullable=False, index=True)
    id_medicamento = Column(Integer, ForeignKey("medicamentos.id_medicamento"), nullable=False, index=True)
    precio = Column(Float, nullable=False)
    cantidad_disponible = Column(Integer, nullable=False, default=0)
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    farmacia = relationship("Farmacia", back_populates="stocks")
    medicamento = relationship("Medicamento", back_populates="stocks")

class Receta(Base):
    __tablename__ = "recetas"
    
    id_receta = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_usuario"), nullable=False, index=True)
    fecha_emision = Column(DateTime, server_default=func.now())
    medico = Column(String(150), nullable=False)
    imagen_receta = Column(String(255), nullable=True)
    validada = Column(Boolean, default=False)
    
    # Relationships
    cliente = relationship("Cliente", back_populates="recetas")
    medicamentos = relationship("Medicamento", secondary=recipe_medication_association, back_populates="recetas")
    detalles = relationship("DetalleReceta", back_populates="receta", cascade="all, delete-orphan")

class DetalleReceta(Base):
    __tablename__ = "detalle_recetas"
    
    id_detalle = Column(Integer, primary_key=True, index=True)
    id_receta = Column(Integer, ForeignKey("recetas.id_receta"), nullable=False)
    id_medicamento = Column(Integer, ForeignKey("medicamentos.id_medicamento"), nullable=False)
    cantidad_prescripta = Column(Integer, nullable=False)
    dosis = Column(String(255), nullable=False)
    
    # Relationships
    receta = relationship("Receta", back_populates="detalles")

class EstadoPedido(str, enum.Enum):
    pendiente = "pendiente"
    confirmado = "confirmado"
    entregado = "entregado"
    cancelado = "cancelado"

class Pedido(Base):
    __tablename__ = "pedidos"
    
    id_pedido = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_usuario"), nullable=False, index=True)
    id_farmacia = Column(Integer, ForeignKey("farmacias.id_usuario"), nullable=False, index=True)
    fecha_pedido = Column(DateTime, server_default=func.now())
    estado = Column(String(50), default="pendiente", index=True)
    metodo_pago = Column(String(50), nullable=False)
    total = Column(Float, nullable=False)
    
    # Relationships
    cliente = relationship("Cliente", back_populates="pedidos")
    farmacia = relationship("Farmacia", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido", cascade="all, delete-orphan")
    medicamentos = relationship("Medicamento", secondary=order_medication_association, back_populates="pedidos")

class DetallePedido(Base):
    __tablename__ = "detalle_pedidos"
    
    id_detalle = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)
    id_medicamento = Column(Integer, ForeignKey("medicamentos.id_medicamento"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    
    # Relationships
    pedido = relationship("Pedido", back_populates="detalles")