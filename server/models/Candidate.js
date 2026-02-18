const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true }, // e.g., "President", "Secretary"
    manifesto: { type: String, required: true },
    promises: [{ type: String }],
    party: { type: String },
    votes: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' }
});

module.exports = mongoose.model('Candidate', candidateSchema);
