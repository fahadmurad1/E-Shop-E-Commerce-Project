const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI === 'your_mongodb_connection_string') {
        console.warn('WARNING: Invalid MONGO_URI. Skipping database connection for now.');
        return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
