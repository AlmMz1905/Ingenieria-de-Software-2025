from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from database import get_db
from typing import Union
from models import Usuario, Cliente, Farmacia, Direccion, MetodoDePago
# ¡Importamos los schemas nuevos!
from schemas import (
    ClienteResponse, FarmaciaResponse, 
    ClienteUpdate, ChangePasswordRequest, FarmaciaUpdate,
    DireccionResponse, DireccionCreate,
    MetodoDePagoResponse, MetodoDePagoCreate # <-- ¡Agregamos los schemas de Direccion!
)
from utils.security import get_current_user, hash_password, verify_password

router = APIRouter()

# --- GET PERFIL (Ya estaba OK, solo nos aseguramos que el response_model cargue todo) ---
@router.get("/profile", response_model=ClienteResponse | FarmaciaResponse)
def get_profile(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current authenticated user profile (con direcciones y pagos)"""
    
    if current_user.tipo_usuario == "cliente":
        # Gracias a SQLAlchemy y 'from_attributes', esto ahora trae
        # el cliente CON sus listas de 'direcciones' y 'metodos_de_pago'
        cliente = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
        return cliente
    else:
        # (Lo mismo para Farmacia si tuviera listas)
        farmacia = db.query(Farmacia).filter(Farmacia.id_usuario == current_user.id_usuario).first()
        return farmacia

# --- UPDATE PERFIL (Ahora es más robusto y usa ClienteUpdate) ---
@router.put("/profile", response_model=ClienteResponse | FarmaciaResponse)
def update_profile(
    update_data: Union[ClienteUpdate, FarmaciaUpdate], # <-- ¡LA MAGIA ESTÁ ACÁ!
    current_user: Usuario = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Update user profile information (Cliente o Farmacia)"""
    
    # 1. Validamos que el tipo de data coincida con el tipo de usuario
    if current_user.tipo_usuario == "cliente" and not isinstance(update_data, ClienteUpdate):
        raise HTTPException(status_code=400, detail="Datos de actualización incorrectos para un cliente.")
    if current_user.tipo_usuario == "farmacia" and not isinstance(update_data, FarmaciaUpdate):
        raise HTTPException(status_code=400, detail="Datos de actualización incorrectos para una farmacia.")

    # 2. Buscamos el objeto "hijo" (Cliente o Farmacia)
    if current_user.tipo_usuario == "cliente":
        user = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
    else:
        user = db.query(Farmacia).filter(Farmacia.id_usuario == current_user.id_usuario).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 3. Verificamos si el email nuevo ya existe
    if update_data.email and update_data.email != user.email:
        existing_user = db.query(Usuario).filter(Usuario.email == update_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="El email ya está en uso")

    # 4. Actualizamos los campos uno por uno
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        if hasattr(user, field) and value is not None:
            setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

# --- ¡NUEVO! CAMBIAR CONTRASEÑA ---
@router.post("/profile/change-password")
def change_password(request: ChangePasswordRequest, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """Change user password"""
    
    # 1. Buscamos al usuario (aunque ya lo tenemos en current_user, lo traemos de la db)
    user = db.query(Usuario).filter(Usuario.id_usuario == current_user.id_usuario).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 2. Verificamos la contraseña actual
    if not verify_password(request.contraseña_actual, user.contraseña):
        raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
        
    # 3. Validamos la contraseña nueva (¡Tu requisito de 8 dígitos!)
    if len(request.nueva_contraseña) < 8:
        raise HTTPException(status_code=400, detail="La nueva contraseña debe tener al menos 8 caracteres")

    # 4. Hasheamos y guardamos la nueva
    user.contraseña = hash_password(request.nueva_contraseña)
    
    db.commit()
    return {"message": "Contraseña actualizada exitosamente"}

# --- ¡NUEVO! ELIMINAR CUENTA ---
@router.delete("/profile")
def delete_account(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete user account"""
    
    # (Idealmente, acá pediríamos re-autenticar la contraseña)
    # (Pero por ahora, solo borramos)
    
    # Buscamos el objeto "hijo" (Cliente o Farmacia) para borrarlo
    if current_user.tipo_usuario == "cliente":
        user = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
    else:
        user = db.query(Farmacia).filter(Farmacia.id_usuario == current_user.id_usuario).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    # Gracias al 'cascade' que pusimos en models.py,
    # al borrar el Cliente, se borran sus direcciones, pagos, pedidos, etc.
    db.delete(user)
    db.commit()
    
    return {"message": "Cuenta eliminada exitosamente"}

@router.post("/profile/addresses", response_model=DireccionResponse)
def create_address(
    address_data: DireccionCreate, 
    current_user: Usuario = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Crea una nueva dirección para el cliente logueado"""
    
    # Lógica para "desmarcar" otras direcciones si esta es predeterminada
    if address_data.es_predeterminada:
        db.execute(
            update(Direccion)
            .where(Direccion.id_cliente == current_user.id_usuario)
            .values(es_predeterminada=False)
        )

    new_address = Direccion(
        **address_data.model_dump(),
        id_cliente=current_user.id_usuario
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.put("/profile/addresses/{id_direccion}", response_model=DireccionResponse)
def update_address(
    id_direccion: int,
    address_data: DireccionCreate, # Reusamos el schema de 'Create' para 'Update'
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualiza una dirección existente"""
    
    # Buscamos la dirección
    address = db.get(Direccion, id_direccion)
    
    # Chequeos de seguridad
    if not address:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    if address.id_cliente != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No tenés permiso para editar esta dirección")

    # Lógica para "desmarcar" otras direcciones
    if address_data.es_predeterminada and not address.es_predeterminada:
        db.execute(
            update(Direccion)
            .where(Direccion.id_cliente == current_user.id_usuario)
            .values(es_predeterminada=False)
        )

    # Actualizamos los campos
    for field, value in address_data.model_dump().items():
        setattr(address, field, value)
        
    db.commit()
    db.refresh(address)
    return address

@router.delete("/profile/addresses/{id_direccion}")
def delete_address(
    id_direccion: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Elimina una dirección"""
    
    address = db.get(Direccion, id_direccion)
    
    if not address:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    if address.id_cliente != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No tenés permiso para eliminar esta dirección")

    # ¡Lógica de seguridad! Si borra la predeterminada,
    # ponemos otra como predeterminada si es que quedan más.
    if address.es_predeterminada:
        remaining_address = db.scalars(
            select(Direccion)
            .where(Direccion.id_cliente == current_user.id_usuario)
            .where(Direccion.id_direccion != id_direccion)
            .limit(1)
        ).first()
        
        if remaining_address:
            remaining_address.es_predeterminada = True
            db.add(remaining_address)

    db.delete(address)
    db.commit()
    return {"message": "Dirección eliminada exitosamente"}

@router.post("/profile/payment-methods", response_model=MetodoDePagoResponse)
def create_payment_method(
    payment_data: MetodoDePagoCreate, 
    current_user: Usuario = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Crea un nuevo método de pago para el cliente logueado"""
    
    # Lógica para "desmarcar" otros si este es predeterminado
    if payment_data.es_predeterminado:
        db.execute(
            update(MetodoDePago)
            .where(MetodoDePago.id_cliente == current_user.id_usuario)
            .values(es_predeterminado=False)
        )

    new_payment = MetodoDePago(
        **payment_data.model_dump(),
        id_cliente=current_user.id_usuario
    )
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

@router.put("/profile/payment-methods/{id_metodo_pago}", response_model=MetodoDePagoResponse)
def update_payment_method(
    id_metodo_pago: int,
    payment_data: MetodoDePagoCreate, # Reusamos el schema de 'Create'
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualiza un método de pago existente"""
    
    payment = db.get(MetodoDePago, id_metodo_pago)
    
    if not payment:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")
    if payment.id_cliente != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No tenés permiso para editar este método")

    # Lógica para "desmarcar" otros
    if payment_data.es_predeterminado and not payment.es_predeterminado:
        db.execute(
            update(MetodoDePago)
            .where(MetodoDePago.id_cliente == current_user.id_usuario)
            .values(es_predeterminado=False)
        )

    for field, value in payment_data.model_dump().items():
        setattr(payment, field, value)
        
    db.commit()
    db.refresh(payment)
    return payment

@router.delete("/profile/payment-methods/{id_metodo_pago}")
def delete_payment_method(
    id_metodo_pago: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Elimina un método de pago"""
    
    payment = db.get(MetodoDePago, id_metodo_pago)
    
    if not payment:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")
    if payment.id_cliente != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No tenés permiso para eliminar este método")

    # Lógica de seguridad (igual que direcciones)
    if payment.es_predeterminado:
        remaining_payment = db.scalars(
            select(MetodoDePago)
            .where(MetodoDePago.id_cliente == current_user.id_usuario)
            .where(MetodoDePago.id_metodo_pago != id_metodo_pago)
            .limit(1)
        ).first()
        
        if remaining_payment:
            remaining_payment.es_predeterminado = True
            db.add(remaining_payment)

    db.delete(payment)
    db.commit()
    return {"message": "Método de pago eliminado exitosamente"}