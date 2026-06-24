const { eq } = require('drizzle-orm');
const db = require('../config/db');
const { users } = require('../db/schema/users');

const createUser = async (data) => {
  const result = await db.insert(users).values(data).returning();
  return result[0];
};

const getUserByEmail = async (email) => {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
};

const getUserById = async (id) => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
