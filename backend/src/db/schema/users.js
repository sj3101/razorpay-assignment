const { pgTable, uuid, text, timestamp } = require('drizzle-orm/pg-core');
const { roleEnum } = require('../enums');

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: roleEnum('role').default('EMP').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { users };
