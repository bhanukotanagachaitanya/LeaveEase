const mongoose = require('mongoose');
const dns = require('dns');

// Ensure SRV records can be resolved on ISPs / Windows networks where local DNS refuses SRV queries
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Fallback gracefully if setServers is not supported
}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_leave_db';

    const conn = await mongoose.connect(connStr);

    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
