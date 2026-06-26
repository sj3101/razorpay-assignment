const userRepository = require('../repositories/user.repository');
const employeeManagerRepository = require('../repositories/employee_manager.repository');

const assignManagerToEmployee = async (employeeId, managerId) => {
  if (employeeId === managerId) {
    throw new Error('Employee cannot be their own manager');
  }

  const employee = await userRepository.getUserById(employeeId);
  if (!employee) {
    throw new Error('Employee not found');
  }

  const manager = await userRepository.getUserById(managerId);
  if (!manager) {
    throw new Error('Manager not found');
  }
  
  if (manager.role !== 'RM') {
    throw new Error('Assigned user must have the RM role');
  }

  const existingAssignment = await employeeManagerRepository.getManagerByEmployeeId(employeeId);
  if (existingAssignment) {
    throw new Error('Employee already has an assigned manager');
  }

  return await employeeManagerRepository.assignManager(employeeId, managerId);
};

const getEmployeeProfile = async (id) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error('User not found');
  }
  
  const { password, ...profile } = user;

  const assignment = await employeeManagerRepository.getManagerByEmployeeId(id);
  if (assignment) {
    const manager = await userRepository.getUserById(assignment.managerId);
    if (manager) {
      profile.manager = {
        id: manager.id,
        name: manager.name,
        email: manager.email
      };
    }
  }

  return profile;
};

module.exports = {
  assignManagerToEmployee,
  getEmployeeProfile,
};
