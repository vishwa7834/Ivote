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
app.use(cors());
app.use(express.json());

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
// console.log('MongoDB connection skipped for Mock Admin mode');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/analytics', require('./routes/analytics'));

// Basic route
app.get('/', (req, res) => {
    res.send('iVote API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
