const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    response: { type: String }
});

module.exports = mongoose.model('Grievance', grievanceSchema);
