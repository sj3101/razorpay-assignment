const { eq } = require('drizzle-orm');
const db = require('../config/db');
const { reimbursements } = require('../db/schema/reimbursements');

const createReimbursement = async (data) => {
  const result = await db.insert(reimbursements).values(data).returning();
  return result[0];
};

const getReimbursementsByEmployee = async (employeeId) => {
  const result = await db.select()
    .from(reimbursements)
    .where(eq(reimbursements.employeeId, employeeId));
  return result;
};

const getAllReimbursements = async () => {
  const result = await db.select().from(reimbursements);
  return result;
};

const getReimbursementById = async (id) => {
  const result = await db.select().from(reimbursements).where(eq(reimbursements.id, id)).limit(1);
  return result[0];
};

const updateReimbursementStatus = async (id, status) => {
  const result = await db.update(reimbursements)
    .set(typeof status === 'string' ? { finalStatus: status } : status)
    .where(eq(reimbursements.id, id))
    .returning();
  return result[0];
};

module.exports = {
  createReimbursement,
  getReimbursementsByEmployee,
  getAllReimbursements,
  getReimbursementById,
  updateReimbursementStatus,
};
