const { eq } = require('drizzle-orm');
const db = require('../config/db');
const { employeeManager } = require('../db/schema/employeeManager');

const assignManager = async (employeeId, managerId) => {
  const result = await db.insert(employeeManager)
    .values({ employeeId, managerId })
    .returning();
  return result[0];
};

const getManagerByEmployeeId = async (employeeId) => {
  const result = await db.select()
    .from(employeeManager)
    .where(eq(employeeManager.employeeId, employeeId))
    .limit(1);
  return result[0];
};

module.exports = {
  assignManager,
  getManagerByEmployeeId,
};
