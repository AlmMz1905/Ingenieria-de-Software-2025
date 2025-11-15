from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Farmacia, StockMedicamento
from schemas import StockMedicamentoCreate, StockMedicamentoResponse
from utils.security import get_current_user

router = APIRouter()

@router.get("/{id_farmacia}")
def get_pharmacy(id_farmacia: int, db: Session = Depends(get_db)):
    """Get pharmacy details"""
    farmacia = db.query(Farmacia).filter(Farmacia.id_usuario == id_farmacia).first()
    
    if not farmacia:
        raise HTTPException(status_code=404, detail="Farmacia no encontrada")
    
    return farmacia

@router.post("/stock")
def update_stock(
    stock_data: StockMedicamentoCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update medication stock for a pharmacy"""
    # Verify pharmacy ownership
    farmacia = db.query(Farmacia).filter(Farmacia.id_usuario == current_user.id_usuario).first()
    if not farmacia:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    # Check if stock exists
    existing_stock = db.query(StockMedicamento).filter(
        StockMedicamento.id_farmacia == current_user.id_usuario,
        StockMedicamento.id_medicamento == stock_data.id_medicamento
    ).first()
    
    if existing_stock:
        existing_stock.precio = stock_data.precio
        existing_stock.cantidad_disponible = stock_data.cantidad_disponible
    else:
        new_stock = StockMedicamento(
            id_farmacia=current_user.id_usuario,
            id_medicamento=stock_data.id_medicamento,
            precio=stock_data.precio,
            cantidad_disponible=stock_data.cantidad_disponible
        )
        db.add(new_stock)
    
    db.commit()
    return {"message": "Stock actualizado"}

@router.get("/inventory/{id_farmacia}")
def get_inventory(id_farmacia: int, db: Session = Depends(get_db)):
    """Get all medications in pharmacy inventory"""
    stocks = db.query(StockMedicamento).filter(
        StockMedicamento.id_farmacia == id_farmacia
    ).all()
    
    return stocks
