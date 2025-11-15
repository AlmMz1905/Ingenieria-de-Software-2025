from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

# ============= ENUMS =============

class EstadoPedidoSchema(str, Enum):
    PENDIENTE = "pendiente"
    CONFIRMADO = "confirmado"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"

# ============= USUARIO =============

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None
    direccion: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contrasena: str

class UsuarioResponse(UsuarioBase):
    id_usuario: int
    tipo: str
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True

# ============= CLIENTE =============

class ClienteBase(UsuarioBase):
    dni: str
    fecha_nacimiento: Optional[datetime] = None
    obra_social: Optional[str] = None

class ClienteCreate(ClienteBase, UsuarioCreate):
    pass

class ClienteResponse(ClienteBase):
    id_usuario: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True

# ============= FARMACIA =============

class FarmaciaBase(UsuarioBase):
    nombre_comercial: str
    cuit: str
    horario_apertura: str
    horario_cierre: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None

class FarmaciaCreate(FarmaciaBase, UsuarioCreate):
    pass

class FarmaciaResponse(FarmaciaBase):
    id_usuario: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True

# ============= MEDICAMENTO =============

class MedicamentoBase(BaseModel):
    nombre_comercial: str
    principio_activo: str
    presentacion: str
    requiere_receta: bool = False
    laboratorio: str
    categoria: str

class MedicamentoCreate(MedicamentoBase):
    pass

class MedicamentoResponse(MedicamentoBase):
    id_medicamento: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True

# ============= STOCK MEDICAMENTO =============

class StockMedicamentoBase(BaseModel):
    precio: float = Field(..., gt=0)
    cantidad_disponible: int = Field(default=0, ge=0)

class StockMedicamentoCreate(StockMedicamentoBase):
    id_medicamento: int

class StockMedicamentoResponse(StockMedicamentoBase):
    id_stock: int
    id_farmacia: int
    id_medicamento: int
    fecha_actualizacion: datetime
    
    class Config:
        from_attributes = True

class StockMedicamentoConDetalles(StockMedicamentoResponse):
    medicamento: MedicamentoResponse

# ============= RECETA =============

class DetalleRecetaBase(BaseModel):
    id_medicamento: int
    cantidad_prescripta: int = Field(..., gt=0)
    dosis: str

class DetalleRecetaCreate(DetalleRecetaBase):
    pass

class DetalleRecetaResponse(DetalleRecetaBase):
    id_detalle: int
    medicamento: MedicamentoResponse
    
    class Config:
        from_attributes = True

class RecetaBase(BaseModel):
    medico: str
    imagen_receta: Optional[str] = None

class RecetaCreate(RecetaBase):
    fecha_emision: datetime
    detalles: List[DetalleRecetaCreate]

class RecetaResponse(RecetaBase):
    id_receta: int
    id_cliente: int
    fecha_emision: datetime
    validada: bool
    fecha_creacion: datetime
    detalles: List[DetalleRecetaResponse]
    
    class Config:
        from_attributes = True

# ============= PEDIDO =============

class DetallePedidoBase(BaseModel):
    id_medicamento: int
    cantidad: int = Field(..., gt=0)

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedidoResponse(DetallePedidoBase):
    id_detalle: int
    precio_unitario: float
    medicamento: MedicamentoResponse
    
    class Config:
        from_attributes = True

class PedidoBase(BaseModel):
    metodo_pago: str

class PedidoCreate(PedidoBase):
    id_farmacia: int
    detalles: List[DetallePedidoCreate]

class PedidoResponse(PedidoBase):
    id_pedido: int
    id_cliente: int
    id_farmacia: int
    fecha_pedido: datetime
    estado: EstadoPedidoSchema
    total: float
    fecha_entrega_estimada: Optional[datetime]
    detalles: List[DetallePedidoResponse]
    
    class Config:
        from_attributes = True

class PedidoUpdate(BaseModel):
    estado: EstadoPedidoSchema
