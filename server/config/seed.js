const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Holiday = require('../models/Holiday');
const Notification = require('../models/Notification');
const connectDB = require('./db');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async (forceClear = false) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin && !forceClear) {
      console.log('ℹ️ Seed check: LeaveEase Admin account already exists. Skipping auto-seed.');
      return;
    }

    if (forceClear) {
      await User.deleteMany({});
      await LeaveRequest.deleteMany({});
      await Holiday.deleteMany({});
      await Notification.deleteMany({});
      console.log('🧹 Database cleared for fresh LeaveEase seeding...');
    }

    console.log('🌱 Seeding LeaveEase initial database records...');

    // 1. Create Admin Account
    const admin = await User.create({
      name: 'System Administrator',
      employeeId: 'ADM001',
      email: 'admin@company.com',
      password: 'Admin@123',
      department: 'Human Resources',
      role: 'admin',
      isActive: true,
      securityQuestion: 'What is your company security PIN?',
      securityAnswer: '9999'
    });

    // 2. Create Demo Employees
    const emp1 = await User.create({
      name: 'John Doe',
      employeeId: 'EMP101',
      email: 'emp1@company.com',
      password: 'Password123',
      department: 'Software Engineering',
      role: 'employee',
      isActive: true,
      securityQuestion: 'What is your favorite team initial?',
      securityAnswer: 'eng'
    });

    const emp2 = await User.create({
      name: 'Jane Smith',
      employeeId: 'EMP102',
      email: 'emp2@company.com',
      password: 'Password123',
      department: 'Product & Design',
      role: 'employee',
      isActive: true,
      securityQuestion: 'What city were you born in?',
      securityAnswer: 'boston'
    });

    const emp3 = await User.create({
      name: 'Alex Johnson',
      employeeId: 'EMP103',
      email: 'emp3@company.com',
      password: 'Password123',
      department: 'Finance & Operations',
      role: 'employee',
      isActive: true,
      securityQuestion: 'What is your employee initial security PIN?',
      securityAnswer: '1234'
    });

    // 3. Create Declared Holidays
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const holiday1Date = new Date(today);
    holiday1Date.setDate(today.getDate() + 10);

    const holiday2Date = new Date(today);
    holiday2Date.setDate(today.getDate() + 25);

    await Holiday.create([
      {
        name: 'Independence Day',
        occasion: 'National Freedom Celebration',
        description: 'Official national public holiday honoring national independence.',
        date: holiday1Date,
        type: 'National',
        createdBy: admin._id
      },
      {
        name: 'Company Foundation Day',
        occasion: 'Annual Corporate Milestone',
        description: 'Annual paid company retreat and celebration holiday.',
        date: holiday2Date,
        type: 'Company',
        createdBy: admin._id
      }
    ]);

    // 4. Create Initial Notifications
    await Notification.create([
      {
        userId: null,
        title: 'Welcome to LeaveEase',
        message: 'The new LeaveEase Leave Management portal is now live.',
        type: 'System'
      },
      {
        userId: emp1._id,
        title: 'System Access Granted',
        message: 'Your account is active. You can apply for annual leaves online.',
        type: 'Employee'
      }
    ]);

    // 5. Create Sample Leave Requests
    const future1 = new Date();
    future1.setDate(today.getDate() + 4);
    const future1End = new Date();
    future1End.setDate(today.getDate() + 7);

    const future2 = new Date();
    future2.setDate(today.getDate() + 12);
    const future2End = new Date();
    future2End.setDate(today.getDate() + 14);

    await LeaveRequest.create([
      {
        employeeId: emp1._id,
        leaveType: 'Annual Leave',
        fromDate: future1,
        toDate: future1End,
        totalDays: 4,
        reason: 'Family vacation and personal downtime.',
        status: 'Pending',
        remarks: ''
      },
      {
        employeeId: emp2._id,
        leaveType: 'Casual Leave',
        fromDate: future2,
        toDate: future2End,
        totalDays: 3,
        reason: 'Attending personal home renovation work.',
        status: 'Approved',
        remarks: 'Approved by HR manager.'
      }
    ]);

    console.log('✅ LeaveEase Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
  }
};

if (require.main === module) {
  connectDB().then(() => {
    seedData(true).then(() => {
      mongoose.connection.close();
      process.exit(0);
    });
  });
}

module.exports = seedData;
