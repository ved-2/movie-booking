const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const adminUser = {
    username: 'admin',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin'
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
        await User.create(adminUser);
        console.log('Admin user created successfully');
    } else {
        console.log('Admin user already exists');
    }
    
    mongoose.disconnect();
})
.catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
}); 