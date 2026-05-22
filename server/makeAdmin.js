const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the first user in the database
    const user = await User.findOne();
    
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`Success! User ${user.email} is now an ADMIN.`);
      console.log(`Please login with ${user.email} to see the Admin dashboard.`);
    } else {
      console.log('No users found in the database. Please register a user first.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();
