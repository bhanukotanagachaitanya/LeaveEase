const mongoose = require('mongoose');

const uri1 = "mongodb+srv://chaitanyaproid123_db_user:chaithu@cluster0.47kquu1.mongodb.net/employee_leave_db?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
  try {
    console.log('Testing Atlas connection...');
    await mongoose.connect(uri1);
    console.log('Successfully connected to MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

test();
