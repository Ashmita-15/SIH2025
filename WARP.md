# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Telemedicine MVP** built for SIH 2025, featuring a full-stack application with React frontend, Express.js backend, and MongoDB database. The system supports video consultations, appointment booking, health records management, pharmacy integration, and symptom checking.

## Development Commands

### Backend Development
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment (copy .env.example to .env if available, or set required variables)
# Required env vars: MONGO_URI, JWT_SECRET, FRONTEND_URL, PORT

# Seed the database with sample data
npm run seed

# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

### Frontend Development  
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Full Stack Development
```bash
# Run everything with Docker (from project root)
docker-compose up -d

# Stop Docker services
docker-compose down
```

## Architecture Overview

### Backend Architecture (Express.js + MongoDB)
- **MVC Pattern**: Clear separation of concerns with Models, Controllers, and Routes
- **Authentication**: JWT-based authentication with role-based access (patient, doctor, pharmacy)
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO for WebRTC signaling and real-time communication
- **API Structure**: RESTful APIs organized by feature domains

**Key Models:**
- `User` - Handles patients, doctors, and pharmacy accounts with role-based fields
- `Appointment` - Manages booking and scheduling
- `HealthRecord` - Patient medical records with PDF generation
- `Pharmacy` & `MedicineStock` - Pharmacy and inventory management

**Route Organization:**
- `/api/auth` - Authentication (login/register)
- `/api/appointments` - Appointment booking and management
- `/api/records` - Health records CRUD and PDF download
- `/api/pharmacy` - Medicine stock management
- `/api/symptom-checker` - Symptom analysis
- `/api/users` - User profile management

### Frontend Architecture (React + Vite)
- **React 18** with functional components and hooks
- **React Router** for navigation with role-based private routes
- **TailwindCSS** for styling
- **HashRouter** for deployment flexibility
- **i18n Support** with react-i18next for internationalization
- **Real-time Features**: Socket.IO client for video calls

**Component Structure:**
- **Pages**: Role-specific dashboards (Patient, Doctor, Pharmacy)
- **Components**: Reusable UI components (VideoCall, AppointmentBooking, SymptomChecker, etc.)
- **Services**: API integration layer
- **Error Handling**: ErrorBoundary component for graceful error handling

### Database Schema Design
- **Multi-role User System**: Single User model with role-specific fields
- **Appointment Management**: Links patients with doctors with status tracking  
- **Health Records**: Patient-centric medical records with file attachments
- **Pharmacy Integration**: Separate Pharmacy entity with MedicineStock inventory

### Real-time Communication
- **WebRTC**: Peer-to-peer video calling with Socket.IO signaling
- **Room-based Architecture**: Appointment-based room joining for video consultations

## Environment Configuration

### Backend Environment Variables
- `MONGO_URI` - MongoDB connection string (Atlas or local)
- `JWT_SECRET` - Secret for JWT token signing
- `FRONTEND_URL` - CORS origin for frontend (default: http://localhost:5173)
- `PORT` - Server port (default: 5000)

### Frontend Environment Variables  
- `VITE_API_URL` - Backend API base URL (default: http://localhost:5000/api)
- `VITE_SIGNAL_URL` - Socket.IO server URL (default: http://localhost:5000)

## Default Ports
- **Frontend**: 5173 (Vite dev server)
- **Backend**: 5000 (Express server)
- **MongoDB**: 27017 (local or containerized)

## Key Dependencies

### Backend
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **pdfkit** - PDF generation for health records
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router Dom** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **simple-peer** - WebRTC wrapper
- **react-i18next** - Internationalization
- **axios** - HTTP client

## Development Workflow

1. **Database Setup**: Ensure MongoDB is running and accessible
2. **Backend First**: Start backend server and verify API endpoints
3. **Seed Data**: Run `npm run seed` to populate with sample users and data
4. **Frontend Development**: Start Vite dev server with hot reload
5. **Full Integration**: Use Docker Compose for complete environment setup

## API Integration Patterns

- **Authentication**: Bearer token in Authorization header
- **Role-based Access**: Frontend route protection and backend middleware
- **Error Handling**: Consistent error response format across all endpoints
- **File Handling**: PDF generation and download for health records
- **Real-time**: Socket.IO rooms for video consultation signaling

## Notes

- The application uses **HashRouter** for deployment flexibility
- **No test suite** is currently configured
- **No linting/formatting** configuration (ESLint/Prettier) is set up
- The project includes **internationalization support** via react-i18next
- **Docker support** is available but not required for development
- **WebRTC video calling** is implemented with basic signaling server