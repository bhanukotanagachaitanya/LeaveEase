const connectDB = require('../config/db');
const User = require('../models/User');

const testLogin = async () => {
  await connectDB();
  const admin = await User.findOne({ email: 'admin@company.com' });
  console.log('Admin found:', admin ? {
    name: admin.name,
    employeeId: admin.employeeId,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    passwordHash: admin.password.substring(0, 15) + '...'
  } : 'NO ADMIN FOUND');

  if (admin) {
    const isMatch = await admin.matchPassword('Admin@123');
    console.log('Password Match for Admin@123:', isMatch);
  }
  process.exit(0);
};

testLogin();
