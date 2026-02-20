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

// Helper to calculate Euclidean distance between two descriptors
const getEuclideanDistance = (desc1, desc2) => {
    if (desc1.length !== desc2.length) return Infinity;
    return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
};

// Vote
router.post('/', authenticate, async (req, res) => {
    try {
        const { candidateId, liveFaceDescriptor } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (user.hasVoted) return res.status(400).json({ message: 'You have already voted' });

        if (!user.faceDescriptor || user.faceDescriptor.length === 0) {
            return res.status(400).json({ message: 'No face registered for this user. Please contact admin.' });
        }

        if (!liveFaceDescriptor) {
            return res.status(400).json({ message: 'Face verification is required to vote.' });
        }

        const distance = getEuclideanDistance(user.faceDescriptor, liveFaceDescriptor);

        // face-api.js default threshold is 0.6. We use 0.55 for slightly stricter security.
        if (distance > 0.55) {
            return res.status(401).json({ message: 'Face verification failed. Make sure you are the registered voter and in good lighting.' });
        }

        await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });
        await User.findByIdAndUpdate(userId, { hasVoted: true });

        res.json({ message: 'Vote cast successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
