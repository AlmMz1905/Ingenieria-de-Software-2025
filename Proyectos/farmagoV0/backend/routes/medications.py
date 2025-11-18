from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Medicamento, StockMedicamento, Farmacia
from schemas import MedicamentoCreate, MedicamentoResponse

router = APIRouter()

@router.post("/", response_model=MedicamentoResponse)
def create_medication(medicamento: MedicamentoCreate, db: Session = Depends(get_db)):
    """Create a new medication in the system"""
    db_medicamento = Medicamento(**medicamento.dict())
    db.add(db_medicamento)
    db.commit()
    db.refresh(db_medicamento)
    return db_medicamento

@router.get("/")
def list_medications(db: Session = Depends(get_db)):
    """List all medications"""
    return db.query(Medicamento).all()

@router.get("/search")
def search_medications(
    query: str = Query(..., min_length=1),
    categoria: str = None,
    requiere_receta: bool = None,
    db: Session = Depends(get_db)
):
    """Search medications by name, active ingredient, or category"""
    search_filter = Medicamento.nombre_comercial.ilike(f"%{query}%") | \
                    Medicamento.principio_activo.ilike(f"%{query}%")
    
    results = db.query(Medicamento).filter(search_filter)
    
    if categoria:
        results = results.filter(Medicamento.categoria == categoria)
    
    if requiere_receta is not None:
        results = results.filter(Medicamento.requiere_receta == requiere_receta)
    
    return results.all()

@router.get("/{id_medicamento}", response_model=MedicamentoResponse)
def get_medication(id_medicamento: int, db: Session = Depends(get_db)):
    """Get medication details by ID"""
    medicamento = db.query(Medicamento).filter(Medicamento.id_medicamento == id_medicamento).first()
    
    if not medicamento:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    
    return medicamento

@router.get("/{id_medicamento}/farmacias")
def get_pharmacies_with_medication(id_medicamento: int, db: Session = Depends(get_db)):
    """Get all pharmacies with availability and prices for a medication"""
    stocks = db.query(StockMedicamento).filter(
        StockMedicamento.id_medicamento == id_medicamento,
        StockMedicamento.cantidad_disponible > 0
    ).all()
    
    if not stocks:
        return []
    
    result = []
    for stock in stocks:
        farmacia = db.query(Farmacia).filter(Farmacia.id_usuario == stock.id_farmacia).first()
        result.append({
            "id_stock": stock.id_stock,
            "farmacia": {
                "id_usuario": farmacia.id_usuario,
                "nombre_comercial": farmacia.nombre_comercial,
                "latitud": farmacia.latitud,
                "longitud": farmacia.longitud
            },
            "precio": stock.precio,
            "cantidad_disponible": stock.cantidad_disponible
        })
    
    return result
