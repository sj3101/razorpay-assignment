const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { eq } = require('drizzle-orm');
const { users } = require('../schema/users');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  try {
    console.log('Seeding database...');
    const hashedPassword = await bcrypt.hash('CFO#ORG@April2026', 10);
    
    // Check if CFO already exists
    const existingCFO = await db.select().from(users).where(eq(users.email, 'cfo@org.com')).limit(1);
    
    if (existingCFO.length === 0) {
      await db.insert(users).values({
        email: 'cfo@org.com',
        password: hashedPassword,
        role: 'CFO',
      });
      console.log('CFO account created successfully.');
    } else {
      console.log('CFO account already exists. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seed();
