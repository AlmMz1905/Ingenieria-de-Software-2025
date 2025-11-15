from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Usuario, Cliente, Farmacia
from schemas import ClienteResponse, FarmaciaResponse
from utils.security import get_current_user

router = APIRouter()

@router.get("/profile", response_model=ClienteResponse | FarmaciaResponse)
def get_profile(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current authenticated user profile"""
    if current_user.tipo_usuario == "cliente":
        cliente = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
        return cliente
    else:
        farmacia = db.query(Farmacia).filter(Farmacia.id_usuario == current_user.id_usuario).first()
        return farmacia

@router.put("/profile")
def update_profile(update_data: dict, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update user profile information"""
    user = db.query(Usuario).filter(Usuario.id_usuario == current_user.id_usuario).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    for field, value in update_data.items():
        if hasattr(user, field) and field != "contraseña":
            setattr(user, field, value)
    
    db.commit()
    return {"message": "Perfil actualizado exitosamente"}
