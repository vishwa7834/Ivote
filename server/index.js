require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const voteRoutes = require('./routes/votes');
const grievanceRoutes = require('./routes/grievances');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for now to rule out CORS issues
    credentials: true
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database Connection
let lastConnectionError = null;

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) return;
        // Add 5s timeout to fail fast if firewall is blocking
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB connected');
        lastConnectionError = null;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        lastConnectionError = err.message;
    }
};

// Initial connection attempt
connectDB();

// Routes
app.get('/api/health', async (req, res) => {
    // Attempt reconnection if disconnected
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }

    const states = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
        99: 'Uninitialized',
    };
    const readyState = mongoose.connection.readyState;

    res.json({
        status: 'ok',
        database: states[readyState] || 'Unknown',
        readyState: readyState,
        lastError: lastConnectionError,
        env: {
            mongo: !!process.env.MONGO_URI,
            mongo_length: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
            jwt: !!process.env.JWT_SECRET
        },
        ip: req.ip // Show IP to see if proxy headers work
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/analytics', require('./routes/analytics'));

// Basic route
app.get('/', (req, res) => {
    res.send('iVote API is running');
});

// Export the app for Vercel Serverless
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
