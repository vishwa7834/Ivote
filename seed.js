const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash('password123', salt);
        const adminPassword = await bcrypt.hash('9486677834', salt);

        const users = [
            {
                name: 'Admin User',
                phone: '9999999999',
                rollNumber: 'vishwa7834@gmail.com', // Using email as the ID
                role: 'admin',
                password: adminPassword,
                email: 'vishwa7834@gmail.com'
            },
            {
                name: 'Vishwa',
                phone: '9876543210',
                rollNumber: 'VISHWA001',
                role: 'student',
                password: defaultPassword,
                email: 'vishwa@ivote.com'
            }
        ];

        for (let userData of users) {
            await User.findOneAndUpdate(
                { rollNumber: userData.rollNumber },
                { $set: userData },
                { upsert: true, new: true }
            );
            console.log(`Seeded/Updated: ${userData.rollNumber}`);
        }

        console.log('Seeding Complete. Default Password: password123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
