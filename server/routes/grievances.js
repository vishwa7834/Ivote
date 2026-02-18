const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
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

// Create grievance
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const grievance = new Grievance({
            studentId: req.user.id,
            title,
            description,
            category
        });
        await grievance.save();
        res.status(201).json(grievance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all grievances (Public or Admin, public for transparency)
router.get('/', async (req, res) => {
    try {
        const grievances = await Grievance.find().populate('studentId', 'name');
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
