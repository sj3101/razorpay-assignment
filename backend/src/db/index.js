const enums = require('./enums');
const usersSchema = require('./schema/users');
const employeeManagerSchema = require('./schema/employeeManager');
const reimbursementsSchema = require('./schema/reimbursements');
const { relations } = require('drizzle-orm');

const usersRelations = relations(usersSchema.users, ({ many }) => ({
  reimbursements: many(reimbursementsSchema.reimbursements),
  asEmployee: many(employeeManagerSchema.employeeManager, { relationName: 'employeeRelation' }),
  asManager: many(employeeManagerSchema.employeeManager, { relationName: 'managerRelation' }),
}));

const employeeManagerRelations = relations(employeeManagerSchema.employeeManager, ({ one }) => ({
  employee: one(usersSchema.users, {
    fields: [employeeManagerSchema.employeeManager.employeeId],
    references: [usersSchema.users.id],
    relationName: 'employeeRelation',
  }),
  manager: one(usersSchema.users, {
    fields: [employeeManagerSchema.employeeManager.managerId],
    references: [usersSchema.users.id],
    relationName: 'managerRelation',
  }),
}));

const reimbursementsRelations = relations(reimbursementsSchema.reimbursements, ({ one }) => ({
  employee: one(usersSchema.users, {
    fields: [reimbursementsSchema.reimbursements.employeeId],
    references: [usersSchema.users.id],
  }),
}));

module.exports = {
  ...enums,
  ...usersSchema,
  ...employeeManagerSchema,
  ...reimbursementsSchema,
  usersRelations,
  employeeManagerRelations,
  reimbursementsRelations,
};
