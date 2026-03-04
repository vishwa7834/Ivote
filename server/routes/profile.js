const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ProfileUpdateRequest = require('../models/ProfileUpdateRequest');

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    });
};

// --- STUDENT ROUTES ---

// Get current profile and any pending requests
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -faceDescriptor');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const pendingRequest = await ProfileUpdateRequest.findOne({
            userId: req.user.id,
            status: 'pending'
        });

        res.json({
            profile: user,
            pendingRequest: pendingRequest || null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a profile update request
router.post('/request-update', authenticate, async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        // Check if there is already a pending request
        const existingRequest = await ProfileUpdateRequest.findOne({
            userId: req.user.id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending profile update request. Please wait for an admin to review it.' });
        }

        const newRequest = new ProfileUpdateRequest({
            userId: req.user.id,
            requestedChanges: { name, phone, email },
            status: 'pending'
        });

        await newRequest.save();
        res.status(201).json({ message: 'Profile update request submitted successfully. Awaiting admin approval.', request: newRequest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---

// Get all profile update requests
router.get('/requests', authenticateAdmin, async (req, res) => {
    try {
        const requests = await ProfileUpdateRequest.find()
            .populate('userId', 'name email phone rollNumber')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve or Reject a request
router.put('/requests/:id/resolve', authenticateAdmin, async (req, res) => {
    try {
        const { status, adminComment } = req.body; // status should be 'approved' or 'rejected'
        const requestId = req.params.id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await ProfileUpdateRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.status !== 'pending') return res.status(400).json({ message: 'Request has already been evaluated' });

        request.status = status;
        request.adminComment = adminComment || '';
        request.resolvedAt = Date.now();
        await request.save();

        if (status === 'approved') {
            // Apply the changes to the user
            const user = await User.findById(request.userId);
            if (user) {
                if (request.requestedChanges.name) user.name = request.requestedChanges.name;
                if (request.requestedChanges.phone) user.phone = request.requestedChanges.phone;
                if (request.requestedChanges.email) user.email = request.requestedChanges.email;
                await user.save();
            }
        }

        res.json({ message: `Request successfully ${status}`, request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
