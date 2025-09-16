# Gift Real Estate - JavaScript Frontend & Backend Conversion

This repository contains **two development approaches**:

1. **Original TypeScript System** (client/ + server/) - The existing unified application
2. **New JavaScript System** (frontend/ + backend/) - Separated applications for easier deployment

## ⚠️ Development Mode Choice

### Current Running System (TypeScript - Unified)
The repository's default workflow runs the original TypeScript system:
- Unified frontend + backend on port 5000
- TypeScript client in `client/` directory  
- TypeScript server in `server/` directory
- Run with: `npm run dev` (from root)

### Alternative System (JavaScript - Separated)
The new JavaScript conversion provides separated applications:
- Frontend on port 3000, Backend on port 5000
- JavaScript frontend in `frontend/` directory
- JavaScript backend in `backend/` directory  
- Requires separate startup (see instructions below)

**Choose one approach for your development workflow.**

## 🏗️ JavaScript System Structure

```
gift-realestate/
├── frontend/          # NEW: React + Vite + Tailwind CSS (JavaScript)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/           # NEW: Express + MongoDB (JavaScript/CommonJS)
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── app.js            # Express server
│   ├── db.js             # Database connection
│   ├── package.json
│   └── .env
├── client/            # ORIGINAL: TypeScript frontend
├── server/            # ORIGINAL: TypeScript backend
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd gift-realestate
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env || echo "MONGODB_URI=mongodb://localhost:27017/gift-realestate
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000" > .env
# Edit .env with your MongoDB connection string and other settings

# Start the backend server
npm start
# For development with auto-restart:
npm run dev
```

The backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env || echo 'VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME="Gift Real Estate"
VITE_CONTACT_PHONE=+251911123456' > .env
# Edit .env if needed (default settings should work)

# Start the frontend development server
npm run dev
```

The frontend will run on **http://localhost:3000**

## 🔧 Environment Configuration

### Backend (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/gift-realestate

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_SALT_ROUNDS=12

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME="Gift Real Estate"

# Contact Information
VITE_CONTACT_PHONE=+251911123456
VITE_CONTACT_EMAIL=info@giftrealestate.com
```

## 📡 API Endpoints

### Properties
- `GET /api/properties` - Get all properties with optional filters
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property (admin)
- `PUT /api/properties/:id` - Update property (admin)
- `DELETE /api/properties/:id` - Delete property (admin)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Team
- `GET /api/team` - Get all team members
- `POST /api/team` - Create team member (admin)
- `PUT /api/team/:id` - Update team member (admin)
- `DELETE /api/team/:id` - Delete team member (admin)

### Leads
- `GET /api/leads` - Get all leads (admin)
- `POST /api/leads` - Create new lead (public)
- `PUT /api/leads/:id` - Update lead (admin)
- `DELETE /api/leads/:id` - Delete lead (admin)


## 🛠️ Development Workflow

### Running Both Applications

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

### Development Features

- **Frontend**: Hot reload with Vite, configured to use backend API
- **Backend**: Auto-restart with nodemon, MongoDB connection retry
- **CORS**: Configured for cross-origin requests between frontend and backend

## 🏗️ Building for Production

### Backend

```bash
cd backend
# Backend runs directly with Node.js
node app.js
```

### Frontend

```bash
cd frontend
npm run build
npm run preview  # To test the build locally
```

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables on your server
2. Install dependencies: `npm install --production`
3. Start with PM2 or similar: `pm2 start app.js`

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your static hosting service (Netlify, Vercel, etc.)
3. Update `VITE_API_BASE_URL` in production environment

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Enable CORS only for trusted domains in production
- Implement proper authentication and authorization for admin routes

## 📝 Key Features

- **Property Listings**: Browse and filter properties
- **Project Showcase**: View ongoing construction projects
- **Team Directory**: Meet the real estate team
- **Lead Management**: Contact form and lead tracking
- **Mobile Responsive**: Optimized for all devices
- **WhatsApp Integration**: Direct property inquiries
- **Call-to-Action**: Phone and WhatsApp buttons

## 🧪 Testing

### Backend Testing

```bash
cd backend
# Start MongoDB and the server
npm start
# Test API endpoints with curl or Postman
curl http://localhost:5000/api/properties
```

### Frontend Testing

```bash
cd frontend
npm run dev
# Open http://localhost:3000 in browser
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📞 Support

For support, contact:
- **Email**: info@giftrealestate.com
- **Phone**: +251 911 123 456
- **WhatsApp**: +251 911 123 456

## 📄 License

This project is proprietary software of Gift Real Estate.

---

**Note**: The JavaScript system (frontend/ + backend/) is an alternative implementation alongside the existing TypeScript system. Choose the approach that best fits your deployment needs.