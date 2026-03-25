const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const jwt = require('jsonwebtoken');
// Middleware to check if user is admin
const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Auth required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// GET /api/analytics/public-stats (Public stats for all users)
router.get('/public-stats', async (req, res) => {
    try {
        const totalVoters = await User.countDocuments({ role: 'student' });
        const votesCast = await User.countDocuments({ role: 'student', hasVoted: true });
        res.json({ totalVoters, votedVoters: votesCast });
    } catch (error) {
        console.error('Public Stats Error:', error);
        res.status(500).json({ message: 'Server error fetching public stats' });
    }
});

// GET /api/analytics/dashboard
router.get('/dashboard', authenticateAdmin, async (req, res) => {
    try {
        // 1. Total Voters (Students)
        const totalVoters = await User.countDocuments({ role: 'student' });

        // 2. Votes Cast
        const votesCast = await User.countDocuments({ role: 'student', hasVoted: true });

        // 3. Participation %
        const participation = totalVoters > 0 ? ((votesCast / totalVoters) * 100).toFixed(1) : 0;

        // 4. Active Issues (Pending Grievances)
        const activeIssues = await Grievance.countDocuments({ status: 'Pending' });

        res.json({
            totalVoters,
            votesCast,
            participation,
            activeIssues
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
});

module.exports = router;
