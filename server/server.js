require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./config/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed initial admin & employee accounts if database is empty
    await seedData(false);

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Employee Leave Management Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
