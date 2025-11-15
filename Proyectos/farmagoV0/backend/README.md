# AppFarmaGO Backend

Backend API para la aplicación de gestión de farmacias construido con FastAPI, SQLAlchemy y PostgreSQL.

## Instalación

1. Instalar dependencias:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Configurar variables de entorno en `.env`:
\`\`\`
DATABASE_URL=postgresql://user:password@localhost:5432/appfarmago
SECRET_KEY=your-secret-key
\`\`\`

3. Ejecutar migraciones (las tablas se crean automáticamente):
\`\`\`bash
python main.py
\`\`\`

## Estructura del Proyecto

\`\`\`
backend/
├── main.py              # Aplicación principal
├── database.py          # Configuración de base de datos
├── models.py            # Modelos SQLAlchemy
├── schemas.py           # Esquemas Pydantic
├── config.py            # Configuración
├── requirements.txt     # Dependencias
├── .env                 # Variables de entorno
└── routes/
    ├── auth.py          # Autenticación
    ├── users.py         # Gestión de usuarios
    ├── medications.py   # Gestión de medicamentos
    ├── pharmacies.py    # Gestión de farmacias
    ├── recipes.py       # Gestión de recetas
    └── orders.py        # Gestión de pedidos
└── utils/
    └── security.py      # Funciones de seguridad
\`\`\`

## Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register/cliente` - Registrar cliente
- `POST /api/auth/register/farmacia` - Registrar farmacia

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil

### Medicamentos
- `GET /api/medications/search` - Buscar medicamentos
- `GET /api/medications/{id}` - Obtener detalles
- `GET /api/medications/{id}/farmacias` - Obtener farmacias con disponibilidad

### Farmacias
- `GET /api/pharmacies/{id}` - Obtener perfil
- `POST /api/pharmacies/stock` - Actualizar stock
- `GET /api/pharmacies/inventory/{id}` - Ver inventario

### Recetas
- `POST /api/recipes` - Crear receta
- `GET /api/recipes` - Obtener recetas del cliente
- `PUT /api/recipes/{id}/validate` - Validar receta

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders` - Obtener pedidos del cliente
- `GET /api/orders/{id}` - Obtener detalles
- `PUT /api/orders/{id}/status` - Actualizar estado

## Características

- ✅ Autenticación JWT
- ✅ Herencia de modelos (Usuario → Cliente/Farmacia)
- ✅ Gestión de stock por farmacia
- ✅ Sistema de recetas médicas
- ✅ Validación de medicamentos con receta
- ✅ Control de disponibilidad
- ✅ CORS configurado
