import uvicorn  # El servidor
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware  # ¡Importante para CORS!
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel # Para validación de datos
from typing import Optional

# --- Configuración de Base de Datos (SQLAlchemy) ---

# Reemplazá esto con tus datos de PostgreSQL
DATABASE_URL = "postgresql://postgres:12345678@localhost/farmago_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Modelos (Pydantic) ---
# Pydantic define la "forma" de los datos que entran y salen de la API

class UserCreate(BaseModel):
    email: str
    password: str
    nombre: str
    rol: str = "Usuario"

class UserOut(BaseModel):
    id: int
    email: str
    nombre: str
    rol: str

    class Config:
        orm_mode = True # Permite que Pydantic lea desde el modelo de SQLAlchemy

# --- Dependencia de BD ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Creación de la App (FastAPI) ---
app = FastAPI(
    title="API de FarmaGo+",
    description="Backend para la aplicación de gestión de farmacias."
)

# --- Configuración de CORS ---
# ¡ESTO ES CRÍTICO!
# Permite que tu app de React (que corre en localhost:5173)
# hable con tu backend (que corre en localhost:8000).

origins = [
    "http://localhost:5173",  # El puerto de Vite/React
    "http://localhost:3000",  # Por si acaso
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],
)

# --- Endpoints de la API ---

@app.get("/api/v1/test")
def get_test_message():
    """
    Endpoint de prueba para verificar que el backend y frontend se conectan.
    """
    return {"message": "¡El Backend está conectado y funcionando!"}

