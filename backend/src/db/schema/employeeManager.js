const { pgTable, uuid, timestamp, check } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');
const { users } = require('./users');

const employeeManager = pgTable('employee_manager', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => users.id).unique().notNull(),
  managerId: uuid('manager_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  differentUserCheck: check('different_user_check', sql`${table.employeeId} != ${table.managerId}`)
}));

module.exports = { employeeManager };
