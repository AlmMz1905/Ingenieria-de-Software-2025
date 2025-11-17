"""Database seeding script with test data"""
import sys
import os

# --- ARREGLO ---
# Añade el directorio 'backend' (un nivel arriba) al path
# para que los imports (database, models, utils) funcionen
# de forma robusta sin importar cómo se corra el script.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.join(SCRIPT_DIR, '..')
sys.path.insert(0, PARENT_DIR)

from database import SessionLocal, engine, Base
from models import Usuario, Cliente, Farmacia, Medicamento, StockMedicamento
from utils.security import hash_password

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Usuario).first():
        print("Database already seeded!")
        db.close()
        return
    
    print("Seeding database...")
    
    # Create pharmacies
    farmacias_data = [
        {
            "nombre": "Farmacia",
            "apellido": "Del Centro",
            "email": "farmacia1@test.com",
            "password": "password123", # ¡Contraseña corta, está OK!
            "nombre_comercial": "Farmacia Del Centro",
            "cuit": "30-12345678-9",
            "latitud": -34.6037,
            "longitud": -58.3816,
            "horario_apertura": "08:00",
            "horario_cierre": "20:00"
        },
        {
            "nombre": "Farmacia",
            "apellido": "San Martín",
            "email": "farmacia2@test.com",
            "password": "password123", # ¡Contraseña corta, está OK!
            "nombre_comercial": "Farmacia San Martín",
            "cuit": "30-87654321-0",
            "latitud": -34.6100,
            "longitud": -58.3850,
            "horario_apertura": "09:00",
            "horario_cierre": "21:00"
        },
        {
            "nombre": "Farmacia",
            "apellido": "La Paz",
            "email": "farmacia3@test.com",
            "password": "password123", # ¡Contraseña corta, está OK!
            "nombre_comercial": "Farmacia La Paz",
            "cuit": "30-11111111-2",
            "latitud": -34.6200,
            "longitud": -58.3900,
            "horario_apertura": "07:00",
            "horario_cierre": "22:00"
        }
    ]
    
    pharmacies = []
    try:
        for farm_data in farmacias_data:
            # ¡Creamos la Farmacia (hijo) directamente con todos los datos!
            farmacia = Farmacia(
                # Datos de Usuario (padre)
                nombre=farm_data["nombre"],
                apellido=farm_data["apellido"],
                email=farm_data["email"],
                contraseña=hash_password(farm_data["password"]),
                # tipo_usuario="farmacia", # SQLAlchemy lo sabe
                
                # Datos de Farmacia (hijo)
                nombre_comercial=farm_data["nombre_comercial"],
                cuit=farm_data["cuit"],
                latitud=farm_data["latitud"],
                longitud=farm_data["longitud"],
                horario_apertura=farm_data["horario_apertura"],
                horario_cierre=farm_data["horario_cierre"]
            )
            db.add(farmacia)
            pharmacies.append(farmacia)
        
        db.commit() # Guardamos todas las farmacias juntas
        
        # Create test client
        print("Creando cliente de prueba...")
        # ¡Creamos el Cliente (hijo) directamente con todos los datos!
        cliente = Cliente(
            # Datos de Usuario (padre)
            nombre="Juan",
            apellido="García",
            email="cliente@test.com",
            contraseña=hash_password("password123"),
            telefono="1234567890",
            direccion="Calle Falsa 123",
            # tipo_usuario="cliente", # SQLAlchemy lo sabe
            
            # Datos de Cliente (hijo)
            dni="12345678",
            obra_social="OSDE"
        )
        db.add(cliente)
        db.commit() # Guardamos el cliente
        
        # Create medications
        medicamentos_data = [
            {"nombre": "Ibuprofeno 400mg", "activo": "Ibuprofeno", "presentacion": "30 comprimidos", "requiere_receta": False, "laboratorio": "Gador", "categoria": "Analgésicos"},
            {"nombre": "Paracetamol 500mg", "activo": "Paracetamol", "presentacion": "20 comprimidos", "requiere_receta": False, "laboratorio": "Bayer", "categoria": "Analgésicos"},
            {"nombre": "Amoxicilina 500mg", "activo": "Amoxicilina", "presentacion": "20 cápsulas", "requiere_receta": True, "laboratorio": "Astra", "categoria": "Antibióticos"},
            {"nombre": "Alcohol en Gel 500ml", "activo": "Alcohol", "presentacion": "500ml", "requiere_receta": False, "laboratorio": "Genomma", "categoria": "Higiene"},
            {"nombre": "Omeprazol 20mg", "activo": "Omeprazol", "presentacion": "30 cápsulas", "requiere_receta": False, "laboratorio": "Farmapel", "categoria": "Digestivos"},
            {"nombre": "Loratadina 10mg", "activo": "Loratadina", "presentacion": "30 comprimidos", "requiere_receta": False, "laboratorio": "Gador", "categoria": "Antihistamínicos"},
            {"nombre": "Atorvastatina 20mg", "activo": "Atorvastatina", "presentacion": "30 comprimidos", "requiere_receta": True, "laboratorio": "Actavis", "categoria": "Cardiovascular"},
            {"nombre": "Vitamina C 1000mg", "activo": "Ácido Ascórbico", "presentacion": "20 comprimidos efervescentes", "requiere_receta": False, "laboratorio": "Pfizer", "categoria": "Suplementos"},
            {"nombre": "Aspirina 500mg", "activo": "Ácido Acetilsalicílico", "presentacion": "20 comprimidos", "requiere_receta": False, "laboratorio": "Bayer", "categoria": "Analgésicos"},
            {"nombre": "Metformina 850mg", "activo": "Metformina", "presentacion": "60 comprimidos", "requiere_receta": False, "laboratorio": "Novartis", "categoria": "Antidiabéticos"}
        ]
        
        medicamentos = []
        for med_data in medicamentos_data:
            med = Medicamento(
                nombre_comercial=med_data["nombre"],
                principio_activo=med_data["activo"],
                presentacion=med_data["presentacion"],
                requiere_receta=med_data["requiere_receta"],
                laboratorio=med_data["laboratorio"],
                categoria=med_data["categoria"]
            )
            db.add(med)
            medicamentos.append(med)
        
        db.commit()
        
        # Add stock to each pharmacy with different prices and quantities
        precios_base = {
            1: 350.00,
            2: 280.00,
            3: 890.00,
            4: 450.00,
            5: 520.00,
            6: 380.00,
            7: 1250.00,
            8: 680.00,
            9: 150.00,
            10: 450.00
        }
        
        for idx, med in enumerate(medicamentos, 1):
            for farm_idx, farm in enumerate(pharmacies):
                # Vary prices by pharmacy
                precio = precios_base[idx] * (0.95 + farm_idx * 0.05)
                cantidad = 50 + (farm_idx * 20) + (idx * 5) % 100
                
                stock = StockMedicamento(
                    id_farmacia=farm.id_usuario,
                    id_medicamento=med.id_medicamento,
                    precio=round(precio, 2),
                    cantidad_disponible=cantidad
                )
                db.add(stock)
        
        db.commit()
        
        print("Database seeded successfully!")
        print(f"Created 3 pharmacies")
        print(f"Created 1 test client")
        print(f"Created {len(medicamentos)} medications")
        print(f"Test credentials:")
        print(f"  Cliente: cliente@test.com / password123")
        print(f"  Farmacia 1: farmacia1@test.com / password123")
        print(f"  Farmacia 2: farmacia2@test.com / password123")
        print(f"  Farmacia 3: farmacia3@test.com / password123")

    except Exception as e:
        print("An error occurred during seeding:")
        print(e)
        db.rollback() # Si algo sale mal, revierte todo
    finally:
        db.close() # Cierra la sesión

if __name__ == "__main__":
    seed_database()