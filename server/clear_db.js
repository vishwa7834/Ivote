const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Cleaning');

        // Delete all users
        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users from the database.`);

        // Optionally, seed just one Admin for management if needed, 
        // but user asked for "fresh registration", so maybe empty is best.
        // However, usually an Admin is needed to view the dashboard.
        // I will ask or just leave it empty as requested ("delete all details").

        console.log('Database cleared successfully.');
        process.exit();
    } catch (err) {
        console.error('Error clearing database:', err);
        process.exit(1);
    }
};

clearDatabase();
