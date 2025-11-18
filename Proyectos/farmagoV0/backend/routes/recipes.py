from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Receta, DetalleReceta, Medicamento, Cliente
from schemas import RecetaCreate, RecetaResponse
from utils.security import get_current_user

router = APIRouter()

@router.post("/", response_model=RecetaResponse)
def create_recipe(
    receta: RecetaCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new medical recipe"""
    # Verify current user is a cliente
    cliente = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
    if not cliente:
        raise HTTPException(status_code=403, detail="Solo los clientes pueden crear recetas")
    
    new_receta = Receta(
        id_cliente=current_user.id_usuario,
        medico=receta.medico,
        imagen_receta=receta.imagen_receta
    )
    db.add(new_receta)
    db.flush()
    
    # Add medication details
    for detalle in receta.detalles:
        medication = db.query(Medicamento).filter(Medicamento.id_medicamento == detalle.id_medicamento).first()
        if not medication:
            raise HTTPException(status_code=404, detail=f"Medicamento {detalle.id_medicamento} no encontrado")
        
        detail_record = DetalleReceta(
            id_receta=new_receta.id_receta,
            id_medicamento=detalle.id_medicamento,
            cantidad_prescripta=detalle.cantidad_prescripta,
            dosis=detalle.dosis
        )
        db.add(detail_record)
    
    db.commit()
    db.refresh(new_receta)
    return new_receta

@router.get("/")
def get_recipes(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all recipes for current client"""
    cliente = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
    if not cliente:
        raise HTTPException(status_code=403, detail="Solo los clientes pueden ver recetas")
    
    recetas = db.query(Receta).filter(Receta.id_cliente == current_user.id_usuario).all()
    return recetas

@router.put("/{id_receta}/validate")
def validate_recipe(id_receta: int, db: Session = Depends(get_db)):
    """Validate a recipe (mark as valid)"""
    receta = db.query(Receta).filter(Receta.id_receta == id_receta).first()
    
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    
    receta.validada = True
    db.commit()
    return {"message": "Receta validada"}