@app.post("/api/v1/users/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo usuario.
    (Falta la parte de hashear la contraseña)
    """
    # ¡Importante! Acá faltaría hashear (encriptar) user.password
    # antes de guardarlo en la BD. (Usando `passlib`)

    # TODO: Hashear la contraseña
    hashed_password = f"hashed_{user.password}" # Placeholder

    # Importá tu modelo de `models.py`
    from models import User

    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        nombre=user.nombre,
        rol=user.rol
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/api/v1/orders")
def list_orders(db: Session = Depends(get_db)):
    """Devuelve una lista de pedidos con sus ítems (para uso en el frontend)."""
    # Importar modelos aquí para evitar dependencias al inicio
    from models import Pedido

    orders = db.query(Pedido).all()

    def order_to_dict(o: Pedido):
        return {
            "id": o.id,
            "cliente_nombre": o.cliente_nombre,
            "status": o.status,
            "total": o.total,
            "creado_at": o.creado_at.isoformat() if o.creado_at else None,
            "items": [
                {
                    "id": it.id,
                    "producto_id": it.producto_id,
                    "cantidad": it.cantidad,
                    "precio_unitario": it.precio_unitario,
                }
                for it in o.items
            ],
        }

    return [order_to_dict(o) for o in orders]


@app.post("/api/v1/orders/{order_id}/cancel")
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    """Cancela un pedido y reposiciona el stock según los items del pedido."""
    from models import Pedido, Inventario

    order = db.query(Pedido).filter(Pedido.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    if order.status in ("cancelled", "returned"):
        raise HTTPException(status_code=400, detail="El pedido ya fue cancelado o devuelto")

    # Actualizar estado
    order.status = "cancelled"

    # Reposeer inventario
    for item in order.items:
        inv = db.query(Inventario).filter(Inventario.producto_id == item.producto_id).first()
        if inv:
            inv.cantidad = (inv.cantidad or 0) + (item.cantidad or 0)
        else:
            inv = Inventario(producto_id=item.producto_id, cantidad=item.cantidad)
            db.add(inv)

    db.commit()
    db.refresh(order)
    return {"message": "Pedido cancelado", "order_id": order.id}


@app.post("/api/v1/orders/{order_id}/return")
def return_order(order_id: int, reason: Optional[str] = None, db: Session = Depends(get_db)):
    """Marca un pedido como devuelto y repone el stock. Registra motivo en tabla Devolucion."""
    from models import Pedido, Inventario, Devolucion

    order = db.query(Pedido).filter(Pedido.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    if order.status in ("cancelled", "returned"):
        raise HTTPException(status_code=400, detail="El pedido ya fue cancelado o devuelto")

    order.status = "returned"

    # Reponer inventario
    for item in order.items:
        inv = db.query(Inventario).filter(Inventario.producto_id == item.producto_id).first()
        if inv:
            inv.cantidad = (inv.cantidad or 0) + (item.cantidad or 0)
        else:
            inv = Inventario(producto_id=item.producto_id, cantidad=item.cantidad)
            db.add(inv)

    # Registrar devolución
    dev = Devolucion(pedido_id=order.id, motivo=reason)
    db.add(dev)

    db.commit()
    db.refresh(order)
    return {"message": "Pedido marcado como devuelto", "order_id": order.id}


@app.post("/api/v1/orders/{order_id}/pickup")
def pickup_order(order_id: int, db: Session = Depends(get_db)):
        """Marca un pedido como retirado en mostrador ('picked-up')."""
        from models import Pedido

        order = db.query(Pedido).filter(Pedido.id == order_id).first()
        if not order:
                raise HTTPException(status_code=404, detail="Pedido no encontrado")

        if order.status in ("cancelled", "returned", "picked-up", "delivered"):
                raise HTTPException(status_code=400, detail="El pedido no puede marcarse como retirado")

        order.status = "picked-up"
        db.commit()
        db.refresh(order)
        return {"message": "Pedido marcado como retirado en mostrador", "order_id": order.id}


@app.post("/api/v1/orders/{order_id}/deliver")
def deliver_order(order_id: int, db: Session = Depends(get_db)):
        """Marca un pedido como entregado ('delivered')."""
        from models import Pedido

        order = db.query(Pedido).filter(Pedido.id == order_id).first()
        if not order:
                raise HTTPException(status_code=404, detail="Pedido no encontrado")

        if order.status in ("cancelled", "returned", "delivered"):
                raise HTTPException(status_code=400, detail="El pedido no puede marcarse como entregado")

        order.status = "delivered"
        db.commit()
        db.refresh(order)
        return {"message": "Pedido marcado como entregado", "order_id": order.id}


from fastapi.responses import Response
from fastapi.responses import StreamingResponse
from io import BytesIO
from typing import List, Dict, Any

# Jinja2 environment for templates
try:
    from jinja2 import Environment, FileSystemLoader
    jinja_env = Environment(loader=FileSystemLoader("templates"))
except Exception:
    jinja_env = None


@app.get("/api/v1/orders/{order_id}/receipt")
def get_receipt(order_id: int, db: Session = Depends(get_db)):
        """Genera un comprobante en HTML simple para imprimir desde el navegador."""
        from models import Pedido

        order = db.query(Pedido).filter(Pedido.id == order_id).first()
        if not order:
                raise HTTPException(status_code=404, detail="Pedido no encontrado")

        # Construir HTML simple
        items_html = ""
        for it in order.items:
                prod_name = it.producto.nombre if getattr(it, 'producto', None) else f"Producto {it.producto_id}"
                items_html += f"<tr><td>{prod_name}</td><td style='text-align:center'>{it.cantidad}</td><td style='text-align:right'>${it.precio_unitario:.2f}</td><td style='text-align:right'>${(it.cantidad * it.precio_unitario):.2f}</td></tr>"

        # Diseño más profesional para el comprobante
        html = f"""
        <html>
            <head>
                <meta charset='utf-8' />
                <title>Comprobante Pedido {order.id}</title>
                <style>
                    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111827; padding:20px; }}
                    .header {{ display:flex; align-items:center; gap:16px; }}
                    .logo {{ width:72px; height:72px; border-radius:12px; background:linear-gradient(135deg,#10b981,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:18px; }}
                    .company {{ font-size:18px; font-weight:700; }}
                    .meta {{ margin-top:8px; color:#374151; }}
                    table {{ width:100%; border-collapse:collapse; margin-top:18px; }}
                    th, td {{ padding:10px 8px; border-bottom:1px solid #e5e7eb; }}
                    th {{ text-align:left; color:#374151; font-weight:600; background:#f9fafb; }}
                    .right {{ text-align:right; }}
                    .totals {{ margin-top:12px; display:flex; justify-content:flex-end; gap:8px; }}
                    .note {{ margin-top:18px; color:#6b7280; font-size:13px; }}
                    @media print {{
                        .no-print {{ display:none }}
                        body {{ padding:8mm }}
                    }}
                </style>
            </head>
            <body>
                <div class='header'>
                    <div class='logo'>FG+</div>
                    <div>
                        <div class='company'>FarmaGo+ - Farmacia Demo</div>
                        <div class='meta'>Dirección: Av. Principal 123 - CUIT: 30-12345678-9 - Tel: +54 11 1234-5678</div>
                    </div>
                </div>

                <h3 style='margin-top:18px'>Comprobante - Pedido #{order.id}</h3>
                <div class='meta'>
                    <strong>Cliente:</strong> {order.cliente_nombre or '-'} &nbsp; | &nbsp; <strong>Fecha:</strong> {order.creado_at.isoformat() if order.creado_at else '-'} &nbsp; | &nbsp; <strong>Estado:</strong> {order.status}
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th style='text-align:center'>Cantidad</th>
                            <th style='text-align:right'>Precio unitario</th>
                            <th style='text-align:right'>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                </table>

                <div class='totals'>
                    <div style='min-width:260px'>
                        <div style='display:flex;justify-content:space-between'><span>Subtotal</span><strong>${order.total:.2f}</strong></div>
                    </div>
                </div>

                <div class='note'>
                    Este comprobante es digital. Si necesita un comprobante fiscal específico, solicítelo en mostrador.
                </div>

                <div class='no-print' style='margin-top:20px'>
                    <button onclick='window.print()' style='padding:8px 12px;border-radius:6px;border:0;background:#10b981;color:white;cursor:pointer'>Imprimir</button>
                </div>
            </body>
        </html>
        """

        return Response(content=html, media_type="text/html")


    @app.get("/api/v1/orders/{order_id}/receipt.pdf")
    def get_receipt_pdf(order_id: int, db: Session = Depends(get_db)):
        """Genera un comprobante en PDF para descarga/impresión usando ReportLab.
        Si `reportlab` no está instalado, devuelve 501 con un mensaje.
        """
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.units import mm
            from reportlab.pdfgen import canvas
        except Exception as e:
            raise HTTPException(status_code=501, detail="Dependencia requerida 'reportlab' no instalada. Ejecuta: pip install reportlab")

        from models import Pedido

        order = db.query(Pedido).filter(Pedido.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")

        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        x_margin = 20 * mm
        y = height - 20 * mm

        c.setFont("Helvetica-Bold", 16)
        c.drawString(x_margin, y, f"FarmaGo+ - Comprobante Pedido #{order.id}")
        y -= 8 * mm

        c.setFont("Helvetica", 10)
        c.drawString(x_margin, y, f"Cliente: {order.cliente_nombre or '-'}")
        c.drawRightString(width - x_margin, y, f"Fecha: {order.creado_at.isoformat() if order.creado_at else '-'}")
        y -= 8 * mm

        # Table header
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x_margin, y, "Producto")
        c.drawRightString(width - 80 * mm, y, "Cantidad")
        c.drawRightString(width - 40 * mm, y, "Precio")
        c.drawRightString(width - x_margin, y, "Subtotal")
        y -= 6 * mm
        c.setFont("Helvetica", 10)

        for it in order.items:
            prod_name = it.producto.nombre if getattr(it, 'producto', None) else f"Producto {it.producto_id}"
            c.drawString(x_margin, y, prod_name[:60])
            c.drawRightString(width - 80 * mm, y, str(it.cantidad))
            c.drawRightString(width - 40 * mm, y, f"${it.precio_unitario:.2f}")
            subtotal = (it.cantidad or 0) * (it.precio_unitario or 0)
            c.drawRightString(width - x_margin, y, f"${subtotal:.2f}")
            y -= 6 * mm
            if y < 30 * mm:
                c.showPage()
                y = height - 20 * mm

        # Totals
        y -= 4 * mm
        c.setFont("Helvetica-Bold", 11)
        c.drawRightString(width - x_margin, y, f"Total: ${order.total:.2f}")

        c.showPage()
        c.save()
        buffer.seek(0)

        return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=receipt_{order.id}.pdf"})


    @app.post("/api/v1/recipes/receipt")
    def render_recipe_receipt(payload: Dict[str, Any]):
        """Renderiza un comprobante para una receta.

        Body JSON esperado (ejemplo):
        {
          "id": "REC-004",
          "patientName": "Juan Pérez",
          "uploadDate": "2025-10-27 18:20",
          "type": "sale" | "delivery" | "compact",
          "medications": [ {"name":"Ibuprofeno 400mg","qty":1,"price":200.0}, "Metformina 850mg x60" ],
          "total": 400.0,
          "format": "html" | "pdf"
        }
        """

        # Normalizar entrada
        doc_id = payload.get("id", "-")
        client = payload.get("patientName", "-")
        date = payload.get("uploadDate", "-")
        rtype = payload.get("type", "sale")
        meds = payload.get("medications", [])
        total = payload.get("total", 0)
        out_format = payload.get("format", "html")

        # Normalize medications into list of dicts with name, qty, price
        meds_norm: List[Dict[str, Any]] = []
        for m in meds:
            if isinstance(m, str):
                meds_norm.append({"name": m, "qty": 1, "price": 0.0})
            elif isinstance(m, dict):
                meds_norm.append({
                    "name": m.get("name") or m.get("descripcion") or "Producto",
                    "qty": m.get("qty", 1),
                    "price": float(m.get("price", 0.0) or 0.0),
                })

        # Build item rows for templates
        item_rows = ""
        item_rows_compact = ""
        for it in meds_norm:
            name = it["name"]
            qty = it.get("qty", 1)
            price = it.get("price", 0.0)
            item_rows += f"<tr><td>{name}</td><td style='text-align:center'>{qty}</td><td style='text-align:right'>${price:.2f}</td></tr>"
            item_rows_compact += f"<div><span>{name}</span><span style='float:right'>{qty} x ${price:.2f}</span></div>"

        # Select template
        if rtype == "delivery":
            template_name = "receipt_delivery.html"
        elif rtype == "compact":
            template_name = "receipt_compact.html"
        else:
            template_name = "receipt_basic.html"

        # Render HTML via Jinja2 if available
        if out_format == "html":
            if jinja_env:
                tmpl = jinja_env.get_template(template_name)
                html = tmpl.render(ID=doc_id, CLIENT=client, DATE=date, ITEM_ROWS=item_rows, ITEM_ROWS_COMPACT=item_rows_compact, TOTAL=f"${total}")
                return Response(content=html, media_type="text/html")
            else:
                # Fallback: simple string replace for basic templates
                path = f"templates/{template_name}"
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        t = f.read()
                    t = t.replace("{{ID}}", str(doc_id)).replace("{{CLIENT}}", str(client)).replace("{{DATE}}", str(date)).replace("{{ITEM_ROWS}}", item_rows).replace("{{ITEM_ROWS_COMPACT}}", item_rows_compact).replace("{{TOTAL}}", f"${total}")
                    return Response(content=t, media_type="text/html")
                except FileNotFoundError:
                    raise HTTPException(status_code=500, detail="Template not found on server")

        # PDF generation: use reportlab if available
        if out_format == "pdf":
            try:
                from reportlab.lib.pagesizes import A4
                from reportlab.lib.units import mm
                from reportlab.pdfgen import canvas
            except Exception:
                raise HTTPException(status_code=501, detail="Dependencia requerida 'reportlab' no instalada. Ejecuta: pip install reportlab")

            buffer = BytesIO()
            c = canvas.Canvas(buffer, pagesize=A4)
            width, height = A4
            x = 20 * mm
            y = height - 20 * mm
            c.setFont("Helvetica-Bold", 14)
            c.drawString(x, y, f"FarmaGo+ - Comprobante {doc_id}")
            y -= 8 * mm
            c.setFont("Helvetica", 10)
            c.drawString(x, y, f"Paciente: {client}")
            c.drawRightString(width - x, y, f"Fecha: {date}")
            y -= 8 * mm
            c.setFont("Helvetica-Bold", 10)
            c.drawString(x, y, "Producto")
            c.drawRightString(width - x, y, "Cantidad")
            y -= 6 * mm
            c.setFont("Helvetica", 10)
            for it in meds_norm:
                c.drawString(x, y, it["name"][:70])
                c.drawRightString(width - x, y, str(it.get("qty", 1)))
                y -= 6 * mm
                if y < 30 * mm:
                    c.showPage()
                    y = height - 20 * mm

            y -= 4 * mm
            c.setFont("Helvetica-Bold", 11)
            c.drawRightString(width - x, y, f"Total: ${total:.2f}")
            c.showPage()
            c.save()
            buffer.seek(0)
            return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=recipe_{doc_id}.pdf"})

        raise HTTPException(status_code=400, detail="Formato no soportado. Usa 'html' o 'pdf'.")

# --- Punto de entrada para Uvicorn ---
if __name__ == "__main__":
    # Esto te permite correr el script con `python main.py`
    # aunque lo recomendado es `uvicorn main:app --reload`
    
    # Crea las tablas en la BD si no existen
    # (¡Importante! Necesita que los modelos estén importados)
    import models
    Base.metadata.create_all(bind=engine)
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
