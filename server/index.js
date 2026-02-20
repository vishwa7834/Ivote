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
if (!process.env.MONGO_URI) {
    console.error('FATAL: MONGO_URI is not defined in environment variables');
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        env: {
            mongo: !!process.env.MONGO_URI,
            jwt: !!process.env.JWT_SECRET
        }
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
