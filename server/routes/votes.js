const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Auth required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Vote
router.post('/', authenticate, async (req, res) => {
    try {
        const { candidateId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (user.hasVoted) return res.status(400).json({ message: 'You have already voted' });

        await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });
        await User.findByIdAndUpdate(userId, { hasVoted: true });

        res.json({ message: 'Vote cast successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
