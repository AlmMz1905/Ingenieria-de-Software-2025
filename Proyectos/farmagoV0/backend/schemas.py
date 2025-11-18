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
    
    # ¡NUEVO! Le decimos que incluya las listas (¡vacías o llenas!)
    direcciones: List['DireccionResponse'] = []
    metodos_de_pago: List['MetodoDePagoResponse'] = []

    class Config:
        from_attributes = True # Esto hace la magia de cargar las relationships

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

class DireccionBase(BaseModel):
    alias: str
    calle_numero: str
    ciudad: str
    provincia: str
    codigo_postal: Optional[str] = None
    es_predeterminada: bool = False

class DireccionCreate(DireccionBase):
    pass # No necesita nada extra, el id_cliente lo sacamos del token

class DireccionResponse(DireccionBase):
    id_direccion: int
    id_cliente: int
    
    class Config:
        from_attributes = True

# --- Schemas para Métodos de Pago ---

class MetodoDePagoBase(BaseModel):
    tipo: str
    ultimos_cuatro: str
    fecha_expiracion: str # Formato "MM/YY"
    nombre_titular: str
    es_predeterminado: bool = False

class MetodoDePagoCreate(MetodoDePagoBase):
    pass # Idem DireccionCreate

class MetodoDePagoResponse(MetodoDePagoBase):
    id_metodo_pago: int
    id_cliente: int
    
    class Config:
        from_attributes = True

# --- Schemas para "Mi Perfil" ---

class ClienteUpdate(BaseModel):
    # Campos que el usuario PUEDE cambiar de su perfil
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None # Esta es la dirección 'principal' del Usuario, no la de entrega
    dni: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    obra_social: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    contraseña_actual: str
    nueva_contraseña: str

# --- ¡NUEVO! Schema para actualizar el Perfil de Farmacia ---
class FarmaciaUpdate(BaseModel):
    # Campos que la farmacia PUEDE cambiar
    nombre_comercial: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None # La dirección 'principal' del Usuario
    
    # ¡Los campos de horario!
    horario_apertura: Optional[str] = None # Ej: "09:00"
    horario_cierre: Optional[str] = None # Ej: "20:00"

ClienteResponse.model_rebuild()
DireccionResponse.model_rebuild()
MetodoDePagoResponse.model_rebuild()
FarmaciaUpdate.model_rebuild()