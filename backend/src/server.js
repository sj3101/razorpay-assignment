require('dotenv').config();
const { sql } = require('drizzle-orm');
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 7002;

const startServer = async () => {
  try {
    // Verify Database Connection
    await db.execute(sql`SELECT 1`);
    console.log('Database connection successful');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database or start server:', error.message);
    process.exit(1);
  }
};

startServer();
