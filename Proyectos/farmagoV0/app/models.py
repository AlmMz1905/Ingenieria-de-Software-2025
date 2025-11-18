from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, Enum, DECIMAL, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from app.database import Base

class EstadoPedido(str, enum.Enum):
    """Estados posibles de un pedido"""
    PENDIENTE = "pendiente"
    CONFIRMADO = "confirmado"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"

# ============= USUARIO (HERENCIA) =============

class Usuario(Base):
    """Clase base abstracta para usuarios"""
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50), nullable=False)  # Cliente, Farmacia
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    contrasena = Column(String(255), nullable=False)
    telefono = Column(String(20), nullable=True)
    direccion = Column(Text, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    
    __mapper_args__ = {
        "polymorphic_identity": "usuario",
        "polymorphic_on": tipo
    }
    
    # Relaciones
    cliente = relationship("Cliente", uselist=False, back_populates="usuario", foreign_keys="Cliente.id_usuario")
    farmacia = relationship("Farmacia", uselist=False, back_populates="usuario", foreign_keys="Farmacia.id_usuario")

class Cliente(Base):
    """Modelo para clientes"""
    __tablename__ = "clientes"
    
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), primary_key=True)
    dni = Column(String(20), unique=True, nullable=False, index=True)
    fecha_nacimiento = Column(DateTime, nullable=True)
    obra_social = Column(String(100), nullable=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "cliente"
    }
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="cliente", foreign_keys=[id_usuario])
    recetas = relationship("Receta", back_populates="cliente", cascade="all, delete-orphan")
    pedidos = relationship("Pedido", back_populates="cliente", cascade="all, delete-orphan")

class Farmacia(Base):
    """Modelo para farmacias"""
    __tablename__ = "farmacias"
    
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), primary_key=True)
    nombre_comercial = Column(String(150), nullable=False, index=True)
    cuit = Column(String(20), unique=True, nullable=False)
    horario_apertura = Column(String(5), nullable=False)  # Formato HH:MM
    horario_cierre = Column(String(5), nullable=False)    # Formato HH:MM
    latitud = Column(Numeric(10, 8), nullable=True)
    longitud = Column(Numeric(11, 8), nullable=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "farmacia"
    }
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="farmacia", foreign_keys=[id_usuario])
    stocks = relationship("StockMedicamento", back_populates="farmacia", cascade="all, delete-orphan")
    pedidos = relationship("Pedido", back_populates="farmacia", cascade="all, delete-orphan")

# ============= MEDICAMENTO Y STOCK =============

class Medicamento(Base):
    """Modelo para medicamentos"""
    __tablename__ = "medicamentos"
    
    id_medicamento = Column(Integer, primary_key=True, index=True)
    nombre_comercial = Column(String(150), nullable=False, index=True)
    principio_activo = Column(String(150), nullable=False)
    presentacion = Column(String(150), nullable=False)  # ej: comprimidos 500mg x10
    requiere_receta = Column(Boolean, default=False)
    laboratorio = Column(String(100), nullable=False)
    categoria = Column(String(100), nullable=False, index=True)  # analgésico, antibiótico, etc.
    fecha_creacion = Column(DateTime, server_default=func.now())
    
    # Relaciones
    stocks = relationship("StockMedicamento", back_populates="medicamento", cascade="all, delete-orphan")
    detalles_receta = relationship("DetalleReceta", back_populates="medicamento", cascade="all, delete-orphan")
    detalles_pedido = relationship("DetallePedido", back_populates="medicamento", cascade="all, delete-orphan")

class StockMedicamento(Base):
    """Clase intermedia: Stock de medicamentos por farmacia"""
    __tablename__ = "stock_medicamentos"
    
    id_stock = Column(Integer, primary_key=True, index=True)
    id_farmacia = Column(Integer, ForeignKey("farmacias.id_usuario"), nullable=False, index=True)
    id_medicamento = Column(Integer, ForeignKey("medicamentos.id_medicamento"), nullable=False, index=True)
    precio = Column(DECIMAL(10, 2), nullable=False)
    cantidad_disponible = Column(Integer, default=0, nullable=False)
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    farmacia = relationship("Farmacia", back_populates="stocks")
    medicamento = relationship("Medicamento", back_populates="stocks")

# ============= RECETA =============

class Receta(Base):
    """Modelo para recetas"""
    __tablename__ = "recetas"
    
    id_receta = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_usuario"), nullable=False, index=True)
    fecha_emision = Column(DateTime, nullable=False)
    medico = Column(String(150), nullable=False)
    imagen_receta = Column(Text, nullable=True)  # Ruta o datos en base64
    validada = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, server_default=func.now())
    
    # Relaciones
    cliente = relationship("Cliente", back_populates="recetas")
    detalles = relationship("DetalleReceta", back_populates="receta", cascade="all, delete-orphan")

class DetalleReceta(Base):
    """Clase intermedia: Detalles de medicamentos en receta"""
    __tablename__ = "detalles_receta"
    
    id_detalle = Column(Integer, primary_key=True, index=True)
    id_receta = Column(Integer, ForeignKey("recetas.id_receta"), nullable=False, index=True)
    id_medicamento = Column(Integer, ForeignKey("medicamentos.id_medicamento"), nullable=False, index=True)
    cantidad_prescripta = Column(Integer, nullable=False)
    dosis = Column(String(200), nullable=False)
    
    # Relaciones
    receta = relationship("Receta", back_populates="detalles")
    medicamento = relationship("Medicamento", back_populates="detalles_receta")

# ============= PEDIDO =============

class Pedido(Base):
    """Modelo para pedidos"""
    __tablename__ = "pedidos"
    
    id_pedido = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_usuario"), nullable=False, index=True)
    id_farmacia = Column(Integer, ForeignKey("farmacias.id_usuario"), nullable=False, index=True)
    fecha_pedido = Column(DateTime, server_default=func.now())
    estado = Column(Enum(EstadoPedido), default=EstadoPedido.PENDIENTE, nullable=False, index=True)
    metodo_pago = Column(String(50), nullable=False)  # tarjeta, transferencia, efectivo
    total = Column(DECIMAL(10, 2), nullable=False)
    fecha_entrega_estimada = Column(DateTime, nullable=True)
    
    # Relaciones
    cliente = relationship("Cliente", back_populates="pedidos")
    farmacia = relationship("Farmacia", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido", cascade="all, delete-orphan")

class DetallePedido(Base):
    """Clase intermedia: Detalles de medicamentos en pedido"""
    __tablename__ = "detalles_pedido"
    
    id_detalle = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False, index=True)
    id_medicamento = Column(Integer, ForeignKey("medicamentos.id_medicamento"), nullable=False, index=True)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(DECIMAL(10, 2), nullable=False)
    
    # Relaciones
    pedido = relationship("Pedido", back_populates="detalles")
    medicamento = relationship("Medicamento", back_populates="detalles_pedido")
