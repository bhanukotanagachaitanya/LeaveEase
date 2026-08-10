const connectDB = require('../config/db');
const User = require('../models/User');

const checkUsers = async () => {
  await connectDB();
  const users = await User.find({});
  console.log('All Users Count:', users.length);
  users.forEach(u => {
    console.log(`- Name: ${u.name} | EmpID: ${u.employeeId} | Email: ${u.email} | Role: ${u.role} | Active: ${u.isActive}`);
  });
  process.exit(0);
};

checkUsers();
