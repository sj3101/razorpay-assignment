const { pgEnum } = require('drizzle-orm/pg-core');

const roleEnum = pgEnum('role_enum', ['EMP', 'RM', 'APE', 'CFO']);
const approvalStatusEnum = pgEnum('approval_status_enum', ['PENDING', 'APPROVED', 'REJECTED']);

module.exports = {
  roleEnum,
  approvalStatusEnum,
};
