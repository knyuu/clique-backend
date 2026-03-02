import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import matchRoutes from './routes/matchRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server: ", error.message);
        process.exit(1);
    }
};

startServer();