const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, rollNumber, password, role, faceDescriptor } = req.body;

        // Check if user exists
        let user = await User.findOne({ rollNumber });
        if (user) return res.status(400).json({ message: 'User with this Roll Number already exists' });

        user = await User.findOne({ phone });
        if (user) return res.status(400).json({ message: 'User with this Phone Number already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            phone,
            email,
            rollNumber,
            password: hashedPassword,
            role,
            faceDescriptor
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { rollNumber, password } = req.body;

        // Check for Admin Bypass
        if (rollNumber === 'vishwa7834@gmail.com' && password === '9486677834') {
            const token = jwt.sign(
                { id: 'static-admin-id', role: 'admin' },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '24h' }
            );
            return res.json({
                token,
                user: {
                    id: 'static-admin-id',
                    name: 'Admin',
                    role: 'admin',
                    rollNumber: 'vishwa7834@gmail.com',
                    hasVoted: true // Admins don't vote
                }
            });
        }

        const user = await User.findOne({ rollNumber });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                rollNumber: user.rollNumber,
                hasVoted: user.hasVoted
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users (for Admin Dashboard)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: 'If that email is registered, a reset link has been sent.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'iVote - Password Reset Request',
            html: `
                <h3>Password Reset Request</h3>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link is valid for 15 minutes.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'If that email is registered, a reset link has been sent.' });

    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user) return res.status(400).json({ message: 'Invalid token or user not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;
