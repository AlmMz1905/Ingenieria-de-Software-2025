# AppFarmaGO - Setup Instructions

## Quick Start Guide

### Backend Setup

1. **Install dependencies:**
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   \`\`\`

2. **Configure PostgreSQL:**
   - The `.env` file is already configured to use:
     - Database: `appfarmago`
     - User: `postgres`
     - Password: `postgres`
     - Host: `localhost`
     - Port: `5432`
   
   - If you need to use different credentials, update `DATABASE_URL` in `backend/.env`

3. **Initialize the database:**
   \`\`\`bash
   python scripts/seed_db.py
   \`\`\`
   This creates all tables and populates them with test data.

4. **Run the backend server:**
   \`\`\`bash
   python main.py
   \`\`\`
   The API will be available at: `http://localhost:8000`
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **The `.env.local` file is already configured:**
   - API URL: `http://localhost:8000/api`
   - This connects to your local backend

3. **Run the frontend:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at: `http://localhost:3000`

## Test Credentials

After running the seed script, you can login with:

**Customer Account:**
- Email: `cliente@test.com`
- Password: `password123`

**Pharmacy Accounts:**
- Email: `farmacia1@test.com` / Password: `password123`
- Email: `farmacia2@test.com` / Password: `password123`
- Email: `farmacia3@test.com` / Password: `password123`

## Available Features

### For Customers
- Create account and login
- Browse medications from all pharmacies
- Add medications to cart
- Checkout and place orders
- Upload prescriptions for restricted medications

### For Pharmacies
- Manage medication stock
- View incoming orders
- Update order status
- View sales dashboard

## API Endpoints

All endpoints are prefixed with `/api`

**Authentication:**
- `POST /auth/register` - Register new account
- `POST /auth/login` - Login and get JWT token

**Medications:**
- `GET /medications` - List all medications
- `GET /medications/{id}` - Get medication details
- `GET /medications/search?q=paracetamol` - Search medications

**Pharmacies:**
- `GET /pharmacies` - List all pharmacies
- `GET /pharmacies/{id}` - Get pharmacy details

**Orders:**
- `POST /orders` - Create new order
- `GET /orders` - Get user's orders
- `PUT /orders/{id}/status` - Update order status

**Stock:**
- `PUT /stock/{pharmacy_id}/{medication_id}` - Update stock quantity

## Troubleshooting

**"Connection refused" error:**
- Make sure PostgreSQL is running on localhost:5432
- Check DATABASE_URL in backend/.env

**"Failed to fetch API" error:**
- Make sure backend is running on http://localhost:8000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local

**"Token expired" error:**
- Clear localStorage and login again
- If needed, adjust ACCESS_TOKEN_EXPIRE_MINUTES in backend/.env

## Production Deployment

Before deploying to production:

1. **Backend:**
   - Generate new SECRET_KEY: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
   - Use production PostgreSQL database
   - Set ENV=production
   - Update ALLOWED_ORIGINS to your frontend domain

2. **Frontend:**
   - Update NEXT_PUBLIC_API_URL to your production API URL
   - Build: `npm run build`
   - Deploy to Vercel or your hosting provider
