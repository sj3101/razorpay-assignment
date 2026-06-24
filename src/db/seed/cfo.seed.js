const bcrypt = require('bcrypt');
const { eq } = require('drizzle-orm');
const db = require('../../config/db');
const { users } = require('../schema/users');

const seedCFO = async () => {
  try {
    console.log('Seeding CFO...');
    const email = 'cfo@org.com';
    const password = 'CFO#ORG@April2026';
    
    const existingCFO = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingCFO.length > 0) {
      console.log('CFO account already exists. Skipping seed.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.insert(users).values({
      email,
      password: hashedPassword,
      role: 'CFO'
    });
    
    console.log('CFO account created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding CFO:', error);
    process.exit(1);
  }
};

seedCFO();
