const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Candidate = require('./models/Candidate');
const Grievance = require('./models/Grievance');
const ProfileUpdateRequest = require('./models/ProfileUpdateRequest');

dotenv.config();

const hardReset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Hard Reset');

        // Delete all users
        const userResult = await User.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users.`);

        // Delete all candidates
        const candidateResult = await Candidate.deleteMany({});
        console.log(`Deleted ${candidateResult.deletedCount} candidates.`);

        // Delete Grievances
        const grievanceResult = await Grievance.deleteMany({});
        console.log(`Deleted ${grievanceResult.deletedCount} grievances.`);

        // Delete ProfileUpdateRequests
        const profileResult = await ProfileUpdateRequest.deleteMany({});
        console.log(`Deleted ${profileResult.deletedCount} profile update requests.`);

        console.log('Database hard reset successfully. Now run seed.js to restore admin and default user.');
        process.exit();
    } catch (err) {
        console.error('Error hard resetting database:', err);
        process.exit(1);
    }
};

hardReset();
