from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Pedido, DetallePedido, Cliente, StockMedicamento, Medicamento
from schemas import PedidoCreate, PedidoResponse
from utils.security import get_current_user

router = APIRouter()

@router.post("/", response_model=PedidoResponse)
def create_order(
    pedido: PedidoCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new medication order"""
    # Verify current user is a cliente
    cliente = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
    if not cliente:
        raise HTTPException(status_code=403, detail="Solo los clientes pueden crear pedidos")
    
    # Calculate total and verify stock
    total = 0.0
    for detalle in pedido.detalles:
        stock = db.query(StockMedicamento).filter(
            StockMedicamento.id_farmacia == pedido.id_farmacia,
            StockMedicamento.id_medicamento == detalle.id_medicamento
        ).first()
        
        if not stock or stock.cantidad_disponible < detalle.cantidad:
            raise HTTPException(status_code=400, detail="Stock insuficiente")
        
        total += stock.precio * detalle.cantidad
    
    new_pedido = Pedido(
        id_cliente=current_user.id_usuario,
        id_farmacia=pedido.id_farmacia,
        metodo_pago=pedido.metodo_pago,
        total=total
    )
    db.add(new_pedido)
    db.flush()
    
    # Add order details and reduce stock
    for detalle in pedido.detalles:
        stock = db.query(StockMedicamento).filter(
            StockMedicamento.id_farmacia == pedido.id_farmacia,
            StockMedicamento.id_medicamento == detalle.id_medicamento
        ).first()
        
        medicamento = db.query(Medicamento).filter(Medicamento.id_medicamento == detalle.id_medicamento).first()
        
        detail_record = DetallePedido(
            id_pedido=new_pedido.id_pedido,
            id_medicamento=detalle.id_medicamento,
            cantidad=detalle.cantidad,
            precio_unitario=stock.precio
        )
        db.add(detail_record)
        stock.cantidad_disponible -= detalle.cantidad
    
    db.commit()
    db.refresh(new_pedido)
    return new_pedido

@router.get("/")
def get_orders(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all orders for current client"""
    cliente = db.query(Cliente).filter(Cliente.id_usuario == current_user.id_usuario).first()
    if not cliente:
        raise HTTPException(status_code=403, detail="Solo los clientes pueden ver pedidos")
    
    pedidos = db.query(Pedido).filter(Pedido.id_cliente == current_user.id_usuario).all()
    return pedidos

@router.get("/{id_pedido}")
def get_order(id_pedido: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get order details"""
    pedido = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    if pedido.id_cliente != current_user.id_usuario and pedido.id_farmacia != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    return pedido

@router.put("/{id_pedido}/status")
def update_order_status(
    id_pedido: int,
    status_data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update order status"""
    pedido = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    if pedido.id_farmacia != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="Solo la farmacia puede actualizar el pedido")
    
    pedido.estado = status_data["estado"]
    db.commit()
    return {"message": "Estado actualizado"}
