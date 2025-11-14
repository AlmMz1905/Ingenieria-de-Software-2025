from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

# Base declarativa de SQLAlchemy.
# main.py la importa para crear las tablas.
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=True)
    rol = Column(String, default="Usuario", nullable=False)
    is_active = Column(Boolean, default=True)


class Producto(Base):
    """Productos disponibles en la farmacia."""
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=True)
    precio = Column(Float, nullable=False, default=0.0)
    descripcion = Column(String, nullable=True)


class Inventario(Base):
    """Registra la cantidad en stock de cada producto."""
    __tablename__ = "inventario"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False, default=0)

    producto = relationship("Producto")


class Pedido(Base):
    """Pedido (orden) realizado por un cliente que procesa la farmacia."""
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    cliente_nombre = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, in-transit, delivered, cancelled, returned
    total = Column(Float, default=0.0)
    creado_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("PedidoItem", back_populates="pedido", cascade="all, delete-orphan")


class PedidoItem(Base):
    """Detalle de cada ítem dentro de un pedido."""
    __tablename__ = "pedido_items"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False, default=1)
    precio_unitario = Column(Float, nullable=False, default=0.0)

    pedido = relationship("Pedido", back_populates="items")
    producto = relationship("Producto")


class Devolucion(Base):
    """Registro de devoluciones asociadas a pedidos."""
    __tablename__ = "devoluciones"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    motivo = Column(String, nullable=True)
    creado_at = Column(DateTime, default=datetime.utcnow)

    pedido = relationship("Pedido")
