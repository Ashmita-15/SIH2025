import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { attachSocketIO } from './middleware/socketMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import healthRecordRoutes from './routes/healthRecordRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import symptomCheckerRoutes from './routes/symptomCheckerRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST']
    }
});

// DB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(attachSocketIO(io)); // Attach socket.io to requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', healthRecordRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/symptom-checker', symptomCheckerRoutes);
app.use('/api/users', userRoutes);

// Simple health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Enhanced Socket.IO implementation
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Join user to their specific room for notifications
    socket.on('join-user-room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their room`);
    });
    
    // Join pharmacy to their specific room for orders
    socket.on('join-pharmacy-room', (pharmacyId) => {
        socket.join(`pharmacy_${pharmacyId}`);
        console.log(`Pharmacy ${pharmacyId} joined their room`);
    });
    
    // WebRTC signaling (existing functionality)
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('signal', ({ roomId, data }) => {
        socket.to(roomId).emit('signal', { from: socket.id, data });
    });
    
    // Real-time stock updates
    socket.on('subscribe-pharmacy-updates', (pharmacyId) => {
        socket.join(`pharmacy-updates-${pharmacyId}`);
        console.log(`Client subscribed to pharmacy ${pharmacyId} updates`);
    });
    
    socket.on('unsubscribe-pharmacy-updates', (pharmacyId) => {
        socket.leave(`pharmacy-updates-${pharmacyId}`);
        console.log(`Client unsubscribed from pharmacy ${pharmacyId} updates`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));


