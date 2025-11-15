from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None
    direccion: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contraseña: str

class UsuarioResponse(UsuarioBase):
    id_usuario: int
    fecha_creacion: datetime
    
    class Config:
        from_attributes = True

class ClienteCreate(UsuarioCreate):
    dni: str
    fecha_nacimiento: Optional[date] = None
    obra_social: Optional[str] = None

class ClienteResponse(UsuarioResponse):
    dni: str
    fecha_nacimiento: Optional[date]
    obra_social: Optional[str]

class FarmaciaCreate(UsuarioCreate):
    nombre_comercial: str
    cuit: str
    horario_apertura: Optional[str] = None
    horario_cierre: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None

class FarmaciaResponse(UsuarioResponse):
    nombre_comercial: str
    cuit: str
    horario_apertura: Optional[str]
    horario_cierre: Optional[str]
    latitud: Optional[float]
    longitud: Optional[float]

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
    
    class Config:
        from_attributes = True

class StockMedicamentoBase(BaseModel):
    precio: float
    cantidad_disponible: int

class StockMedicamentoCreate(StockMedicamentoBase):
    id_medicamento: int

class StockMedicamentoResponse(StockMedicamentoBase):
    id_stock: int
    id_farmacia: int
    id_medicamento: int
    fecha_actualizacion: datetime
    
    class Config:
        from_attributes = True

class DetalleRecetaCreate(BaseModel):
    id_medicamento: int
    cantidad_prescripta: int
    dosis: str

class RecetaCreate(BaseModel):
    medico: str
    imagen_receta: Optional[str] = None
    detalles: List[DetalleRecetaCreate]

class RecetaResponse(BaseModel):
    id_receta: int
    id_cliente: int
    fecha_emision: datetime
    medico: str
    validada: bool
    
    class Config:
        from_attributes = True

class DetallePedidoCreate(BaseModel):
    id_medicamento: int
    cantidad: int

class PedidoCreate(BaseModel):
    id_farmacia: int
    metodo_pago: str
    detalles: List[DetallePedidoCreate]

class PedidoResponse(BaseModel):
    id_pedido: int
    id_cliente: int
    id_farmacia: int
    fecha_pedido: datetime
    estado: str
    metodo_pago: str
    total: float
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    contraseña: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    usuario_id: int
    tipo_usuario: str
