const { pgTable, uuid, text, numeric, timestamp } = require('drizzle-orm/pg-core');
const { approvalStatusEnum } = require('../enums');
const { users } = require('./users');

const reimbursements = pgTable('reimbursements', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  amount: numeric('amount').notNull(),
  rmApproval: approvalStatusEnum('rm_approval').default('PENDING').notNull(),
  apeApproval: approvalStatusEnum('ape_approval').default('PENDING').notNull(),
  finalStatus: approvalStatusEnum('final_status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { reimbursements };
